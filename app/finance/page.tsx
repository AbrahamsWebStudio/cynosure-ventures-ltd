// ✅ /app/finance/page.tsx for Quantum Leap Tech

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function FinancePage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
      if (!error) setTransactions(data);
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  if (loading) return <div className="p-4">Loading finance dashboard...</div>;

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Finance Dashboard</h1>
      <table className="min-w-full border rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Date</th>
            <th className="p-2">User</th>
            <th className="p-2">Type</th>
            <th className="p-2">Amount (KES)</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t hover:bg-gray-50">
              <td className="p-2 text-sm">{new Date(tx.created_at).toLocaleDateString()}</td>
              <td className="p-2 text-sm">{tx.user_email || 'N/A'}</td>
              <td className="p-2 text-sm">{tx.type}</td>
              <td className="p-2 text-sm">{tx.amount}</td>
              <td className="p-2 text-sm">{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}