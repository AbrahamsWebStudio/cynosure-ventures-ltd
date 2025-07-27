'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Users,
  TrendingUp,
  Filter
} from 'lucide-react';

interface Order {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  status: string;
  created_at: string;
  confirmation_code?: string;
  payment_method?: string;
  profiles?: {
    full_name: string;
  } | null;
  products?: {
    title: string;
  } | null;
}

export default function OrdersClient() {
  const supabase = createClientComponentClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0
  });

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        product_id,
        quantity,
        total_amount,
        status,
        created_at,
        confirmation_code,
        payment_method
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Database error details:', error);
      
      // Check if it's a table doesn't exist error
      if (error.message && error.message.includes('does not exist')) {
        console.error('Orders table does not exist. Please run the database setup script.');
        setOrders([]);
        calculateStats([]);
      } else if (error.message && error.message.includes('permission')) {
        console.error('Permission denied. You may not have access to view orders.');
        setOrders([]);
        calculateStats([]);
      } else {
        console.error('Error fetching orders:', error);
        setOrders([]);
        calculateStats([]);
      }
    } else {
      // Type the data properly to match the Order interface
      const typedData: Order[] = (data || []).map((order: Record<string, unknown>) => ({
        id: order.id as string,
        user_id: order.user_id as string,
        product_id: order.product_id as string,
        quantity: order.quantity as number,
        total_amount: order.total_amount as number,
        status: order.status as string,
        created_at: order.created_at as string,
        confirmation_code: order.confirmation_code as string | undefined,
        payment_method: order.payment_method as string | undefined,
        profiles: null, // Will be added when profiles table is set up
        products: null, // Will be added when products table is set up
      }));
      setOrders(typedData);
      calculateStats(typedData);
    }
    setLoading(false);
  };

  const calculateStats = (ordersData: Order[]) => {
    const stats = {
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === 'pending').length,
      completed: ordersData.filter(o => o.status === 'completed').length,
      cancelled: ordersData.filter(o => o.status === 'cancelled').length,
      revenue: ordersData
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total_amount, 0)
    };
    setStats(stats);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order:', error);
        alert('Failed to update order status. Please try again.');
      } else {
        alert(`Order ${newStatus} successfully!`);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">KES {stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {order.products?.title || `Product ID: ${order.product_id.slice(0, 8)}...`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Customer: {order.profiles?.full_name || `User ID: ${order.user_id.slice(0, 8)}...`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Order ID:</span>
                          <p className="font-mono">{order.id.slice(0, 8)}...</p>
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span>
                          <p>{order.quantity}</p>
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>
                          <p className="font-semibold text-green-600">KES {order.total_amount}</p>
                        </div>
                        <div>
                          <span className="font-medium">Payment:</span>
                          <p className="capitalize">{order.payment_method || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, 'completed')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {order.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        )}
                        {order.status === 'cancelled' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, 'pending')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Reactivate
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 