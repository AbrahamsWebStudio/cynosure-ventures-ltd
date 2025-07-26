"use client";

import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Wallet {
  balance: number;
  pin: string | null;
}

export default function CheckoutPage() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "ewallet" | "bank" | "">("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [bankDetails, setBankDetails] = useState({ account: "", bank: "" });
  const [walletPin, setWalletPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [message, setMessage] = useState("");
  const [showPinSetup, setShowPinSetup] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const router = useRouter();

  // Fetch user's wallet
  useEffect(() => {
    const fetchWallet = async () => {
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
    fetchWallet();
  }, []);

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
          amount: total
        }),
      });
      const data = await res.json();
      
      if (data.CheckoutRequestID) {
        setMessage("✅ MPESA payment prompt sent to your phone. Please complete the payment.");
        // Store pending order
        await storePendingOrder();
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

    if (wallet.balance < total) {
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

      // Process e-wallet payment for products
      const { error } = await supabaseBrowser.rpc("process_ewallet_product_payment", {
        p_user_id: user.id,
        p_amount: total,
        p_cart_items: cart
      });

      if (error) {
        setMessage("❌ Payment failed. Please try again.");
      } else {
        setMessage("✅ Payment successful! Your order has been placed.");
        clearCart();
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
        amount: total,
        bank: bankDetails.bank,
        account_number: bankDetails.account,
        status: "pending",
        booking_type: "product_order",
        cart_items: cart
      });

      if (error) {
        setMessage("❌ Failed to process bank payment request.");
      } else {
        setMessage("✅ Bank payment request submitted. We'll contact you for confirmation.");
        clearCart();
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

  const storePendingOrder = async () => {
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Store pending order for each cart item
      for (const item of cart) {
        const { error } = await supabaseBrowser.from("orders").insert({
          user_id: user.id,
          product_id: item.id,
          quantity: 1,
          total_amount: item.price,
          status: "pending_payment",
          payment_method: "mpesa"
        });

        if (error) {
          console.error("Failed to store pending order:", error);
        }
      }
    } catch (error) {
      console.error("Error storing pending order:", error);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center p-4">
          <p className="text-2xl">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-white hover:text-blue-600 border border-blue-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-black text-white min-h-[80vh]">

        {/* Back to Products Button */}
        <Link
          href="/products"
          className="text-lg text-blue-600 hover:text-white hover:underline transition flex items-center mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
        <br /><br />
        <h1 className="text-4xl font-bold mb-6 text-center">Your Cart</h1>
        <div className="space-y-4 mb-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-800 rounded-lg shadow hover:shadow-lg p-4 transition transform hover:-translate-y-1"
            >
              <div>
                <p className="text-xl font-semibold">{item.title}</p>
                <p className="text-gray-300 text-lg">KES {item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                className="text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <p className="text-2xl font-bold mb-4 text-right">Total: KES {total}</p>
        
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
              className="text-green-600"
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
              className="text-purple-600"
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
              className="border border-gray-700 bg-gray-900 rounded p-3 w-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
            />
            <button
              onClick={handleMpesaPayment}
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-xl hover:bg-white hover:text-green-600 hover:border hover:border-green-600 transition shadow hover:shadow-lg disabled:opacity-50"
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
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-xl hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 transition shadow hover:shadow-lg disabled:opacity-50"
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
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-xl hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 transition shadow hover:shadow-lg disabled:opacity-50"
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
              className="border border-gray-700 bg-gray-900 rounded p-3 w-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
            <input
              type="text"
              placeholder="Account Number"
              value={bankDetails.account}
              onChange={(e) => setBankDetails({ ...bankDetails, account: e.target.value })}
              className="border border-gray-700 bg-gray-900 rounded p-3 w-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            />
            <button
              onClick={handleBankPayment}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold text-xl hover:bg-white hover:text-purple-600 hover:border hover:border-purple-600 transition shadow hover:shadow-lg disabled:opacity-50"
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
      <Footer />
    </>
  );
}
