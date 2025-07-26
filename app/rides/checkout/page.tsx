"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface RideBooking {
  pickup: string;
  dropoff: string;
  vehicleClass: string;
  vehicleId: string;
  price: number;
  vehicleDetails?: {
    registration: string;
    make: string | null;
    model: string | null;
  };
}

interface Wallet {
  balance: number;
  pin: string | null;
}

export default function RideCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<RideBooking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "ewallet" | "bank" | "">("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [bankDetails, setBankDetails] = useState({ account: "", bank: "" });
  const [walletPin, setWalletPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPinSetup, setShowPinSetup] = useState(false);

  useEffect(() => {
    const fetchBookingData = async () => {
      const pickup = searchParams.get("pickup");
      const dropoff = searchParams.get("dropoff");
      const vehicleClass = searchParams.get("vehicleClass");
      const vehicleId = searchParams.get("vehicleId");
      const price = searchParams.get("price");

      if (!pickup || !dropoff || !vehicleClass || !vehicleId || !price) {
        setMessage("Invalid booking data. Please try again.");
        return;
      }

      // Fetch vehicle details
      const { data: vehicle } = await supabaseBrowser
        .from("vehicles")
        .select("registration, make, model")
        .eq("id", vehicleId)
        .single();

      setBooking({
        pickup,
        dropoff,
        vehicleClass,
        vehicleId,
        price: parseInt(price),
        vehicleDetails: vehicle || undefined
      });

      // Fetch user's wallet
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (user) {
        const { data: walletData } = await supabaseBrowser
          .from("wallets")
          .select("balance, pin")
          .eq("user_id", user.id)
          .single();
        
        setWallet(walletData || { balance: 0, pin: null });
      }
    };

    fetchBookingData();
  }, [searchParams]);

  const handleMpesaPayment = async () => {
    if (!mpesaPhone) {
      setMessage("Please enter your MPESA phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: mpesaPhone, 
          amount: booking?.price,
          bookingId: booking?.vehicleId 
        }),
      });
      const data = await res.json();
      
      if (data.CheckoutRequestID) {
        setMessage("✅ MPESA payment prompt sent to your phone. Please complete the payment.");
        // Store pending booking
        await storePendingBooking();
      } else {
        setMessage("❌ Failed to initiate MPESA payment. Please try again.");
      }
    } catch (error) {
      setMessage("❌ Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEwalletPayment = async () => {
    if (!wallet) {
      setMessage("❌ Wallet not found. Please contact support.");
      return;
    }

    if (wallet.balance < (booking?.price || 0)) {
      setMessage("❌ Insufficient wallet balance. Please top up your wallet.");
      return;
    }

    if (!wallet.pin) {
      setShowPinSetup(true);
      return;
    }

    if (!walletPin) {
      setMessage("❌ Please enter your wallet PIN.");
      return;
    }

    // Verify PIN and process payment
    setLoading(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Verify PIN (in production, this should be hashed)
      if (wallet.pin !== walletPin) {
        setMessage("❌ Invalid PIN. Please try again.");
        setLoading(false);
        return;
      }

      // Process e-wallet payment
      let error;
      try {
        const result = await supabaseBrowser.rpc("process_ewallet_payment", {
          p_user_id: user.id,
          p_amount: booking?.price || 0,
          p_booking_type: "ride",
          p_vehicle_id: booking?.vehicleId,
          p_pickup: booking?.pickup,
          p_dropoff: booking?.dropoff,
          p_vehicle_class: booking?.vehicleClass
        });
        error = result.error;
      } catch (funcError) {
        // Fallback to simpler function if the main one fails
        console.log("Trying fallback function...");
        const result = await supabaseBrowser.rpc("process_ride_payment_simple", {
          p_user_id: user.id,
          p_amount: booking?.price || 0,
          p_vehicle_id: booking?.vehicleId,
          p_pickup: booking?.pickup,
          p_dropoff: booking?.dropoff,
          p_vehicle_class: booking?.vehicleClass
        });
        error = result.error;
      }

      if (error) {
        setMessage("❌ Payment failed. Please try again.");
      } else {
        setMessage("✅ Payment successful! Your ride has been booked.");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      setMessage("❌ Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBankPayment = async () => {
    if (!bankDetails.account || !bankDetails.bank) {
      setMessage("❌ Please fill in all bank details.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Store bank payment request
      const { error } = await supabaseBrowser.from("bank_payments").insert({
        user_id: user.id,
        amount: booking?.price,
        bank: bankDetails.bank,
        account_number: bankDetails.account,
        status: "pending",
        booking_type: "ride",
        vehicle_id: booking?.vehicleId,
        pickup_location: booking?.pickup,
        dropoff_location: booking?.dropoff,
        vehicle_class: booking?.vehicleClass
      });

      if (error) {
        setMessage("❌ Failed to process bank payment request.");
      } else {
        setMessage("✅ Bank payment request submitted. We'll contact you for confirmation.");
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    } catch (error) {
      setMessage("❌ Payment request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setupWalletPin = async () => {
    if (newPin !== confirmPin) {
      setMessage("❌ PINs do not match. Please try again.");
      return;
    }

    if (newPin.length !== 4) {
      setMessage("❌ PIN must be 4 digits.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabaseBrowser
        .from("wallets")
        .update({ pin: newPin })
        .eq("user_id", user.id);

      if (error) {
        setMessage("❌ Failed to set PIN. Please try again.");
      } else {
        setMessage("✅ PIN set successfully!");
        setShowPinSetup(false);
        setWallet(prev => prev ? { ...prev, pin: newPin } : null);
        // Now process the payment
        setWalletPin(newPin);
        setTimeout(() => handleEwalletPayment(), 1000);
      }
    } catch (error) {
      setMessage("❌ Failed to set PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const storePendingBooking = async () => {
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabaseBrowser.from("rides").insert({
        user_id: user.id,
        pickup_location: booking?.pickup,
        dropoff_location: booking?.dropoff,
        vehicle_class: booking?.vehicleClass,
        vehicle_id: booking?.vehicleId,
        price: booking?.price,
        status: "pending_payment",
        payment_method: "mpesa"
      });

      if (error) {
        console.error("Failed to store pending booking:", error);
      }
    } catch (error) {
      console.error("Error storing pending booking:", error);
    }
  };

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl">{message || "Loading..."}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-black text-white min-h-[80vh] flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="text-blue-400 hover:text-white transition flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Book Again
            </button>
            <h1 className="text-3xl font-extrabold text-center">Complete Your Booking</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
          <p className="text-gray-400 text-center mb-6">Choose your preferred payment method</p>

          {/* Booking Summary */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">From:</span> {booking.pickup}</p>
              <p><span className="text-gray-400">To:</span> {booking.dropoff}</p>
              <p><span className="text-gray-400">Vehicle:</span> {booking.vehicleDetails?.registration} - {booking.vehicleDetails?.make} {booking.vehicleDetails?.model}</p>
              <p><span className="text-gray-400">Class:</span> {booking.vehicleClass}</p>
              <p className="text-xl font-bold text-green-400">Total: KES {booking.price}</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="mpesa"
                name="payment"
                value="mpesa"
                checked={paymentMethod === "mpesa"}
                onChange={(e) => setPaymentMethod(e.target.value as "mpesa")}
                className="text-blue-600"
              />
              <label htmlFor="mpesa" className="text-lg">MPESA</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="ewallet"
                name="payment"
                value="ewallet"
                checked={paymentMethod === "ewallet"}
                onChange={(e) => setPaymentMethod(e.target.value as "ewallet")}
                className="text-blue-600"
              />
              <label htmlFor="ewallet" className="text-lg">E-Wallet (KES {wallet?.balance || 0})</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="bank"
                name="payment"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={(e) => setPaymentMethod(e.target.value as "bank")}
                className="text-blue-600"
              />
              <label htmlFor="bank" className="text-lg">Bank Transfer</label>
            </div>
          </div>

          {/* MPESA Payment Form */}
          {paymentMethod === "mpesa" && (
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Enter MPESA phone number"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                className="border border-gray-700 bg-gray-900 rounded p-3 w-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
              <button
                onClick={handleMpesaPayment}
                disabled={loading}
                className="w-full bg-green-600 text-white rounded p-3 text-lg font-semibold hover:bg-white hover:text-green-600 border border-green-600 transition transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay with MPESA"}
              </button>
            </div>
          )}

          {/* E-Wallet Payment Form */}
          {paymentMethod === "ewallet" && (
            <div className="space-y-4 mb-6">
              {showPinSetup ? (
                <div className="space-y-4">
                  <p className="text-center text-yellow-400">Set up your wallet PIN</p>
                  <input
                    type="password"
                    placeholder="Enter 4-digit PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    maxLength={4}
                    className="border border-gray-700 bg-gray-900 rounded p-3 w-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                  <input
                    type="password"
                    placeholder="Confirm PIN"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    maxLength={4}
                    className="border border-gray-700 bg-gray-900 rounded p-3 w-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                  <button
                    onClick={setupWalletPin}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded p-3 text-lg font-semibold hover:bg-white hover:text-blue-600 border border-blue-600 transition transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Setting PIN..." : "Set PIN & Pay"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Enter wallet PIN"
                    value={walletPin}
                    onChange={(e) => setWalletPin(e.target.value)}
                    maxLength={4}
                    className="border border-gray-700 bg-gray-900 rounded p-3 w-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                  <button
                    onClick={handleEwalletPayment}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded p-3 text-lg font-semibold hover:bg-white hover:text-blue-600 border border-blue-600 transition transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Pay with E-Wallet"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bank Payment Form */}
          {paymentMethod === "bank" && (
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Bank Name"
                value={bankDetails.bank}
                onChange={(e) => setBankDetails({ ...bankDetails, bank: e.target.value })}
                className="border border-gray-700 bg-gray-900 rounded p-3 w-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
              <input
                type="text"
                placeholder="Account Number"
                value={bankDetails.account}
                onChange={(e) => setBankDetails({ ...bankDetails, account: e.target.value })}
                className="border border-gray-700 bg-gray-900 rounded p-3 w-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
              <button
                onClick={handleBankPayment}
                disabled={loading}
                className="w-full bg-purple-600 text-white rounded p-3 text-lg font-semibold hover:bg-white hover:text-purple-600 border border-purple-600 transition transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? "Processing..." : "Submit Bank Payment"}
              </button>
            </div>
          )}

          {message && (
            <p className={`mt-4 text-center text-lg ${message.includes("✅") ? "text-green-400" : message.includes("❌") ? "text-red-400" : "text-yellow-400"}`}>
              {message}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 