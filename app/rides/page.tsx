// ✅ /app/rides/page.tsx

"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RidesPage() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [vehicleClass, setVehicleClass] = useState("Standard");
  const [price, setPrice] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleBooking = async () => {
    if (!pickup || !dropoff || !vehicleClass) {
      setMessage("Please fill in all fields.");
      return;
    }

    const basePrice = vehicleClass === "Standard" ? 300 : vehicleClass === "Luxury" ? 800 : 500;
    setPrice(basePrice);

    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) {
      setMessage("You must be logged in to book a ride.");
      return;
    }

    const { error } = await supabaseBrowser.from("rides").insert({
      user_id: user.id,
      pickup_location: pickup,
      dropoff_location: dropoff,
      vehicle_class: vehicleClass,
      price: basePrice,
      status: "pending",
    });

    if (!error) {
      setMessage(`✅ Ride booked at KES ${basePrice}.`);
      setPickup("");
      setDropoff("");
      setVehicleClass("Standard");
    } else {
      setMessage("Booking failed. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-black text-white min-h-[80vh] flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold mb-2 text-center">Book a Ride</h1>
          <p className="text-gray-400 text-center mb-6">Fast, safe, and affordable rides anytime.</p>

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
            value={vehicleClass}
            onChange={(e) => setVehicleClass(e.target.value)}
            className="border border-gray-700 bg-gray-900 rounded p-3 w-full mb-6 text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            <option value="Standard">Standard</option>
            <option value="Luxury">Luxury</option>
            <option value="Van">Van</option>
          </select>

          <button
            onClick={handleBooking}
            className="bg-blue-600 text-white rounded p-3 w-full text-lg font-semibold hover:bg-white hover:text-blue-600 border border-blue-600 transition transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            Book Ride
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
