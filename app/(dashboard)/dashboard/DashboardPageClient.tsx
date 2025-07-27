"use client";

import { useEffect, useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const supabase = createPagesBrowserClient();

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  role: string;
}

interface DashboardPageClientProps {
  user: { id: string; email?: string; last_sign_in_at?: string };
  session: { user: { id: string; email?: string; last_sign_in_at?: string } } | null;
}

export default function DashboardPageClient({ user, session }: DashboardPageClientProps) {
  const userId = user.id;
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<{ balance: number } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(0);
  const [phone, setPhone] = useState<string>("");

  const [fullNameInput, setFullNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const fetchData = async () => {
    setLoading(true);
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();


      if (profileError) {
        console.warn("Profile missing, inserting...");
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: null,
          phone_number: null,
          role: "customer",
        });
        if (insertError) {
          console.error("Error inserting profile:", insertError);
        } else {
          const { data: refetchedProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          setProfile(refetchedProfile);
          setFullNameInput(refetchedProfile?.full_name ?? "");
          setPhoneInput(refetchedProfile?.phone_number ?? "");
        }
      } else {
        setProfile(profileData);
        setFullNameInput(profileData?.full_name ?? "");
        setPhoneInput(profileData?.phone_number ?? "");
      }

      const { data: orderData } = await supabase
        .from("orders")
        .select("id, created_at, total_amount, status")
        .order("created_at", { ascending: false });
      setOrders(orderData ?? []);

      const { data: walletData } = await supabase
        .from("wallets")
        .select("balance")
        .maybeSingle();
      setWallet(walletData ?? { balance: 0 });
    } catch (error) {
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Realtime wallet and transaction updates
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, (payload) => {
        if (payload.new) {
          setWallet(payload.new as { balance: number });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        if (payload.new) {
          // Refresh data when new transactions occur
          fetchData();
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleProfileComplete = async () => {
    if (!fullNameInput || !phoneInput) {
      alert("Please fill in all fields.");
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullNameInput,
        phone_number: phoneInput,
      })
      .eq("id", profile?.id);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("Profile updated!");
      fetchData();
    }
  };

  const handleTopUp = async () => {
    if (!phone || !topUpAmount) {
      alert("Please enter phone number and amount");
      return;
    }
    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount: topUpAmount }),
      });
      const data = await res.json();
      console.log(data);
      alert("STK Push initiated, check your phone!");
    } catch (error) {
      console.error("MPESA top-up error:", error);
      alert("Failed to initiate MPESA top-up.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  const spendingData = {
    labels: orders.slice(0, 5).map((order) => order.id.slice(0, 6)),
    datasets: [
      {
        label: "Amount (KES)",
        data: orders.slice(0, 5).map((order) => order.total_amount),
        backgroundColor: "rgba(37, 99, 235, 0.6)",
      },
    ],
  };

  const needsProfileCompletion = !profile?.full_name || !profile?.phone_number;

  return (
    <>
      {needsProfileCompletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-2 text-gray-900">Complete Your Profile</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={fullNameInput}
              onChange={(e) => setFullNameInput(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-2 text-gray-900"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-4 text-gray-900"
            />
            <button
              onClick={handleProfileComplete}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
            >
              Save and Continue
            </button>
          </div>
        </div>
      )}
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Welcome Section */}
        <div className="p-6 rounded-lg shadow bg-white text-center hover:shadow-lg transition-transform hover:-translate-y-1 md:col-span-2">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">
            Welcome back, {profile?.full_name ?? user?.email} 👋
          </h2>
          <p className="text-gray-700 mb-3">Manage your activities and wallet easily from your dashboard.</p>
          <p className="text-sm text-gray-500">
            Last login: {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "N/A"}
          </p>
        </div>
        
        {/* Wallet Balance and Top Up */}
        <div className="p-6 rounded-lg shadow bg-white text-center hover:shadow-lg transition-transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Wallet Balance</h2>
          <p className="text-3xl font-bold text-green-600">KES {wallet?.balance ?? 0}</p>
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Enter MPESA phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded px-3 py-2 w-full max-w-xs text-gray-900"
            />
            <input
              type="number"
              placeholder="Amount"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full max-w-xs text-gray-900"
            />
            <br />  
            <button
              onClick={async () => {
                if (!phone || !topUpAmount) {
                  alert("Please enter phone number and amount");
                  return;
                }
                const res = await fetch("/api/mpesa/stk-push", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ phone, amount: topUpAmount }),
                });
                const data = await res.json();
                console.log(data);
                alert("STK Push initiated, check your phone!");
              }}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Top Up Wallet
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-lg shadow bg-white text-center hover:shadow-lg transition-transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              { text: "Shop Products", href: "/products" },
              { text: "Book Delivery", href: "/deliveries" },
              { text: "Book Ride", href: "/rides" },
            ].map((action) => (
              <Link
                key={action.text}
                href={action.href}
                className="bg-blue-600 text-white rounded p-3 font-semibold hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 transition block"
              >
                {action.text}
              </Link>
            ))}
          </div>
        </div>

        {/* Spending Overview */}
        <div className="p-6 rounded-lg shadow bg-white text-center hover:shadow-lg transition-transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Recent Spending Overview</h2>
          {orders.length === 0 ? (
            <p className="text-gray-700">No orders yet to display chart.</p>
          ) : (
            <Bar
              data={spendingData}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          )}
        </div>

        {/* Recent Orders */}
        <div className="p-6 rounded-lg shadow bg-white hover:shadow-lg transition-transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Recent Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <p className="text-gray-700">
              <b>You have no orders yet. </b>{" "}
              <Link href="/products" className="text-blue-600 underline hover:text-black transition">
                Start shopping
              </Link>
              .
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center border border-gray-200 p-3 rounded hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-700">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">KES {order.total_amount}</p>
                    <p
                      className={`text-sm ${order.status === "completed" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="p-6 rounded-lg shadow bg-white text-center hover:shadow-lg transition-transform hover:-translate-y-1 md:col-span-2">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Announcements</h2>
          <p className="text-gray-700">
            🚀 New feature: MPESA Top-Up now available! Try it now and simplify your payments.
          </p>
        </div>

        {/* Support */}
        <div className="p-6 rounded-lg shadow bg-white text-center hover:shadow-lg transition-transform hover:-translate-y-1 md:col-span-2">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Need Help?</h2>
          <p className="text-gray-700 mb-3">Contact us via WhatsApp, email, or call for instant support.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="https://wa.me/254700000000" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">WhatsApp</Link>
            <Link href="mailto:support@cynosureventures.co.ke" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Email</Link>
            <Link href="tel:+254700000000" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">Call</Link>
          </div>
        </div>

        {/* Logout */}
        <div className="p-6 rounded-lg shadow text-center hover:shadow-lg transition-transform hover:-translate-y-1 md:col-span-2">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </>
  );
}

