'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function AddVehiclePage() {
  const supabase = createClientComponentClient();
  const [newVehicle, setNewVehicle] = useState({
    registration: '',
    make: '',
    model: '',
    year: '',
    class: ''
  });
  const [loading, setLoading] = useState(false);

  const addVehicle = async () => {
    if (!newVehicle.registration) return alert('Registration is required');
    setLoading(true);
    const { error } = await supabase.from('vehicles').insert({
      registration: newVehicle.registration,
      make: newVehicle.make || null,
      model: newVehicle.model || null,
      year: newVehicle.year || null,
      class: newVehicle.class || null
    });
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      setNewVehicle({ registration: '', make: '', model: '', year: '', class: '' });
      alert('Vehicle added!');
    }
  };

  return (
    <>
      <main className="max-w-xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center dark:text-white">Add Vehicle</h1>
        <div className="space-y-2 border p-4 rounded-md">
          <Input placeholder="Registration Number" value={newVehicle.registration} onChange={(e) => setNewVehicle({ ...newVehicle, registration: e.target.value })} />
          <Input placeholder="Make (optional)" value={newVehicle.make} onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })} />
          <Input placeholder="Model (optional)" value={newVehicle.model} onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })} />
          <Input placeholder="Year (optional)" value={newVehicle.year} onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })} />
          
          <Select value={newVehicle.class} onValueChange={(value) => setNewVehicle({ ...newVehicle, class: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Vehicle Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PSV">PSV</SelectItem>
              <SelectItem value="Executive">Executive</SelectItem>
              <SelectItem value="Economy">Economy</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={addVehicle} disabled={loading}>{loading ? 'Adding...' : 'Add Vehicle'}</Button>
        </div>
      </main>
    </>
  );
}