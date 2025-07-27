import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import FinanceSidebar from '@/components/FinanceSidebar';
import OrdersClient from './OrdersClient';

export default async function OrdersPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50">
      <FinanceSidebar />
      <div className="md:ml-64 p-6">
        <OrdersClient />
      </div>
    </div>
  );
} 