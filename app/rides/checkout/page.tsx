"use client";

import { useState, useEffect, Suspense } from "react";
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

interface Driver {
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  eta: number;
}

function RideCheckoutForm() {
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
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

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

      // Simulate driver assignment
      const mockDriver: Driver = {
        name: "John Driver",
        phone: "+254 700 123 456",
        rating: 4.8,
        vehicle: vehicle?.registration || "KCA 123A",
        eta: Math.floor(Math.random() * 5) + 3 // 3-8 minutes
      };
      setDriver(mockDriver);

      // Fetch user's wallet
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (user) {
        const { data: walletData } = await supabaseBrowser
          .from("wallets")
          .select("balance, pin")
          .eq("user_id", user.id)
          .single();
        
        setWallet(walletData);
      }
    };

    fetchBookingData();
  }, [searchParams]);

  const checkAuth = async () => {
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/rides/checkout");
      return;
    }
    setCheckingAuth(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleMpesaPayment = async () => {
    if (!mpesaPhone) {
      setMessage("Please enter your M-Pesa phone number");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: mpesaPhone,
          amount: booking?.price || 0,
          bookingId: booking?.vehicleId
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage("M-Pesa prompt sent to your phone. Please complete the payment.");
        // Store pending booking
        await storePendingBooking("mpesa", mpesaPhone);
      } else {
        setMessage("Payment failed: " + result.message);
      }
    } catch (error) {
      console.error("M-Pesa payment error:", error);
      setMessage("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEwalletPayment = async () => {
    if (!walletPin) {
      setMessage("Please enter your wallet PIN");
      return;
    }

    if (!wallet) {
      setMessage("Wallet not found");
      return;
    }

    if (wallet.balance < (booking?.price || 0)) {
      setMessage("Insufficient wallet balance");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        setMessage("User not authenticated");
        return;
      }

      // Verify PIN and process payment
      const { error } = await supabaseBrowser
        .from("wallets")
        .update({ 
          balance: wallet.balance - (booking?.price || 0) 
        })
        .eq("user_id", user.id);

      if (error) {
        setMessage("Payment failed: " + error.message);
      } else {
        setMessage("Payment successful! Your ride is confirmed.");
        setBookingConfirmed(true);
        await storePendingBooking("ewallet", "");
      }
    } catch (error) {
      console.error("E-wallet payment error:", error);
      setMessage("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBankPayment = async () => {
    if (!bankDetails.account || !bankDetails.bank) {
      setMessage("Please enter your bank details");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Store pending booking for bank payment
      await storePendingBooking("bank", JSON.stringify(bankDetails));
      setMessage("Bank payment request submitted. You will receive confirmation shortly.");
    } catch (error) {
      console.error("Bank payment error:", error);
      setMessage("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setupWalletPin = async () => {
    if (newPin !== confirmPin) {
      setMessage("PINs do not match");
      return;
    }

    if (newPin.length !== 4) {
      setMessage("PIN must be 4 digits");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        setMessage("User not authenticated");
        return;
      }

      const { error } = await supabaseBrowser
        .from("wallets")
        .update({ pin: newPin })
        .eq("user_id", user.id);

      if (error) {
        setMessage("Failed to set PIN: " + error.message);
      } else {
        setMessage("PIN set successfully!");
        setShowPinSetup(false);
        setNewPin("");
        setConfirmPin("");
        // Refresh wallet data
        const { data: walletData } = await supabaseBrowser
          .from("wallets")
          .select("balance, pin")
          .eq("user_id", user.id)
          .single();
        setWallet(walletData);
      }
    } catch (error) {
      console.error("PIN setup error:", error);
      setMessage("Failed to set PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const storePendingBooking = async (paymentMethod: string, paymentDetails: string) => {
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user || !booking) return;

      const { error } = await supabaseBrowser
        .from("pending_bookings")
        .insert({
          user_id: user.id,
          pickup: booking.pickup,
          dropoff: booking.dropoff,
          vehicle_class: booking.vehicleClass,
          vehicle_id: booking.vehicleId,
          price: booking.price,
          payment_method: paymentMethod,
          payment_details: paymentDetails,
          status: "pending"
        });

      if (error) {
        console.error("Error storing pending booking:", error);
      }
    } catch (error) {
      console.error("Error storing pending booking:", error);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Booking</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <button
            onClick={() => router.push("/rides")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Book Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>
        
        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">From</p>
              <p className="font-semibold">{booking.pickup}</p>
            </div>
            <div>
              <p className="text-gray-600">To</p>
              <p className="font-semibold">{booking.dropoff}</p>
            </div>
            <div>
              <p className="text-gray-600">Vehicle Class</p>
              <p className="font-semibold">{booking.vehicleClass}</p>
            </div>
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-semibold text-green-600">KES {booking.price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        {driver && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Driver</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{driver.name}</p>
                <p className="text-gray-600">{driver.phone}</p>
                <p className="text-sm text-gray-500">Rating: {driver.rating} ⭐</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-semibold">{driver.vehicle}</p>
                <p className="text-sm text-green-600">ETA: {driver.eta} min</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {!bookingConfirmed && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            
            <div className="space-y-4">
              {/* M-Pesa */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={(e) => setPaymentMethod(e.target.value as "mpesa")}
                    className="text-blue-600"
                  />
                  <span className="font-semibold">M-Pesa</span>
                </label>
                {paymentMethod === "mpesa" && (
                  <div className="mt-3">
                    <input
                      type="tel"
                      placeholder="Enter M-Pesa phone number"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <button
                      onClick={handleMpesaPayment}
                      disabled={loading}
                      className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Pay with M-Pesa"}
                    </button>
                  </div>
                )}
              </div>

              {/* E-Wallet */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="ewallet"
                    checked={paymentMethod === "ewallet"}
                    onChange={(e) => setPaymentMethod(e.target.value as "ewallet")}
                    className="text-blue-600"
                  />
                  <span className="font-semibold">E-Wallet</span>
                  {wallet && <span className="text-sm text-gray-600">(KES {wallet.balance.toLocaleString()})</span>}
                </label>
                {paymentMethod === "ewallet" && (
                  <div className="mt-3">
                    {!wallet?.pin ? (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Set up your wallet PIN first</p>
                        <button
                          onClick={() => setShowPinSetup(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Set PIN
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="password"
                          placeholder="Enter wallet PIN"
                          value={walletPin}
                          onChange={(e) => setWalletPin(e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                        <button
                          onClick={handleEwalletPayment}
                          disabled={loading}
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {loading ? "Processing..." : "Pay with E-Wallet"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bank Transfer */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value as "bank")}
                    className="text-blue-600"
                  />
                  <span className="font-semibold">Bank Transfer</span>
                </label>
                {paymentMethod === "bank" && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Bank name"
                      value={bankDetails.bank}
                      onChange={(e) => setBankDetails({ ...bankDetails, bank: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Account number"
                      value={bankDetails.account}
                      onChange={(e) => setBankDetails({ ...bankDetails, account: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                    <button
                      onClick={handleBankPayment}
                      disabled={loading}
                      className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Submit Bank Details"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded ${
                message.includes("successful") || message.includes("sent") 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {message}
              </div>
            )}
          </div>
        )}

        {/* PIN Setup Modal */}
        {showPinSetup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Set Wallet PIN</h3>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full p-2 border rounded"
                  maxLength={4}
                />
                <input
                  type="password"
                  placeholder="Confirm PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="w-full p-2 border rounded"
                  maxLength={4}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={setupWalletPin}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Setting..." : "Set PIN"}
                  </button>
                  <button
                    onClick={() => setShowPinSetup(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Confirmed */}
        {bookingConfirmed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h2>
            <p className="text-green-700 mb-4">Your ride has been booked successfully.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default function RideCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    }>
      <RideCheckoutForm />
    </Suspense>
  );
} 