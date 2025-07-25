"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    setLoading(true);
    // Here you would integrate MPESA or Supabase function call for payment
    setTimeout(() => {
      clearCart();
      setLoading(false);
      alert("Payment successful! Order placed.");
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <p className="text-lg">Your cart is empty.</p>
        <Link href="/products" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center border p-3 rounded">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p>KES {item.price * item.quantity}</p>
          </div>
        ))}
      </div>
      <p className="text-xl font-semibold mb-4 text-right">Total: KES {total}</p>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
      >
        {loading ? "Processing Payment..." : "Pay with MPESA"}
      </button>
    </div>
  );
}
