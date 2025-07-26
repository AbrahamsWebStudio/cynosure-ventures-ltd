"use client";

import { useState, useEffect } from 'react';
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

interface ApprovedPayrollClientProps {
  payroll: PayrollEntry[];
  users: User[];
}

export default function ApprovedPayrollClient({ payroll, users }: ApprovedPayrollClientProps) {
  const [payrollData, setPayrollData] = useState(payroll);

  // Real-time subscription for approved payroll updates
  useEffect(() => {
    const channel = supabaseBrowser
      .channel('approved-payroll-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payroll' }, (payload) => {
        const newRecord = payload.new as PayrollEntry;
        const oldRecord = payload.old as PayrollEntry;
        
        if (newRecord && newRecord.status === 'paid') {
          // Add new approved payroll to the list
          setPayrollData(prev => [newRecord, ...prev]);
        } else if (oldRecord && oldRecord.status === 'paid' && newRecord && newRecord.status !== 'paid') {
          // Remove payroll if status changed from paid to something else
          setPayrollData(prev => prev.filter(entry => entry.id !== oldRecord.id));
        }
      })
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  const deletePayroll = async (payrollId: string) => {
    if (!confirm('Are you sure you want to delete this approved payroll entry?')) {
      return;
    }

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
            <th className="p-2">Paid At</th>
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
                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {entry.status}
                </span>
              </td>
              <td className="p-2 text-sm">
                {entry.paid_at ? new Date(entry.paid_at).toLocaleString() : 'N/A'}
              </td>
              <td className="p-2 text-sm">
                <button
                  onClick={() => deletePayroll(entry.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {payrollData.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No approved payroll entries found.
        </div>
      )}
    </div>
  );
} 