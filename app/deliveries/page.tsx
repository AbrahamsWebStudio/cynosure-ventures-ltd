// ✅ /app/deliveries/page.tsx for Quantum Leap Tech

'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DeliveriesPage() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [distance, setDistance] = useState('');
  const [price, setPrice] = useState(null);
  const [message, setMessage] = useState('');

  const handleBooking = async () => {
    const distanceKm = parseFloat(distance);
    if (!pickup || !dropoff || isNaN(distanceKm) || distanceKm <= 0) {
      setMessage('Please fill in all fields correctly.');
      return;
    }
    const deliveryPrice = distanceKm * 50;
    setPrice(deliveryPrice);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage('You must be logged in to book a delivery.');
      return;
    }

    const { error } = await supabase.from('deliveries').insert({
      user_id: user.id,
      pickup_location: pickup,
      dropoff_location: dropoff,
      distance_km: distanceKm,
      price: deliveryPrice,
      status: 'pending'
    });

    if (!error) {
      setMessage(`Delivery booked successfully at KES ${deliveryPrice}.`);
      setPickup('');
      setDropoff('');
      setDistance('');
    } else {
      setMessage('Booking failed. Try again.');
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book a Delivery</h1>
      <input
        type="text"
        placeholder="Pickup location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        className="border rounded p-2 w-full mb-3"
      />
      <input
        type="text"
        placeholder="Dropoff location"
        value={dropoff}
        onChange={(e) => setDropoff(e.target.value)}
        className="border rounded p-2 w-full mb-3"
      />
      <input
        type="number"
        placeholder="Distance in KM"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        className="border rounded p-2 w-full mb-3"
      />
      <button
        onClick={handleBooking}
        className="bg-green-600 text-white rounded p-2 w-full hover:bg-green-700"
      >
        Book Delivery
      </button>
      {price && <p className="mt-2 text-center">Price: KES {price}</p>}
      {message && <p className="mt-2 text-center text-sm text-blue-600">{message}</p>}
    </main>
  );
}