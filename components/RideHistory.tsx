"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

interface Ride {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  vehicle_class: string;
  price: number;
  status: string;
  payment_method: string;
  created_at: string;
  vehicle_details?: {
    registration: string;
    make: string | null;
    model: string | null;
  };
}

export default function RideHistory() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        setError("Please log in to view your ride history.");
        setLoading(false);
        return;
      }

      // Try to fetch rides with better error handling
      const { data, error } = await supabaseBrowser
        .from("rides")
        .select(`
          *,
          vehicle_details:vehicles(registration, make, model)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Database error details:", error);
        
        // Check if it's a table doesn't exist error
        if (error.message && error.message.includes("does not exist")) {
          setError("Ride history feature is not yet available. Book your first ride to get started!");
        } else if (error.message && error.message.includes("permission")) {
          setError("You don't have permission to view ride history.");
        } else {
          setError("Unable to load ride history. Please try again later.");
        }
        setRides([]);
      } else {
        setRides(data || []);
        if (data && data.length === 0) {
          setError("No rides found. Book your first ride to see it here!");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRides = rides.filter(ride => {
    const matchesFilter = filter === "all" || ride.status === filter;
    const matchesSearch = 
      ride.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropoff_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.vehicle_class.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "pending": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "cancelled": return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "completed": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
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

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🚗</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={fetchRides}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-3"
            >
              Try Again
            </button>
            <a 
              href="/rides" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Book a Ride
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Ride History</h2>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search rides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Rides</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        {filteredRides.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚗</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {rides.length === 0 
                ? "No rides found. Book your first ride to see it here!" 
                : "No rides match your search criteria."
              }
            </p>
            {rides.length === 0 && (
              <a 
                href="/rides" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Your First Ride
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRides.map((ride) => (
              <div
                key={ride.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getVehicleIcon(ride.vehicle_class)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {ride.pickup_location} → {ride.dropoff_location}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ride.vehicle_details?.registration} - {ride.vehicle_details?.make} {ride.vehicle_details?.model}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>KES {ride.price}</span>
                      <span>•</span>
                      <span>{ride.payment_method}</span>
                      <span>•</span>
                      <span>{new Date(ride.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                      {ride.status}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(ride.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredRides.length > 0 && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Rides</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredRides.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                KES {filteredRides.reduce((sum, ride) => sum + ride.price, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 