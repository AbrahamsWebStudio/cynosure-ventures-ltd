// app/finance/transactions/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TransactionsClient from './TransactionsClient';

export default async function TransactionsPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, users:initiated_by(name), approvers:approved_by(name)')
    .order('created_at', { ascending: false })
    .limit(20);

  const { data: users } = await supabase
    .from('users')
    .select('id, name');

  return (
    <TransactionsClient
      session={session}
      initialTransactions={transactions || []}
      users={users || []}
    />
  );
}
