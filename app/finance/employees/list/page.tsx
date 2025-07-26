'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EmployeesListPage() {
  const supabase = createClientComponentClient();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data } = await supabase
        .from('employees')
        .select(`
          id,
          full_name,
          email,
          phone,
          created_at,
          roles (name)
        `)
        .order('created_at', { ascending: false });
      setEmployees(data || []);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  const deleteEmployee = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      } else {
        // Remove the deleted employee from the list
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        alert('Successfully deleted employee!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete employee. Please try again.');
    }
  };

  return (
    <>  
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-center">Employees List</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg shadow mt-4">
            <thead>
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Role</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b dark:border-gray-700">
                  <td className="p-2">{emp.full_name}</td>
                  <td className="p-2">{emp.email || 'N/A'}</td>
                  <td className="p-2">{emp.phone || 'N/A'}</td>
                  <td className="p-2">{emp.roles?.name || 'N/A'}</td>
                  <td className="p-2">{emp.created_at ? new Date(emp.created_at).toLocaleString() : 'N/A'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteEmployee(emp.id)}
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
      <Footer />
    </>
  );
}