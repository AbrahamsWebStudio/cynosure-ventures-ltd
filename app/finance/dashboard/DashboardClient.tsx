'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Session } from '@supabase/auth-helpers-nextjs';
import { Switch } from '@/components/ui/switch';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  vendors?: { name: string };
}

export default function DashboardClient({
  session,
  initialTransactions,
  initialPayouts,
  initialPendingTransactions,
  initialPendingPayouts,
}: {
  session: Session | null;
  initialTransactions: Transaction[];
  initialPayouts: Payout[];
  initialPendingTransactions: Transaction[];
  initialPendingPayouts: Payout[];
}) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions ?? []);
  const [payouts, setPayouts] = useState<Payout[]>(initialPayouts ?? []);
  const [pendingCount, setPendingCount] = useState<number>(
    (initialPendingTransactions?.length ?? 0) + (initialPendingPayouts?.length ?? 0)
  );
  const [viewWeekly, setViewWeekly] = useState(false);

  const supabase = createClientComponentClient();

  // Realtime transactions update
  useEffect(() => {
    const channel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        if (payload.new) {
          setTransactions((prev) => [payload.new as Transaction, ...prev].slice(0, 10));
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Vendor Payouts Chart Data
  const vendorMap: { [vendorName: string]: number } = {};
  payouts.forEach((payout) => {
    const name = payout.vendors?.name || 'Unknown Vendor';
    vendorMap[name] = (vendorMap[name] || 0) + payout.amount;
  });

  const payoutChartData = {
    labels: Object.keys(vendorMap),
    datasets: [
      {
        label: 'Total Payout (KES)',
        data: Object.values(vendorMap),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };

  // Income vs Expenses Chart Data
  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.created_at);
    const now = new Date();
    const diffDays = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
    return viewWeekly ? diffDays <= 7 : diffDays <= 30;
  });

  const incomeExpensesChartData = {
    labels: filteredTransactions.map((tx) => new Date(tx.created_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Amount (KES)',
        data: filteredTransactions.map((tx) => Number(tx.amount)),
        backgroundColor: filteredTransactions.map((tx) =>
          tx.type === 'sale' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'
        ),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: {
      x: { ticks: { color: '#fff' } },
      y: { ticks: { color: '#fff' } },
    },
  };

  return (
    <>
      
      <main className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Finance Dashboard</h1>

        {/* Toggle */}
        <div className="flex justify-center items-center space-x-2">
          <span className="text-gray-700 dark:text-gray-300 text-sm">View Weekly</span>
          <Switch checked={viewWeekly} onCheckedChange={setViewWeekly} />
        </div>

        {/* Income vs Expenses */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">
            Income vs Expenses ({viewWeekly ? 'Last 7 Days' : 'Last 30 Days'})
          </h2>
          <Bar data={incomeExpensesChartData} options={chartOptions} />
        </div>

        {/* Vendor Payouts Chart */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">Vendor Payouts (Last 30 Days)</h2>
          <Bar data={payoutChartData} options={chartOptions} />
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">Pending Approvals</h2>
          <p className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">{pendingCount}</p>
          <p className="text-center text-gray-700 dark:text-gray-300 text-sm mt-2">Transactions & payouts awaiting approval</p>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-2 sm:mb-4 text-gray-900 dark:text-white">Recent Transactions</h2>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between items-center border border-gray-200 dark:border-gray-700 p-2 sm:p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{tx.type}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {new Date(tx.created_at).toISOString().split('T').join(' ').split('.')[0]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 dark:text-white">KES {tx.amount}</p>
                  <p
                    className={`text-xs sm:text-sm ${
                      tx.status === 'approved' ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  >
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
