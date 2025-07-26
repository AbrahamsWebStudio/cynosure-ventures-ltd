// /app/api/mpesa/stk-push/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { phone, amount } = await req.json();

    const consumerKey = process.env.MPESA_CONSUMER_KEY!;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
    const shortcode = "174379"; // Sandbox shortcode
    const passkey = process.env.MPESA_PASSKEY!; // Get from Safaricom portal

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    // Get access token
    const { data: tokenData } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const access_token = tokenData.access_token;

    // Timestamp in format YYYYMMDDHHMMSS
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:\.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const callbackURL = `${process.env.NGROK_URL}/api/mpesa-callback`; // Update with your URL

    const stkPushData = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackURL,
      AccountReference: "CYNOSURE-VENTURES-LTDTopUp",
      TransactionDesc: "Wallet Top-Up",
    };

    const { data: stkResponse } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPushData,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    return NextResponse.json(stkResponse);
  } catch (error: any) {
    console.error("MPESA STK Push Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
