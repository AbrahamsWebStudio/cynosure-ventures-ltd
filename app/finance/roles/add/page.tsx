'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AddRolePage() {
  const supabase = createClientComponentClient();
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleAddRole = async () => {
    if (!newRole.name) {
      alert('Role name is required.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('roles').insert([newRole]);
    setLoading(false);
    if (error) {
      alert('Error adding role: ' + error.message);
    } else {
      setNewRole({ name: '', description: '' });
      alert('Role added!');
    }
  };

  return (
    <>
      <main className="max-w-xl mx-auto p-4 space-y-6">
        <div className="flex justify-end mb-4">
          <Link href="/finance/employees/add">
            <Button type="button">New Employee</Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-center">Add Role</h1>
        <div className="space-y-2 border p-4 rounded-md">
          <Input placeholder="Role Name" value={newRole.name} onChange={e => setNewRole({ ...newRole, name: e.target.value })} />
          <Input placeholder="Description (optional)" value={newRole.description} onChange={e => setNewRole({ ...newRole, description: e.target.value })} />
          <Button onClick={handleAddRole} disabled={loading}>{loading ? 'Adding...' : 'Add Role'}</Button>
        </div>
      </main>
    </>
  );
}