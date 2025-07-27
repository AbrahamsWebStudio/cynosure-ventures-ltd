import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("MPESA Callback Received:", JSON.stringify(body, null, 2));

    const resultCode = body.Body.stkCallback.ResultCode;
    const metadata = body.Body.stkCallback.CallbackMetadata?.Item || [];
    const amount = metadata.find((item: { Name: string; Value: string }) => item.Name === "Amount")?.Value;
    const phoneNumber = metadata.find((item: { Name: string; Value: string }) => item.Name === "PhoneNumber")?.Value;
    const checkoutRequestID = body.Body.stkCallback.CheckoutRequestID;

    if (resultCode === 0) {
      // 1️⃣ Get user_id from profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone", phoneNumber)
        .maybeSingle();

      if (profileError || !profile) {
        console.error("User with phone not found:", phoneNumber, profileError);
        return NextResponse.json({ message: "User with this phone not found." }, { status: 404 });
      }

      const userId = profile.id;

      // 2️⃣ Check if transaction already exists
      const { data: existingTxn, error: txnError } = await supabase
        .from("transactions")
        .select("*")
        .eq("reference", checkoutRequestID)
        .maybeSingle();

      if (txnError) {
        console.error("Error checking transaction:", txnError);
        return NextResponse.json({ message: "Error checking transaction" }, { status: 500 });
      }

      if (existingTxn) {
        console.log("Transaction already processed, skipping.");
        return NextResponse.json({ message: "Transaction already processed, skipping." });
      }

      // 3️⃣ Insert transaction record
      const { error: insertTxnError } = await supabase
        .from("transactions")
        .insert([{
          user_id: userId,
          type: "deposit",
          amount,
          status: "completed",
          reference: checkoutRequestID
        }]);

      if (insertTxnError) {
        console.error("Error inserting transaction:", insertTxnError);
        return NextResponse.json({ message: "Error inserting transaction" }, { status: 500 });
      }

      // 4️⃣ Check if this is a ride payment or wallet top-up
      const { data: pendingRide } = await supabase
        .from("rides")
        .select("*")
        .eq("status", "pending_payment")
        .eq("payment_method", "mpesa")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (pendingRide) {
        // This is a ride payment - update the ride status
        const { error: rideError } = await supabase
          .from("rides")
          .update({ 
            status: "confirmed",
            payment_status: "completed"
          })
          .eq("id", pendingRide.id);

        if (rideError) {
          console.error("Error updating ride status:", rideError);
          return NextResponse.json({ message: "Error updating ride status" }, { status: 500 });
        }

        // Insert transaction for ride payment
        const { error: txnError } = await supabase
          .from("transactions")
          .insert({
            user_id: userId,
            type: "ride_payment",
            amount: pendingRide.price,
            status: "completed",
            reference: checkoutRequestID
          });

        if (txnError) {
          console.error("Error inserting ride transaction:", txnError);
        }
      } else {
        // This is a wallet top-up
        const { error: walletError } = await supabase.rpc("increment_wallet_balance", {
          p_user_id: userId,
          p_amount: amount
        });

        if (walletError) {
          console.error("Error updating wallet balance:", walletError);
          return NextResponse.json({ message: "Error updating wallet balance" }, { status: 500 });
        }
      }

      return NextResponse.json({ message: "Wallet updated successfully" });
    } else {
      console.log("Payment failed or cancelled, ResultCode:", resultCode);
      return NextResponse.json({ message: "Payment was not successful" });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Callback error:", errorMessage);
    return NextResponse.json({ message: "Server error processing callback" }, { status: 500 });
  }
}
