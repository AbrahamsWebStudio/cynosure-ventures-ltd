import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

function Sidebar() {
  return (
    <aside className="hidden md:block w-64 h-screen fixed top-16 left-0 bg-white border-r p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Finance Dashboard</h2>
      <Accordion type="multiple" className="space-y-2">
        {[
          {
            value: 'payroll',
            label: 'Payroll',
            links: [
              ['/finance/payroll/pending', 'Pending Approvals'],
              ['/finance/payroll/approved', 'Approved'],
            ],
          },
          {
            value: 'products',
            label: 'Stock Management',
            links: [
              ['/finance/products/add', 'Add Product'],
              ['/finance/products/list', 'Product List'],
            ],
          },
          {
            value: 'employees',
            label: 'Employees',
            links: [
              ['/finance/employees/add', 'Add Employee'],
              ['/finance/employees/list', 'Employee List'],
            ],
          },
          {
            value: 'vendors',
            label: 'Vendors',
            links: [
              ['/finance/vendors/add', 'Add Vendor'],
              ['/finance/vendors/list', 'Vendor List'],
            ],
          },
          {
            value: 'transactions',
            label: 'Transactions',
            links: [['/finance/transactions', 'View Transactions']],
          },
          {
            value: 'reports',
            label: 'Reports',
            links: [['/finance/reports', 'Download Reports']],
          },
          {
            value: 'vehicles',
            label: 'Vehicles',
            links: [
              ['/finance/vehicles/add', 'Add Vehicle'],
              ['/finance/vehicles/list', 'Vehicle List'],
            ],
          },
          {
            value: 'orders',
            label: 'Orders',
            links: [
              ['/finance/orders/new', 'New Orders'],
              ['/finance/orders/completed', 'Completed Orders'],
            ],
          },
        ].map((section) => (
          <AccordionItem key={section.value} value={section.value}>
            <AccordionTrigger>{section.label}</AccordionTrigger>
            <AccordionContent className="flex flex-col space-y-1 pl-4">
              {section.links.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm hover:underline"
                >
                  {label}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}

export default async function FinanceDashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch initial data for charts and pending approvals
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: payouts } = await supabase
    .from('payouts')
    .select('*, vendors(name)')
    .order('paid_at', { ascending: false })
    .limit(10);

  const { data: pendingTransactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('status', 'pending');

  const { data: pendingPayouts } = await supabase
    .from('payouts')
    .select('*')
    .eq('status', 'pending');

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
        <DashboardClient
          session={session}
          initialTransactions={transactions || []}
          initialPayouts={payouts || []}
          initialPendingTransactions={pendingTransactions || []}
          initialPendingPayouts={pendingPayouts || []}
        />
      </main>
    </div>
  );
}
