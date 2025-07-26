// ✅ /app/finance/page.tsx for CYNOSURE-VENTURES-LTD

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Transaction = {
  id: string | number;
  created_at: string;
  user_email?: string;
  type?: string;
  amount?: number;
  status?: string;
};

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
      } else {
        setTransactions(data ?? []);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  if (loading) return <div className="p-4">Loading finance dashboard...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

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
              <td className="p-2 text-sm">{tx.created_at ? new Date(tx.created_at).toLocaleDateString() : 'N/A'}</td>
              <td className="p-2 text-sm">{tx.user_email ?? 'N/A'}</td>
              <td className="p-2 text-sm">{tx.type ?? 'N/A'}</td>
              <td className="p-2 text-sm">{tx.amount ?? 'N/A'}</td>
              <td className="p-2 text-sm">{tx.status ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}