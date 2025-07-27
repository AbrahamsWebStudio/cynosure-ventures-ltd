'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import exportToCSV from '@/lib/utils/exportToCSV';
import exportToExcel from '@/lib/utils/exportToExcel';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
}

export default function EmployeesListPage() {
  const supabase = createClientComponentClient();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('employees')
      .select('*')
      .ilike('name', `%${filter}%`)
      .order('created_at', { ascending: false });
    setEmployees(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, []);

  const deleteEmployee = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      return;
    }

    try {
      // First check if employee exists
      const { data: existingEmployee } = await supabase
        .from('employees')
        .select('id, name')
        .eq('id', employeeId)
        .single();

      if (!existingEmployee) {
        alert('Employee not found. It may have already been deleted.');
        await fetchEmployees();
        return;
      }

      // Delete the employee
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee: ' + error.message);
      } else {
        alert('Employee deleted successfully!');
        await fetchEmployees();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting employee. Please try again.');
    }
  };

  return (
    <>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center dark:text-white">Employees List</h1>
        {/* Filter */}
        <div className="flex gap-2">
          <Input placeholder="Filter by name..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          <Button onClick={fetchEmployees} disabled={loading}>{loading ? 'Loading...' : 'Apply Filter'}</Button>
        </div>
        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button onClick={() => exportToCSV(employees as unknown as { [key: string]: string | number | boolean | null | undefined }[], 'employees_export')}>Export CSV</Button>
          <Button onClick={() => exportToExcel(employees as unknown as { [key: string]: string | number | boolean | null | undefined }[], 'employees_export')}>Export Excel</Button>
        </div>
        {/* Employees Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg shadow mt-4">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Role</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="p-2 text-sm">{employee.name}</td>
                  <td className="p-2 text-sm">{employee.email}</td>
                  <td className="p-2 text-sm">{employee.phone || 'N/A'}</td>
                  <td className="p-2 text-sm">{employee.role}</td>
                  <td className="p-2 text-sm">{new Date(employee.created_at).toLocaleString()}</td>
                  <td className="p-2 text-sm">
                    <button
                      onClick={() => deleteEmployee(employee.id)}
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