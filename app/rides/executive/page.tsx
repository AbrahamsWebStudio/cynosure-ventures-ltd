// ✅ /app/rides/executive/page.tsx

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

export default function ExecutiveRidesPage() {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [vehicleClass] = useState("Executive");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [price, setPrice] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  // Fetch available Executive vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      const { data } = await supabaseBrowser
        .from('vehicles')
        .select('*')
        .eq('class', 'Executive');
      setVehicles(data || []);
    };
    fetchVehicles();
  }, []);

  const handleBooking = async () => {
    if (!pickup || !dropoff || !selectedVehicle) {
      setMessage("Please fill in all fields.");
      return;
    }

    const basePrice = 800; // Executive pricing
    setPrice(basePrice);

    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) {
      setMessage("You must be logged in to book a ride.");
      return;
    }

    // Redirect to checkout with booking details
    const params = new URLSearchParams({
      pickup,
      dropoff,
      vehicleClass,
      vehicleId: selectedVehicle,
      price: basePrice.toString()
    });

    router.push(`/rides/checkout?${params.toString()}`);
  };

  return (
    <>
      <Navbar />
      <main className="bg-black text-white min-h-[80vh] flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold mb-2 text-center">Book Executive Ride</h1>
          <p className="text-gray-400 text-center mb-6">Premium luxury vehicles for business and special occasions.</p>

          <input
            type="text"
            placeholder="Pickup location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="border border-gray-700 bg-gray-900 rounded p-3 w-full mb-4 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
          <input
            type="text"
            placeholder="Dropoff location"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="border border-gray-700 bg-gray-900 rounded p-3 w-full mb-4 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />

          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="border border-gray-700 bg-gray-900 rounded p-3 w-full mb-6 text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            <option value="">Select an Executive Vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.registration} - {vehicle.make} {vehicle.model} ({vehicle.year})
              </option>
            ))}
          </select>

          <button
            onClick={handleBooking}
            className="bg-blue-600 text-white rounded p-3 w-full text-lg font-semibold hover:bg-white hover:text-blue-600 border border-blue-600 transition transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            Book Executive Ride
          </button>

          {price && (
            <p className="mt-4 text-center text-lg text-green-400">Price: KES {price}</p>
          )}
          {message && (
            <p className={`mt-2 text-center text-lg ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 