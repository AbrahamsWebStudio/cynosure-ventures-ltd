-- Create Rides Table for CYNOSURE VENTURES LTD
-- Run this in your Supabase SQL Editor

-- Create rides table if it doesn't exist
CREATE TABLE IF NOT EXISTS rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  vehicle_class VARCHAR(50),
  vehicle_id UUID REFERENCES vehicles(id),
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_vehicle_class ON rides(vehicle_class);
CREATE INDEX IF NOT EXISTS idx_rides_created_at ON rides(created_at);

-- Enable Row Level Security
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own rides" ON rides;
DROP POLICY IF EXISTS "Users can insert their own rides" ON rides;
DROP POLICY IF EXISTS "Users can update their own rides" ON rides;

-- Create RLS policies
CREATE POLICY "Users can view their own rides" ON rides
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rides" ON rides
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rides" ON rides
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_rides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_rides_updated_at ON rides;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_rides_updated_at
  BEFORE UPDATE ON rides
  FOR EACH ROW
  EXECUTE FUNCTION update_rides_updated_at();

-- Insert some sample rides for testing (optional)
-- Uncomment and modify with your actual user ID if you want sample data
/*
INSERT INTO rides (user_id, pickup_location, dropoff_location, vehicle_class, vehicle_id, price, status, payment_method) VALUES
('your-user-id-here', 'Nairobi CBD', 'Westlands', 'Standard', '1', 300, 'confirmed', 'ewallet'),
('your-user-id-here', 'Kileleshwa', 'Kilimani', 'Economy', '2', 400, 'confirmed', 'mpesa'),
('your-user-id-here', 'Lavington', 'Karen', 'Executive', '3', 800, 'pending', 'ewallet');
*/

-- Verify the table was created successfully
SELECT 
  'Rides Table Created Successfully!' as status,
  'The rides table is now ready to use.' as message; 