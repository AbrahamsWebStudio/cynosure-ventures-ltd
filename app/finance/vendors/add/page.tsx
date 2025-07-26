'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function AddVendorPage() {
  const supabase = createClientComponentClient();
  const [newVendor, setNewVendor] = useState({
    name: '',
    phone: '',
    bank: '',
    account: ''
  });
  const [loading, setLoading] = useState(false);

  const addVendor = async () => {
    if (!newVendor.name) return alert('Name is required');
    setLoading(true);
    const { error } = await supabase.from('vendors').insert({
      name: newVendor.name,
      phone: newVendor.phone || null,
      bank_account: newVendor.bank && newVendor.account
        ? { bank: newVendor.bank, account: newVendor.account }
        : null
    });
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      setNewVendor({ name: '', phone: '', bank: '', account: '' });
      alert('Vendor added!');
    }
  };

  return (
    <>
      <main className="max-w-xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center dark:text-white">Add Vendor</h1>
        <div className="space-y-2 border p-4 rounded-md">
          <Input placeholder="Vendor Name" value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} />
          <Input placeholder="Phone (optional)" value={newVendor.phone} onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })} />
          <Input placeholder="Bank (optional)" value={newVendor.bank} onChange={(e) => setNewVendor({ ...newVendor, bank: e.target.value })} />
          <Input placeholder="Account Number (optional)" value={newVendor.account} onChange={(e) => setNewVendor({ ...newVendor, account: e.target.value })} />
          <Button onClick={addVendor} disabled={loading}>{loading ? 'Adding...' : 'Add Vendor'}</Button>
        </div>
      </main>
    </>
  );
}