'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  CheckCircle, 
  DollarSign, 
  Users,
  TrendingUp,
  AlertCircle
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

export default function CompletedOrdersClient() {
  const supabase = createClientComponentClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    revenue: 0,
    uniqueCustomers: 0
  });

  const fetchCompletedOrders = async () => {
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
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Database error details:', error);
      
      // Check if it's a table doesn't exist error
      if (error.message && error.message.includes('does not exist')) {
        console.error('Orders table does not exist. Please run the database setup script.');
        setOrders([]);
        setStats({ total: 0, revenue: 0, uniqueCustomers: 0 });
      } else if (error.message && error.message.includes('permission')) {
        console.error('Permission denied. You may not have access to view orders.');
        setOrders([]);
        setStats({ total: 0, revenue: 0, uniqueCustomers: 0 });
      } else {
        console.error('Error fetching orders:', error);
        setOrders([]);
        setStats({ total: 0, revenue: 0, uniqueCustomers: 0 });
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
      
      // Calculate stats
      const totalRevenue = typedData.reduce((sum, order) => sum + order.total_amount, 0);
      const uniqueCustomers = new Set(typedData.map(o => o.user_id)).size;
      setStats({
        total: typedData.length,
        revenue: totalRevenue,
        uniqueCustomers
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            Completed Orders
          </h1>
          <p className="text-gray-600 mt-2">View all successfully completed orders</p>
        </div>
        <Badge variant="secondary" className="text-green-800 bg-green-100 border-green-200">
          {orders.length} Completed
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Total Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              KES {stats.revenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Unique Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.uniqueCustomers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Completed Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No completed orders found.</p>
              <p className="text-gray-500 text-sm mt-2">Completed orders will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {order.products?.title || `Product ID: ${order.product_id.slice(0, 8)}...`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Customer: {order.profiles?.full_name || `User ID: ${order.user_id.slice(0, 8)}...`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Order ID:</span>
                          <p className="font-mono text-gray-900">{order.id.slice(0, 8)}...</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Quantity:</span>
                          <p className="text-gray-900">{order.quantity}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Total:</span>
                          <p className="font-semibold text-green-600">KES {order.total_amount}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Payment:</span>
                          <Badge variant="outline" className="capitalize">
                            {order.payment_method || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                      
                      {order.confirmation_code && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-700">Confirmation Code:</span>
                          <p className="font-mono text-gray-900">{order.confirmation_code}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Completed
                      </Badge>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Completed</p>
                        <p className="text-sm text-gray-900">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                      </div>
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