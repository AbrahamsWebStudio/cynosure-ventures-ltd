'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RolesListPage() {
  const supabase = createClientComponentClient();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      const { data } = await supabase.from('roles').select('*').order('name');
      setRoles(data || []);
      setLoading(false);
    };
    fetchRoles();
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

      // Check if role has associated employees
      const { data: employees } = await supabase
        .from('employees')
        .select('id')
        .eq('role_id', roleId)
        .limit(1);

      if (employees && employees.length > 0) {
        alert('Cannot delete role. It has associated employees. Please reassign or remove the employees first.');
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

  const fetchRoles = async () => {
    const { data } = await supabase.from('roles').select('*').order('name');
    setRoles(data || []);
  };

  return (
    <>
      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="flex justify-end mb-4">
          <Link href="/finance/roles/add">
            <Button type="button">Add Role</Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-center">Roles List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg shadow mt-4">
            <thead>
              <tr>
                <th className="p-2">Role Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id} className="border-b dark:border-gray-700">
                  <td className="p-2">{role.name}</td>
                  <td className="p-2">{role.description || 'N/A'}</td>
                  <td className="p-2">
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
        )}
      </main>
    </>
  );
}