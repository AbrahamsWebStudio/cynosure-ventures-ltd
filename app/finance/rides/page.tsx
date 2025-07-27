'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import exportToCSV from '@/lib/utils/exportToCSV';
import exportToExcel from '@/lib/utils/exportToExcel';

interface Ride {
  id: string;
  user_id: string;
  pickup_location: string;
  dropoff_location: string;
  vehicle_class: string;
  vehicle_id: string | null;
  price: number;
  status: string;
  payment_method: string | null;
  created_at: string;
  user?: {
    email: string;
  } | null;
  vehicle?: {
    registration: string;
    make: string | null;
    model: string | null;
  } | null;
}

export default function AdminRidesPage() {
  const supabase = createClientComponentClient();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rides')
      .select(`
        id,
        user_id,
        pickup_location,
        dropoff_location,
        vehicle_class,
        vehicle_id,
        price,
        status,
        payment_method,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Database error details:', error);
      console.log('Error message:', error.message);
      console.log('Error code:', error.code);
      
      // Check if it's a table doesn't exist error
      if (error.message && error.message.includes('does not exist')) {
        console.error('Rides table does not exist. Please run the database setup script.');
        setRides([]);
      } else if (error.message && error.message.includes('permission')) {
        console.error('Permission denied. You may not have access to view rides.');
        setRides([]);
      } else {
        console.error('Error fetching rides:', error.message);
        console.error('Full error object:', error);
        setRides([]);
      }
    } else {
      // Type the data properly to match the Ride interface
      const typedData: Ride[] = (data || []).map((ride: Record<string, unknown>) => ({
        id: ride.id as string,
        user_id: ride.user_id as string,
        pickup_location: ride.pickup_location as string,
        dropoff_location: ride.dropoff_location as string,
        vehicle_class: ride.vehicle_class as string,
        vehicle_id: ride.vehicle_id as string | null,
        price: ride.price as number,
        status: ride.status as string,
        payment_method: ride.payment_method as string | null,
        created_at: ride.created_at as string,
        user: null, // Will be added when profiles table is set up
        vehicle: null, // Will be added when vehicles table is set up
      }));
      setRides(typedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRides();

    // Realtime subscription
    const channel = supabase
      .channel('rides_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rides' }, () => {
        fetchRides();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredRides = rides.filter(ride => {
    const matchesFilter = filter === 'all' || ride.vehicle_class === filter;
    const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;
    const matchesSearch = 
      ride.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropoff_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.vehicle?.registration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.vehicle_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'completed': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'pending_payment': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getVehicleIcon = (vehicleClass: string) => {
    switch (vehicleClass) {
      case "PSV": return "🚌";
      case "Economy": return "🚗";
      case "Standard": return "🚙";
      case "Executive": return "🚘";
      default: return "🚗";
    }
  };

  const updateRideStatus = async (rideId: string, newStatus: string) => {
    const { error } = await supabase
      .from('rides')
      .update({ status: newStatus })
      .eq('id', rideId);

    if (error) {
      alert('Error updating ride status: ' + error.message);
    } else {
      await fetchRides();
    }
  };

  const deleteRide = async (rideId: string) => {
    if (!confirm('Are you sure you want to delete this ride? This action cannot be undone.')) return;

    const { error } = await supabase
      .from('rides')
      .delete()
      .eq('id', rideId);

    if (error) {
      alert('Error deleting ride: ' + error.message);
    } else {
      await fetchRides();
    }
  };

  const getRideStats = () => {
    const total = rides.length;
    const confirmed = rides.filter(r => r.status === 'confirmed').length;
    const pending = rides.filter(r => r.status === 'pending').length;
    const completed = rides.filter(r => r.status === 'completed').length;
    const cancelled = rides.filter(r => r.status === 'cancelled').length;
    const totalRevenue = rides.reduce((sum, ride) => sum + ride.price, 0);

    return { total, confirmed, pending, completed, cancelled, totalRevenue };
  };

  const stats = getRideStats();

  const exportRidesData = (ridesData: Ride[]) => {
    return ridesData.map(ride => ({
      id: ride.id,
      user_id: ride.user_id,
      pickup_location: ride.pickup_location,
      dropoff_location: ride.dropoff_location,
      vehicle_class: ride.vehicle_class,
      vehicle_id: ride.vehicle_id,
      price: ride.price,
      status: ride.status,
      payment_method: ride.payment_method,
      created_at: ride.created_at,
      user_email: ride.user?.email || 'N/A',
      vehicle_registration: ride.vehicle?.registration || 'N/A',
      vehicle_make: ride.vehicle?.make || 'N/A',
      vehicle_model: ride.vehicle?.model || 'N/A',
    }));
  };

  return (
    <>
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rides Management</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Rides</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.confirmed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Confirmed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.cancelled}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cancelled</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">KES {stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
          </div>
        </div>

        {/* Filters and Export */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search rides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Vehicle Types</option>
              <option value="PSV">PSV</option>
              <option value="Economy">Economy</option>
              <option value="Standard">Standard</option>
              <option value="Executive">Executive</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending_payment">Pending Payment</option>
            </select>
            <div className="flex gap-2">
              <Button onClick={() => exportToCSV(exportRidesData(filteredRides), 'rides_export')}>Export CSV</Button>
              <Button onClick={() => exportToExcel(exportRidesData(filteredRides), 'rides_export')}>Export Excel</Button>
            </div>
          </div>
        </div>

        {/* Rides List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading rides...</p>
          </div>
        ) : filteredRides.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚗</div>
            <p className="text-gray-600 dark:text-gray-400">No rides found</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ride Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getVehicleIcon(ride.vehicle_class)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {ride.pickup_location} → {ride.dropoff_location}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {ride.vehicle_class} • {ride.payment_method || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {ride.user?.email || `User ID: ${ride.user_id.slice(0, 8)}...`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {ride.vehicle?.registration || `Vehicle ID: ${ride.vehicle_id?.slice(0, 8) || 'N/A'}...`}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {ride.vehicle?.make} {ride.vehicle?.model}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          KES {ride.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ride.status)}`}>
                          {ride.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(ride.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(ride.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <select
                            value={ride.status}
                            onChange={(e) => updateRideStatus(ride.id, e.target.value)}
                            className="text-xs p-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="pending_payment">Pending Payment</option>
                          </select>
                          <button
                            onClick={() => deleteRide(ride.id)}
                            className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
} 