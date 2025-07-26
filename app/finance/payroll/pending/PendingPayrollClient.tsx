"use client";

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';

interface PayrollEntry {
  id: string;
  employee_id: string;
  amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
}

interface User {
  id: string;
  full_name: string;
}

interface PendingPayrollClientProps {
  payroll: PayrollEntry[];
  users: User[];
}

export default function PendingPayrollClient({ payroll, users }: PendingPayrollClientProps) {
  const [payrollData, setPayrollData] = useState(payroll);
  const [loading, setLoading] = useState<string | null>(null);

  const markAsPaid = async (payrollId: string) => {
    setLoading(payrollId);
    try {
      const { error } = await supabaseBrowser
        .from('payroll')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', payrollId);

      if (error) {
        console.error('Error marking as paid:', error);
        alert('Failed to mark as paid. Please try again.');
      } else {
        // Remove the paid entry from the list (it will now appear in approved section)
        setPayrollData(prev => prev.filter(entry => entry.id !== payrollId));
        alert('Successfully marked as paid! The payroll entry has been moved to the Approved section.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to mark as paid. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const deletePayroll = async (payrollId: string) => {
    if (!confirm('Are you sure you want to delete this payroll entry?')) {
      return;
    }

    setLoading(payrollId);
    try {
      const { error } = await supabaseBrowser
        .from('payroll')
        .delete()
        .eq('id', payrollId);

      if (error) {
        console.error('Error deleting payroll:', error);
        alert('Failed to delete payroll entry. Please try again.');
      } else {
        // Remove the deleted entry from the list
        setPayrollData(prev => prev.filter(entry => entry.id !== payrollId));
        alert('Successfully deleted payroll entry!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete payroll entry. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg shadow mt-4">
        <thead>
          <tr className="text-left border-b dark:border-gray-700">
            <th className="p-2">Employee</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Created At</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrollData.map(entry => (
            <tr key={entry.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="p-2 text-sm">
                {users.find(u => u.id === entry.employee_id)?.full_name || 'Unknown'}
              </td>
              <td className="p-2 text-sm">KES {entry.amount}</td>
              <td className="p-2 text-sm">
                <span className={`px-2 py-1 rounded text-xs ${
                  entry.status === 'paid' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {entry.status}
                </span>
              </td>
              <td className="p-2 text-sm">
                {new Date(entry.created_at).toLocaleString()}
              </td>
              <td className="p-2 text-sm">
                <div className="flex space-x-2">
                  <button
                    onClick={() => markAsPaid(entry.id)}
                    disabled={loading === entry.id}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading === entry.id ? 'Processing...' : 'Mark as Paid'}
                  </button>
                  <button
                    onClick={() => deletePayroll(entry.id)}
                    disabled={loading === entry.id}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading === entry.id ? 'Processing...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {payrollData.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No pending payroll entries found.
        </div>
      )}
    </div>
  );
} 