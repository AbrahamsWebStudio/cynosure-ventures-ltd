"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

interface Vehicle {
  id: string;
  registration: string;
  make: string | null;
  model: string | null;
  class: string | null;
}

interface QuickBookingProps {
  onBookingComplete?: () => void;
}

export default function QuickBooking({ onBookingComplete }: QuickBookingProps) {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedVehicleClass, setSelectedVehicleClass] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showVehicleSelection, setShowVehicleSelection] = useState(false);

  const vehicleClasses = [
    { id: "PSV", name: "PSV", price: 150, icon: "🚌", description: "Public Service Vehicle" },
    { id: "Economy", name: "Economy", price: 400, icon: "🚗", description: "Budget-friendly rides" },
    { id: "Standard", name: "Standard", price: 300, icon: "🚙", description: "Comfortable mid-range" },
    { id: "Executive", name: "Executive", price: 800, icon: "🚘", description: "Premium luxury rides" }
  ];

  // Fetch vehicles when vehicle class changes
  useEffect(() => {
    if (selectedVehicleClass) {
      const fetchVehicles = async () => {
        const { data } = await supabaseBrowser
          .from('vehicles')
          .select('*')
          .eq('class', selectedVehicleClass);
        setVehicles(data || []);
        setSelectedVehicle("");
      };
      fetchVehicles();
    }
  }, [selectedVehicleClass]);

  const handleQuickBooking = async () => {
    if (!pickup || !dropoff || !selectedVehicleClass || !selectedVehicle) {
      alert("Please fill in all fields and select a vehicle.");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) {
      alert("You must be logged in to book a ride.");
      setLoading(false);
      return;
    }

    // Calculate price
    const basePrice = vehicleClasses.find(v => v.id === selectedVehicleClass)?.price || 300;
    const distance = Math.floor(Math.random() * 15) + 5; // 5-20 km
    const time = Math.floor(Math.random() * 20) + 10; // 10-30 minutes
    const distancePrice = distance * 50; // KES 50 per km
    const timePrice = time * 2; // KES 2 per minute
    const total = basePrice + distancePrice + timePrice;

    // Redirect to checkout with booking details
    const params = new URLSearchParams({
      pickup,
      dropoff,
      vehicleClass: selectedVehicleClass,
      vehicleId: selectedVehicle,
      price: total.toString()
    });

    router.push(`/rides/checkout?${params.toString()}`);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Book a Ride</h2>
      
      <div className="space-y-4">
        {/* Location Inputs */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <input
              type="text"
              placeholder="Where from?"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <input
              type="text"
              placeholder="Where to?"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Vehicle Class Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Choose Vehicle Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {vehicleClasses.map((vehicleClass) => (
              <div
                key={vehicleClass.id}
                onClick={() => {
                  setSelectedVehicleClass(vehicleClass.id);
                  setShowVehicleSelection(true);
                }}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-sm ${
                  selectedVehicleClass === vehicleClass.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{vehicleClass.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{vehicleClass.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">From KES {vehicleClass.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Selection */}
        {showVehicleSelection && selectedVehicleClass && vehicles.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Select Vehicle</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  className={`p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 text-sm ${
                    selectedVehicle === vehicle.id
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{vehicle.registration}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {vehicle.make} {vehicle.model}
                      </p>
                    </div>
                    <span className="text-lg">{getVehicleIcon(vehicle.class || "")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={handleQuickBooking}
          disabled={loading || !pickup || !dropoff || !selectedVehicleClass || !selectedVehicle}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {loading ? "Processing..." : "Book Now"}
        </button>
      </div>

      {/* Popular Destinations */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Quick Destinations</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Nairobi CBD",
            "Westlands", 
            "Karen",
            "Kilimani",
            "Lavington"
          ].map((destination) => (
            <button
              key={destination}
              onClick={() => setDropoff(destination)}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {destination}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 