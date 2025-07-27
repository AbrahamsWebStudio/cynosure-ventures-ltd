'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import exportToCSV from '@/lib/utils/exportToCSV';
import exportToExcel from '@/lib/utils/exportToExcel';

interface Vendor {
  id: string;
  name: string;
  phone: string | null;
  bank_account: any | null;
  created_at: string;
}

export default function VendorsListPage() {
  const supabase = createClientComponentClient();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchVendors = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('vendors')
      .select('*')
      .ilike('name', `%${filter}%`)
      .order('created_at', { ascending: false });
    setVendors(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVendors();
    // eslint-disable-next-line
  }, []);

  const deleteVendor = async (vendorId: string) => {
    if (!confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      return;
    }

    try {
      // First check if vendor exists
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id, name')
        .eq('id', vendorId)
        .single();

      if (!existingVendor) {
        alert('Vendor not found. It may have already been deleted.');
        await fetchVendors();
        return;
      }

      // Delete the vendor
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId);

      if (error) {
        console.error('Error deleting vendor:', error);
        alert('Error deleting vendor: ' + error.message);
      } else {
        alert('Vendor deleted successfully!');
        await fetchVendors();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting vendor. Please try again.');
    }
  };

  return (
    <>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center dark:text-white">Vendors List</h1>
        {/* Filter */}
        <div className="flex gap-2">
          <Input placeholder="Filter by name..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          <Button onClick={fetchVendors} disabled={loading}>{loading ? 'Loading...' : 'Apply Filter'}</Button>
        </div>
        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button onClick={() => exportToCSV(vendors as any[], 'vendors_export')}>Export CSV</Button>
          <Button onClick={() => exportToExcel(vendors as any[], 'vendors_export')}>Export Excel</Button>
        </div>
        {/* Vendors Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg shadow mt-4">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="p-2">Name</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Bank</th>
                <th className="p-2">Account</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="p-2 text-sm">{vendor.name}</td>
                  <td className="p-2 text-sm">{vendor.phone || 'N/A'}</td>
                  <td className="p-2 text-sm">{vendor.bank_account?.bank || 'N/A'}</td>
                  <td className="p-2 text-sm">{vendor.bank_account?.account || 'N/A'}</td>
                  <td className="p-2 text-sm">{new Date(vendor.created_at).toLocaleString()}</td>
                  <td className="p-2 text-sm">
                    <button
                      onClick={() => deleteVendor(vendor.id)}
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