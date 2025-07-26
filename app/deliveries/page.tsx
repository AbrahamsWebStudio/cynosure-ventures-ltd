// ✅ /app/deliveries/page.tsx

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DeliveriesPage() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [distance, setDistance] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleBooking = async () => {
    const distanceKm = parseFloat(distance);
    if (!pickup || !dropoff || isNaN(distanceKm) || distanceKm <= 0) {
      setMessage("Please fill in all fields correctly.");
      return;
    }
    const deliveryPrice = distanceKm * 50;
    setPrice(deliveryPrice);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("You must be logged in to book a delivery.");
      return;
    }

    const { error } = await supabase.from("deliveries").insert({
      user_id: user.id,
      pickup_location: pickup,
      dropoff_location: dropoff,
      distance_km: distanceKm,
      price: deliveryPrice,
      status: "pending",
    });

    if (!error) {
      setMessage(`✅ Delivery booked at KES ${deliveryPrice}.`);
      setPickup("");
      setDropoff("");
      setDistance("");
    } else {
      setMessage("Booking failed. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-black text-white min-h-[80vh] flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold mb-2 text-center">Book a Delivery</h1>
          <p className="text-gray-400 text-center mb-6">Fast, reliable delivery at your fingertips.</p>

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
          <input
            type="number"
            placeholder="Distance in KM"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="border border-gray-700 bg-gray-900 rounded p-3 w-full mb-6 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />

          <button
            onClick={handleBooking}
            className="bg-blue-600 text-white rounded p-3 w-full text-lg font-semibold hover:bg-white hover:text-blue-600 border border-blue-600 transition transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            Book Delivery
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
