-- Fix Rides Table - Check and Create if Needed
-- Run this in your Supabase SQL Editor

-- First, check if rides table exists
SELECT 
  'Checking rides table...' as step,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'rides' 
      AND table_schema = 'public'
    ) THEN '✅ EXISTS'
    ELSE '❌ DOES NOT EXIST'
  END as status;

-- If table doesn't exist, create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'rides' 
    AND table_schema = 'public'
  ) THEN
    -- Create rides table
    CREATE TABLE rides (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      pickup_location TEXT NOT NULL,
      dropoff_location TEXT NOT NULL,
      vehicle_class VARCHAR(50),
      vehicle_id UUID,
      price DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      payment_method VARCHAR(20),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX idx_rides_user_id ON rides(user_id);
    CREATE INDEX idx_rides_status ON rides(status);
    CREATE INDEX idx_rides_vehicle_class ON rides(vehicle_class);
    CREATE INDEX idx_rides_created_at ON rides(created_at);

    -- Enable RLS
    ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

    -- Create policies (only if they don't exist)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rides' AND policyname = 'Users can view their own rides') THEN
      CREATE POLICY "Users can view their own rides" ON rides
        FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rides' AND policyname = 'Users can insert their own rides') THEN
      CREATE POLICY "Users can insert their own rides" ON rides
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rides' AND policyname = 'Users can update their own rides') THEN
      CREATE POLICY "Users can update their own rides" ON rides
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rides' AND policyname = 'Admins can view all rides') THEN
      CREATE POLICY "Admins can view all rides" ON rides
        FOR SELECT USING (auth.uid() IS NOT NULL);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rides' AND policyname = 'Admins can update all rides') THEN
      CREATE POLICY "Admins can update all rides" ON rides
        FOR UPDATE USING (auth.uid() IS NOT NULL);
    END IF;

    RAISE NOTICE 'Rides table created successfully!';
  ELSE
    RAISE NOTICE 'Rides table already exists!';
  END IF;
END $$;

-- Test if we can query the rides table
SELECT 
  'Testing rides table access...' as step,
  COUNT(*) as record_count
FROM rides; 