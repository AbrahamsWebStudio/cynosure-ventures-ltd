// Moved from app/finance/wallet/add-funds/page.tsx
'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const TILL_NUMBER = '8295165';
// TODO: Replace with actual Wallet Top-Up product ID from your database
const WALLET_TOP_UP_PRODUCT_ID = '00000000-0000-0000-0000-000000000001';

export default function AddFundsPage() {
  const [method, setMethod] = useState<'bank' | 'mpesa' | 'paypal' | null>(null);
  const [mpesaCode, setMpesaCode] = useState('');
  const [showConfirmationInput, setShowConfirmationInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleConfirmPayment = () => {
    setShowConfirmationInput(true);
  };

  const handleSubmitMpesaPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaCode) {
      setMessage('Please enter the Mpesa confirmation code.');
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create an order record for wallet top-up (same as product orders)
      const { error } = await supabaseBrowser.from("orders").insert({
        user_id: user.id,
        product_id: WALLET_TOP_UP_PRODUCT_ID,
        quantity: 1,
        total_amount: 0, // Amount will be determined by admin verification
        status: "pending",
        payment_method: "mpesa",
        confirmation_code: mpesaCode,
      });

      if (error) {
        setMessage("❌ Failed to submit payment. Please try again.");
      } else {
        setMessage("✅ Payment submitted successfully! Your wallet top-up is pending approval. You will be notified once payment is verified.");
        setMpesaCode("");
        setShowConfirmationInput(false);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      setMessage("❌ Failed to submit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Funds</h1>
      {!method && (
        <>
          <p className="mb-4">Choose a payment method:</p>
          <div className="space-y-2">
            <button onClick={() => setMethod('mpesa')} className="w-full bg-green-600 text-white py-2 rounded">Lipa na Mpesa</button>
            <button onClick={() => setMethod('bank')} className="w-full bg-blue-600 text-white py-2 rounded">Bank Transfer</button>
            <button onClick={() => setMethod('paypal')} className="w-full bg-gray-800 text-white py-2 rounded">PayPal</button>
          </div>
        </>
      )}
      {method === 'mpesa' && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Lipa na Mpesa</h2>
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
            <p className="font-bold text-green-800 mb-2">Till Number: <span className="text-2xl">{TILL_NUMBER}</span></p>
            <div className="bg-white rounded p-3 mb-4">
              <p className="text-sm font-medium text-gray-800 mb-2">Payment Steps:</p>
              <ol className="text-xs text-gray-700 list-decimal ml-5 space-y-1">
                <li>Go to your Mpesa menu and select <strong>Lipa na Mpesa</strong></li>
                <li>Select <strong>Buy Goods and Services</strong></li>
                <li>Enter Till Number: <strong>{TILL_NUMBER}</strong></li>
                <li>Enter the amount you want to add to your wallet</li>
                <li>Enter your Mpesa PIN and complete payment</li>
                <li>Copy the confirmation code from the SMS you receive</li>
              </ol>
            </div>
            {!showConfirmationInput ? (
              <div className="space-y-3">
                <button 
                  onClick={handleConfirmPayment}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-xl hover:bg-white hover:text-green-600 hover:border hover:border-green-600 transition shadow hover:shadow-lg"
                >
                  Confirm Payment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitMpesaPayment} className="space-y-3">
                <input
                  type="text"
                  placeholder="QFRT234..."
                  value={mpesaCode}
                  onChange={e => setMpesaCode(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-xl hover:bg-white hover:text-green-600 hover:border hover:border-green-600 transition shadow hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Submit Confirmation Code"}
                </button>
              </form>
            )}
            {message && (
              <p className={`mt-3 text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </div>
          <button onClick={() => setMethod(null)} className="mt-4 text-sm text-gray-500 underline">Back to payment options</button>
        </div>
      )}
      {method === 'bank' && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Bank Transfer</h2>
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
            <p className="font-bold text-blue-800 mb-2">Bank details go here...</p>
            {/* Add your bank details and instructions */}
          </div>
          <button onClick={() => setMethod(null)} className="mt-4 text-sm text-gray-500 underline">Back to payment options</button>
        </div>
      )}
      {method === 'paypal' && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">PayPal</h2>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
            <p className="font-bold text-gray-800 mb-2">PayPal instructions go here...</p>
            {/* Add your PayPal integration or instructions */}
          </div>
          <button onClick={() => setMethod(null)} className="mt-4 text-sm text-gray-500 underline">Back to payment options</button>
        </div>
      )}
    </div>
  );
} 