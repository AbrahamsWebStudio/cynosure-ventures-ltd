'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AddEmployeePage() {
  const supabase = createClientComponentClient();
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    full_name: '',
    email: '',
    phone: '',
    role_id: '',
  });

  useEffect(() => {
    const fetchRoles = async () => {
      const { data } = await supabase.from('roles').select('id, name');
      setRoles(data || []);
    };
    fetchRoles();
  }, []);

  const handleAddEmployee = async () => {
    if (!newEmployee.full_name || !newEmployee.role_id) {
      alert('Name and Role are required.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('employees').insert([newEmployee]);
    setLoading(false);
    if (error) {
      alert('Error adding employee: ' + error.message);
    } else {
      setNewEmployee({ full_name: '', email: '', phone: '', role_id: '' });
      alert('Employee added!');
    }
  };

  return (
    <>
      <main className="max-w-xl mx-auto p-4 space-y-6">
        <div className="flex justify-end mb-4">
          <Link href="/finance/roles/add">
            <Button type="button">Add New Role</Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-center">Add Employee</h1>
        <div className="space-y-2 border p-4 rounded-md">
          <Input placeholder="Full Name" value={newEmployee.full_name} onChange={e => setNewEmployee({ ...newEmployee, full_name: e.target.value })} />
          <Input placeholder="Email (optional)" value={newEmployee.email} onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })} />
          <Input placeholder="Phone (optional)" value={newEmployee.phone} onChange={e => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
          <select
            className="border rounded p-2 w-full"
            value={newEmployee.role_id}
            onChange={e => setNewEmployee({ ...newEmployee, role_id: e.target.value })}
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <Button onClick={handleAddEmployee} disabled={loading}>{loading ? 'Adding...' : 'Add Employee'}</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}