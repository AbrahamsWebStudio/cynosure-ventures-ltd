'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import exportToCSV from '@/lib/utils/exportToCSV';
import exportToExcel from '@/lib/utils/exportToExcel';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function PendingOrdersPage() {
  const supabase = createClientComponentClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending')
      .ilike('customer_name', `%${filter}%`)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center dark:text-white">Pending Orders</h1>
        {/* Filter */}
        <div className="flex gap-2">
          <Input placeholder="Filter by customer name..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          <Button onClick={fetchOrders} disabled={loading}>{loading ? 'Loading...' : 'Apply Filter'}</Button>
        </div>
        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button onClick={() => exportToCSV(orders as unknown as { [key: string]: string | number | boolean | null | undefined }[], 'pending_orders_export')}>Export CSV</Button>
          <Button onClick={() => exportToExcel(orders as unknown as { [key: string]: string | number | boolean | null | undefined }[], 'pending_orders_export')}>Export Excel</Button>
        </div>
        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg shadow mt-4">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="p-2">Customer</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="p-2 text-sm">{order.customer_name}</td>
                  <td className="p-2 text-sm">{order.customer_phone}</td>
                  <td className="p-2 text-sm">${order.total_amount.toFixed(2)}</td>
                  <td className="p-2 text-sm">{order.status}</td>
                  <td className="p-2 text-sm">{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}