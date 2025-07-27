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
  AlertCircle,
  Eye
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

export default function PendingOrdersClient() {
  const supabase = createClientComponentClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchPendingOrders = async () => {
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
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Database error details:', error);
      
      // Check if it's a table doesn't exist error
      if (error.message && error.message.includes('does not exist')) {
        console.error('Orders table does not exist. Please run the database setup script.');
        setOrders([]);
      } else if (error.message && error.message.includes('permission')) {
        console.error('Permission denied. You may not have access to view orders.');
        setOrders([]);
      } else {
        console.error('Error fetching orders:', error);
        setOrders([]);
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
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const handleMarkAsPaid = async (orderId: string) => {
    setProcessingOrder(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order:', error);
        alert('Failed to mark order as paid. Please try again.');
      } else {
        alert('Order marked as paid successfully!');
        fetchPendingOrders();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to mark order as paid. Please try again.');
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setProcessingOrder(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. Please try again.');
      } else {
        alert('Order cancelled successfully!');
        fetchPendingOrders();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setProcessingOrder(null);
    }
  };

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
            <Clock className="w-8 h-8 text-yellow-600" />
            Pending Orders
          </h1>
          <p className="text-gray-600 mt-2">Manage orders awaiting payment confirmation</p>
        </div>
        <Badge variant="secondary" className="text-yellow-800 bg-yellow-100 border-yellow-200">
          {orders.length} Pending
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Total Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              KES {orders.reduce((sum, order) => sum + order.total_amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Unique Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {new Set(orders.map(o => o.user_id)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Pending Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No pending orders found.</p>
              <p className="text-gray-500 text-sm mt-2">All orders have been processed.</p>
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
                        <Package className="w-5 h-5 text-blue-600" />
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
                    
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Created</p>
                        <p className="text-sm text-gray-900">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          variant="outline"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(order.id)}
                          disabled={processingOrder === order.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {processingOrder === order.id ? (
                            'Processing...'
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={processingOrder === order.id}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          {processingOrder === order.id ? (
                            'Processing...'
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium">Product:</span>
                <p>{selectedOrder.products?.title || 'Unknown'}</p>
              </div>
              <div>
                <span className="font-medium">Customer:</span>
                <p>{selectedOrder.profiles?.full_name || 'Unknown'}</p>
              </div>
              <div>
                <span className="font-medium">Quantity:</span>
                <p>{selectedOrder.quantity}</p>
              </div>
              <div>
                <span className="font-medium">Total Amount:</span>
                <p className="font-semibold text-green-600">KES {selectedOrder.total_amount}</p>
              </div>
              <div>
                <span className="font-medium">Payment Method:</span>
                <p className="capitalize">{selectedOrder.payment_method || 'N/A'}</p>
              </div>
              {selectedOrder.confirmation_code && (
                <div>
                  <span className="font-medium">Confirmation Code:</span>
                  <p className="font-mono">{selectedOrder.confirmation_code}</p>
                </div>
              )}
              <div>
                <span className="font-medium">Order Date:</span>
                <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 