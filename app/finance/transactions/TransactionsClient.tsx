// app/finance/transactions/TransactionsClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { Session } from '@supabase/auth-helpers-nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import exportToCSV from '@/lib/utils/exportToCSV';
import exportToExcel from '@/lib/utils/exportToExcel';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  initiated_by: string;
  approved_by: string;
  created_at: string;
  users?: { name: string };
  approvers?: { name: string };
  formattedDate?: string;
}

interface User {
  id: string;
  name: string;
}

export default function TransactionsClient({
  session,
  initialTransactions,
  users,
}: {
  session: Session | null;
  initialTransactions: Transaction[];
  users: User[];
}) {
  const supabase = createClientComponentClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    user: '',
    from: '',
    to: '',
  });
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<'type' | 'amount' | 'status' | 'created_at' | ''>('');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const formatted = initialTransactions.map((tx) => ({
      ...tx,
      formattedDate: new Date(tx.created_at).toLocaleString(),
    }));
    setTransactions(formatted);
  }, [initialTransactions]);

  useEffect(() => {
    const channel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        if (payload.new) {
          setTransactions((prev) => [{ ...payload.new, formattedDate: new Date(payload.new.created_at).toLocaleString() }, ...prev].slice(0, 100));
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const fetchFiltered = async () => {
    setLoading(true);
    let query = supabase
      .from('transactions')
      .select('*, users:initiated_by(full_name), approvers:approved_by(full_name)');

    if (filters.type) query = query.eq('type', filters.type);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.user) query = query.eq('initiated_by', filters.user);
    if (filters.from) query = query.gte('created_at', filters.from);
    if (filters.to) query = query.lte('created_at', filters.to);

    const { data } = await query.order('created_at', { ascending: false }).limit(100);
    const formatted = (data || []).map((tx) => ({
      ...tx,
      formattedDate: new Date(tx.created_at).toLocaleString(),
    }));
    setTransactions(formatted);
    setLoading(false);
  };

  const handleSort = (field: 'type' | 'amount' | 'status' | 'created_at') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    const sorted = [...transactions].sort((a, b) => {
      if (a[field] < b[field]) return sortAsc ? -1 : 1;
      if (a[field] > b[field]) return sortAsc ? 1 : -1;
      return 0;
    });
    setTransactions(sorted);
  };

  return (
    <>
      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center dark:text-white">Transactions</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Input placeholder="From Date" type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
          <Input placeholder="To Date" type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
          <Input placeholder="Type" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} />
          <Input placeholder="Status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} />
          <Select value={filters.user} onValueChange={(val) => setFilters({ ...filters, user: val === 'all' ? '' : val })}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Filter by User" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchFiltered} disabled={loading}>{loading ? 'Loading...' : 'Apply Filters'}</Button>
        </div>

        <div className="flex space-x-4">
          <Button onClick={() => exportToCSV(transactions, 'transactions_export')}>Export CSV</Button>
          <Button onClick={() => exportToExcel(transactions, 'transactions_export')}>Export Excel</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg shadow mt-4">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="p-2 cursor-pointer" onClick={() => handleSort('type')}>Type</th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('amount')}>Amount</th>
                <th className="p-2">Currency</th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                <th className="p-2">Initiated By</th>
                <th className="p-2">Approved By</th>
                <th className="p-2 cursor-pointer" onClick={() => handleSort('created_at')}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="p-2 text-sm">{tx.type}</td>
                  <td className="p-2 text-sm">KES {tx.amount}</td>
                  <td className="p-2 text-sm">{tx.currency}</td>
                  <td className="p-2 text-sm">{tx.status}</td>
                  <td className="p-2 text-sm">{tx.users?.name || 'N/A'}</td>
                  <td className="p-2 text-sm">{tx.approvers?.name || 'N/A'}</td>
                  <td className="p-2 text-sm">{tx.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
