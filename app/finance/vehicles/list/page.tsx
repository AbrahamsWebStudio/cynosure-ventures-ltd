'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import exportToCSV from '@/lib/utils/exportToCSV';
import exportToExcel from '@/lib/utils/exportToExcel';

interface Vehicle {
  id: string;
  registration: string;
  make: string | null;
  model: string | null;
  year: string | null;
  class: string | null;
  created_at: string;
}

export default function VehiclesListPage() {
  const supabase = createClientComponentClient();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchVehicles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('vehicles')
      .select('*')
      .ilike('registration', `%${filter}%`)
      .order('created_at', { ascending: false });
    setVehicles(data || []);
    setLoading(false);
  };

  const deleteVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) {
        console.error('Error deleting vehicle:', error);
        alert('Failed to delete vehicle. Please try again.');
      } else {
        // Remove the deleted vehicle from the list
        setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
        alert('Successfully deleted vehicle!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete vehicle. Please try again.');
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center dark:text-white">Vehicles List</h1>
        {/* Filter */}
        <div className="flex gap-2">
          <Input placeholder="Filter by registration..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          <Button onClick={fetchVehicles} disabled={loading}>{loading ? 'Loading...' : 'Apply Filter'}</Button>
        </div>
        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button onClick={() => exportToCSV(vehicles, 'vehicles_export')}>Export CSV</Button>
          <Button onClick={() => exportToExcel(vehicles, 'vehicles_export')}>Export Excel</Button>
        </div>
        {/* Vehicles Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg shadow mt-4">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="p-2">Registration</th>
                <th className="p-2">Make</th>
                <th className="p-2">Model</th>
                <th className="p-2">Year</th>
                <th className="p-2">Class</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="p-2 text-sm">{vehicle.registration}</td>
                  <td className="p-2 text-sm">{vehicle.make || 'N/A'}</td>
                  <td className="p-2 text-sm">{vehicle.model || 'N/A'}</td>
                  <td className="p-2 text-sm">{vehicle.year || 'N/A'}</td>
                  <td className="p-2 text-sm">{vehicle.class || 'N/A'}</td>
                  <td className="p-2 text-sm">{new Date(vehicle.created_at).toLocaleString()}</td>
                  <td className="p-2 text-sm">
                    <button
                      onClick={() => deleteVehicle(vehicle.id)}
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