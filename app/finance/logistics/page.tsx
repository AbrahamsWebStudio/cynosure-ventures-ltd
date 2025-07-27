"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import exportToCSV from "@/lib/utils/exportToCSV";
import exportToExcel from "@/lib/utils/exportToExcel";
import { Truck, Package, Scale, MapPin, Clock, AlertTriangle, Search, Filter } from "lucide-react";

interface LogisticsOrder {
  id: string;
  user_id: string;
  pickup_location: string;
  dropoff_location: string;
  distance_km: number;
  total_weight_kg: number;
  subtotal_amount: number;
  tax_amount: number;
  fragile_surcharge: number;
  total_amount: number;
  status: string;
  payment_method: string;
  tracking_number: string;
  special_instructions: string;
  created_at: string;
  estimated_delivery_time: string;
  actual_delivery_time: string;
  weight_class: {
    name: string;
  };
  user: {
    email: string;
  };
}

interface WeightClass {
  id: string;
  name: string;
  min_weight: number;
  max_weight: number;
  base_price: number;
  price_per_km: number;
  tax_rate: number;
  fragile_surcharge: number;
  description: string;
}

export default function LogisticsManagementPage() {
  const supabase = createClientComponentClient();
  const [orders, setOrders] = useState<LogisticsOrder[]>([]);
  const [weightClasses, setWeightClasses] = useState<WeightClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  useEffect(() => {
    fetchOrders();
    fetchWeightClasses();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('logistics_orders')
      .select(`
        *,
        weight_class:weight_classes(name),
        user:profiles(email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching logistics orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const fetchWeightClasses = async () => {
    const { data, error } = await supabase
      .from('weight_classes')
      .select('*')
      .order('min_weight');

    if (error) {
      console.error('Error fetching weight classes:', error);
    } else {
      setWeightClasses(data || []);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('logistics_orders')
      .update({ 
        status: newStatus,
        actual_delivery_time: newStatus === 'delivered' ? new Date().toISOString() : null
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
    } else {
      await fetchOrders();
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedOrders.length === 0) return;

    const { error } = await supabase
      .from('logistics_orders')
      .update({ 
        status: newStatus,
        actual_delivery_time: newStatus === 'delivered' ? new Date().toISOString() : null
      })
      .in('id', selectedOrders);

    if (error) {
      console.error('Error updating orders status:', error);
    } else {
      setSelectedOrders([]);
      await fetchOrders();
    }
  };

  const handleDeleteOrders = async () => {
    if (selectedOrders.length === 0) return;

    const { error } = await supabase
      .from('logistics_orders')
      .delete()
      .in('id', selectedOrders);

    if (error) {
      console.error('Error deleting orders:', error);
    } else {
      setSelectedOrders([]);
      await fetchOrders();
    }
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const in_transit = orders.filter(o => o.status === 'in_transit').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);

    return { total, pending, confirmed, in_transit, delivered, cancelled, totalRevenue };
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = 
      order.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.dropoff_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const exportLogisticsData = (ordersData: LogisticsOrder[]) => {
    return ordersData.map(order => ({
      tracking_number: order.tracking_number,
      user_email: order.user?.email || 'N/A',
      pickup_location: order.pickup_location,
      dropoff_location: order.dropoff_location,
      distance_km: order.distance_km,
      weight_class: order.weight_class?.name || 'N/A',
      total_weight_kg: order.total_weight_kg,
      subtotal_amount: order.subtotal_amount,
      tax_amount: order.tax_amount,
      fragile_surcharge: order.fragile_surcharge,
      total_amount: order.total_amount,
      status: order.status,
      payment_method: order.payment_method,
      special_instructions: order.special_instructions,
      created_at: order.created_at,
      estimated_delivery_time: order.estimated_delivery_time,
      actual_delivery_time: order.actual_delivery_time,
    }));
  };

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-600" />
            Logistics Management
          </h1>
          <p className="text-gray-600">Manage delivery orders, track shipments, and monitor logistics performance</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">{stats.in_transit}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">KES {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <Scale className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by tracking number, location, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => exportToCSV(exportLogisticsData(filteredOrders), 'logistics_export')}>
                Export CSV
              </Button>
              <Button onClick={() => exportToExcel(exportLogisticsData(filteredOrders), 'logistics_export')}>
                Export Excel
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedOrders.length} order(s) selected
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleBulkStatusUpdate('confirmed')}
                    variant="outline"
                  >
                    Mark Confirmed
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleBulkStatusUpdate('in_transit')}
                    variant="outline"
                  >
                    Mark In Transit
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleBulkStatusUpdate('delivered')}
                    variant="outline"
                  >
                    Mark Delivered
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleDeleteOrders}
                    variant="destructive"
                  >
                    Delete Selected
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading logistics orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No logistics orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(filteredOrders.map(o => o.id));
                          } else {
                            setSelectedOrders([]);
                          }
                        }}
                        checked={selectedOrders.length === filteredOrders.length}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrders([...selectedOrders, order.id]);
                            } else {
                              setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.tracking_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.user?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-1 mb-1">
                            <MapPin className="h-3 w-3 text-green-600" />
                            <span className="truncate max-w-32">{order.pickup_location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-red-600" />
                            <span className="truncate max-w-32">{order.dropoff_location}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.distance_km}km
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.weight_class?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.total_weight_kg}kg
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          KES {order.total_amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tax: KES {order.tax_amount.toFixed(2)}
                          {order.fragile_surcharge > 0 && (
                            <span className="block text-orange-600">
                              Fragile: KES {order.fragile_surcharge.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'in_transit' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Select 
                            value={order.status} 
                            onValueChange={(value) => handleStatusUpdate(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="in_transit">In Transit</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 