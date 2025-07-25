"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
}

interface Wallet {
  balance: number;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch orders
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("id, created_at, total_amount, status")
        .order("created_at", { ascending: false });

      // Fetch wallet
      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .select("balance")
        .maybeSingle();

      if (orderError) console.error(orderError);
      if (walletError) console.error(walletError);

      setOrders(orderData || []);
      setWallet(walletData || { balance: 0 });
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="animate-pulse text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Dashboard</h1>
      <div className="mb-6 p-4 border rounded bg-white shadow">
        <p className="text-lg font-semibold">Wallet Balance</p>
        <p className="text-xl font-bold text-green-600">KES {wallet?.balance ?? 0}</p>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Top Up Wallet
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
        {orders.length === 0 ? (
          <p>You have no orders yet. <Link href="/products" className="text-blue-600 underline">Start shopping</Link>.</p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div key={order.id} className="flex justify-between items-center border p-3 rounded">
                <div>
                  <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p>KES {order.total_amount}</p>
                  <p className={`text-sm ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
