import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function PendingOrdersPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  // Fetch pending orders with user and product info
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      user_id,
      product_id,
      quantity,
      total_amount,
      status,
      created_at,
      profiles (full_name),
      products (title)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <>
      <main className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center dark:text-white">
          Pending Orders
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg shadow mt-4">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="p-2">Order ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Product</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Total</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(orders || []).map((order: any) => (
                <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="p-2 text-sm">{order.id}</td>
                  <td className="p-2 text-sm">{order.profiles?.full_name || 'Unknown'}</td>
                  <td className="p-2 text-sm">{order.products?.title || 'Unknown'}</td>
                  <td className="p-2 text-sm">{order.quantity}</td>
                  <td className="p-2 text-sm">KES {order.total_amount}</td>
                  <td className="p-2 text-sm">{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</td>
                  <td className="p-2 text-sm">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}