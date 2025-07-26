'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Button } from '@/components/ui/button';

import exportToCSV from '@/lib/utils/exportToCSV';
import exportToExcel from '@/lib/utils/exportToExcel';

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Transaction {
  id: string;
  type: string; // 'income' or 'expense'
  amount: number;
  created_at: string;
}

export default function ReportsClient() {
  const supabase = createClientComponentClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString())
      .order('created_at', { ascending: true });
    setTransactions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString('default', { month: 'short' });
  });

  const incomeData = months.map((_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - i));
    return transactions
      .filter(tx => tx.type === 'income' && new Date(tx.created_at).getMonth() === month.getMonth())
      .reduce((sum, tx) => sum + tx.amount, 0);
  });

  const expenseData = months.map((_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - i));
    return transactions
      .filter(tx => tx.type === 'expense' && new Date(tx.created_at).getMonth() === month.getMonth())
      .reduce((sum, tx) => sum + tx.amount, 0);
  });

  const netProfitData = incomeData.map((inc, idx) => inc - expenseData[idx]);

  const chartData = {
    labels: months,
    datasets: [
      { label: 'Income', data: incomeData, backgroundColor: 'rgba(34,197,94,0.6)' },
      { label: 'Expenses', data: expenseData, backgroundColor: 'rgba(239,68,68,0.6)' },
      { label: 'Net Profit', data: netProfitData, backgroundColor: 'rgba(59,130,246,0.6)' },
    ],
  };

  return (
    <>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center dark:text-white">Financial Reports</h1>

        <div className="space-y-4">
          <Bar data={chartData} />

          <div className="flex gap-2 justify-center">
            <Button onClick={() => exportToCSV(transactions, 'financial_report')}>Export CSV</Button>
            <Button onClick={() => exportToExcel(transactions, 'financial_report')}>Export Excel</Button>
          </div>

          {loading && <p className="text-center">Loading data...</p>}
        </div>
      </main>
    </>
  );
}
