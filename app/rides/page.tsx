// ✅ /app/rides/page.tsx for Quantum Leap Tech

'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RidesPage() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [vehicleClass, setVehicleClass] = useState('Standard');
  const [price, setPrice] = useState(null);
  const [message, setMessage] = useState('');

  const handleBooking = async () => {
    if (!pickup || !dropoff || !vehicleClass) {
      setMessage('Please fill in all fields.');
      return;
    }

    const basePrice = vehicleClass === 'Standard' ? 300 : vehicleClass === 'Luxury' ? 800 : 500;
    setPrice(basePrice);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage('You must be logged in to book a ride.');
      return;
    }

    const { error } = await supabase.from('rides').insert({
      user_id: user.id,
      pickup_location: pickup,
      dropoff_location: dropoff,
      vehicle_class: vehicleClass,
      price: basePrice,
      status: 'pending'
    });

    if (!error) {
      setMessage(`Ride booked successfully at KES ${basePrice}.`);
      setPickup('');
      setDropoff('');
      setVehicleClass('Standard');
    } else {
      setMessage('Booking failed. Try again.');
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book a Ride</h1>
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
      <select
        value={vehicleClass}
        onChange={(e) => setVehicleClass(e.target.value)}
        className="border rounded p-2 w-full mb-3"
      >
        <option value="Standard">Standard</option>
        <option value="Luxury">Luxury</option>
        <option value="Van">Van</option>
      </select>
      <button
        onClick={handleBooking}
        className="bg-blue-600 text-white rounded p-2 w-full hover:bg-blue-700"
      >
        Book Ride
      </button>
      {price && <p className="mt-2 text-center">Price: KES {price}</p>}
      {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
    </main>
  );
}