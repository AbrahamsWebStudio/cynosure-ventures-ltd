import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApprovedPayrollClient from './ApprovedPayrollClient';

export default async function ApprovedPayrollPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  // Fetch only approved/paid payroll entries
  const { data: payroll } = await supabase
    .from('payroll')
    .select('*')
    .eq('status', 'paid')
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch users for display
  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name');

  return (
    <>
      <main className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
            Approved Payroll
          </h1>
          <a 
            href="/finance/payroll/pending" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            View Pending Payroll
          </a>
        </div>
        <ApprovedPayrollClient payroll={payroll || []} users={users || []} />
      </main>
      <Footer />
    </>
  );
}