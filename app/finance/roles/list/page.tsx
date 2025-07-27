'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import exportToCSV from '@/lib/utils/exportToCSV';
import exportToExcel from '@/lib/utils/exportToExcel';

interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export default function RolesListPage() {
  const supabase = createClientComponentClient();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchRoles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('roles')
      .select('*')
      .ilike('name', `%${filter}%`)
      .order('created_at', { ascending: false });
    setRoles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line
  }, []);

  const deleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      return;
    }

    try {
      // First check if role exists
      const { data: existingRole } = await supabase
        .from('roles')
        .select('id, name')
        .eq('id', roleId)
        .single();

      if (!existingRole) {
        alert('Role not found. It may have already been deleted.');
        await fetchRoles();
        return;
      }

      // Delete the role
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (error) {
        console.error('Error deleting role:', error);
        alert('Error deleting role: ' + error.message);
      } else {
        alert('Role deleted successfully!');
        await fetchRoles();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting role. Please try again.');
    }
  };

  return (
    <>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center dark:text-white">Roles List</h1>
        {/* Filter */}
        <div className="flex gap-2">
          <Input placeholder="Filter by name..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          <Button onClick={fetchRoles} disabled={loading}>{loading ? 'Loading...' : 'Apply Filter'}</Button>
        </div>
        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button onClick={() => exportToCSV(roles as unknown as { [key: string]: string | number | boolean | null | undefined }[], 'roles_export')}>Export CSV</Button>
          <Button onClick={() => exportToExcel(roles as unknown as { [key: string]: string | number | boolean | null | undefined }[], 'roles_export')}>Export Excel</Button>
        </div>
        {/* Roles Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg shadow mt-4">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="p-2">Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="p-2 text-sm">{role.name}</td>
                  <td className="p-2 text-sm">{role.description || 'N/A'}</td>
                  <td className="p-2 text-sm">{new Date(role.created_at).toLocaleString()}</td>
                  <td className="p-2 text-sm">
                    <button
                      onClick={() => deleteRole(role.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}