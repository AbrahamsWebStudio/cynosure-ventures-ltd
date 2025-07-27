-- Test Rides Table Access
-- Run this in your Supabase SQL Editor

-- 1. Check if table exists
SELECT '=== TABLE EXISTS CHECK ===' as section;
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ DOES NOT EXIST'
  END as status
FROM information_schema.tables 
WHERE table_name = 'rides' 
AND table_schema = 'public';

-- 2. Check table structure
SELECT '=== TABLE STRUCTURE ===' as section;
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'rides' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Test basic query
SELECT '=== BASIC QUERY TEST ===' as section;
SELECT COUNT(*) as total_rides FROM rides;

-- 4. Test the exact query your app is making
SELECT '=== APP QUERY TEST ===' as section;
SELECT 
  id,
  user_id,
  pickup_location,
  dropoff_location,
  vehicle_class,
  vehicle_id,
  price,
  status,
  payment_method,
  created_at
FROM rides
ORDER BY created_at DESC
LIMIT 5; 