// ✅ /app/rides/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Vehicle {
  id: string;
  registration: string;
  make: string | null;
  model: string | null;
  year: string | null;
  class: string | null;
}

interface Pricing {
  base: number;
  distance: number;
  time: number;
  total: number;
}

export default function RidesPage() {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedVehicleClass, setSelectedVehicleClass] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Vehicle class options with pricing
  const vehicleClasses = [
    { id: "PSV", name: "PSV", price: 150, icon: "🚌", description: "Public Service Vehicle", color: "bg-green-500" },
    { id: "Economy", name: "Economy", price: 400, icon: "🚗", description: "Budget-friendly rides", color: "bg-blue-500" },
    { id: "Standard", name: "Standard", price: 300, icon: "🚙", description: "Comfortable mid-range", color: "bg-purple-500" },
    { id: "Executive", name: "Executive", price: 800, icon: "🚘", description: "Premium luxury rides", color: "bg-yellow-500" }
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

  // Calculate pricing and estimated time
  useEffect(() => {
    if (pickup && dropoff && selectedVehicleClass) {
      // Simulate distance calculation (in real app, use Google Maps API)
      const distance = Math.floor(Math.random() * 15) + 5; // 5-20 km
      const time = Math.floor(Math.random() * 20) + 10; // 10-30 minutes
      const basePrice = vehicleClasses.find(v => v.id === selectedVehicleClass)?.price || 300;
      const distancePrice = distance * 50; // KES 50 per km
      const timePrice = time * 2; // KES 2 per minute
      const total = basePrice + distancePrice + timePrice;

      setPricing({
        base: basePrice,
        distance: distancePrice,
        time: timePrice,
        total
      });
      setEstimatedTime(time);
    }
  }, [pickup, dropoff, selectedVehicleClass]);

  const handleBooking = async () => {
    if (!pickup || !dropoff || !selectedVehicleClass || !selectedVehicle || !pricing) {
      setMessage("Please fill in all fields and select a vehicle.");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) {
      setMessage("You must be logged in to book a ride.");
      setLoading(false);
      return;
    }

    // Redirect to checkout with booking details
    const params = new URLSearchParams({
      pickup,
      dropoff,
      vehicleClass: selectedVehicleClass,
      vehicleId: selectedVehicle,
      price: pricing.total.toString()
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
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Book Your Ride
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Fast, safe, and reliable transportation at your fingertips
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Trip Details
                </h2>

                {/* Location Inputs */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                    <input
                      type="text"
                      placeholder="Where from?"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    </div>
                    <input
                      type="text"
                      placeholder="Where to?"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Vehicle Class Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Choose Your Ride Type
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {vehicleClasses.map((vehicleClass) => (
                      <div
                        key={vehicleClass.id}
                        onClick={() => setSelectedVehicleClass(vehicleClass.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedVehicleClass === vehicleClass.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{vehicleClass.icon}</div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {vehicleClass.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                            {vehicleClass.description}
                          </p>
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            From KES {vehicleClass.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vehicle Selection */}
                {selectedVehicleClass && vehicles.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Available {selectedVehicleClass} Vehicles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          onClick={() => setSelectedVehicle(vehicle.id)}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            selectedVehicle === vehicle.id
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {vehicle.registration}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {vehicle.make} {vehicle.model} ({vehicle.year})
                              </p>
                            </div>
                            <span className="text-xl">{getVehicleIcon(vehicle.class || "")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={handleBooking}
                  disabled={loading || !pickup || !dropoff || !selectedVehicleClass || !selectedVehicle}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? "Processing..." : "Book Now"}
                </button>

                {message && (
                  <p className={`mt-4 text-center text-lg ${
                    message.includes("✅") ? "text-green-600" : "text-red-600"
                  }`}>
                    {message}
                  </p>
                )}
              </div>
            </div>

            {/* Pricing and Details */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Trip Summary
                </h2>

                {pricing ? (
                  <div className="space-y-4">
                    {/* Estimated Time */}
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">⏱️</span>
                        <span className="text-gray-700 dark:text-gray-300">Estimated Time</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {estimatedTime} min
                      </span>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Base Fare</span>
                        <span className="text-gray-900 dark:text-white">KES {pricing.base}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Distance</span>
                        <span className="text-gray-900 dark:text-white">KES {pricing.distance}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Time</span>
                        <span className="text-gray-900 dark:text-white">KES {pricing.time}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span className="text-gray-900 dark:text-white">Total</span>
                          <span className="text-blue-600 dark:text-blue-400">KES {pricing.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>✅</span>
                        <span>Real-time tracking</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>✅</span>
                        <span>Safe & insured</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>✅</span>
                        <span>24/7 support</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>✅</span>
                        <span>Cashless payment</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <div className="text-4xl mb-4">🚗</div>
                    <p>Enter pickup and dropoff locations to see pricing</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Popular Destinations */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Popular Destinations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: "Nairobi CBD", icon: "🏢" },
                { name: "Jomo Kenyatta Airport", icon: "✈️" },
                { name: "Westlands", icon: "🏪" },
                { name: "Karen", icon: "🏡" },
                { name: "Kilimani", icon: "🍽️" },
                { name: "Lavington", icon: "🏘️" },
                { name: "South B", icon: "🏠" },
                { name: "Embakasi", icon: "🚉" },
                { name: "Thika Road", icon: "🛣️" },
                { name: "Mombasa Road", icon: "🛣️" },
                { name: "Ngong Road", icon: "🛣️" },
                { name: "Kiambu Road", icon: "🛣️" }
              ].map((destination) => (
                <div
                  key={destination.name}
                  onClick={() => setDropoff(destination.name)}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-blue-300"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{destination.icon}</div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {destination.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
