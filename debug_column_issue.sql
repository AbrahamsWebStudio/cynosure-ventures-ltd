-- Debug the column issue
-- Run this in your Supabase SQL Editor

-- 1. Check what columns actually exist in the orders table
SELECT '=== ACTUAL COLUMNS IN ORDERS TABLE ===' as section;
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Test a simple query without the problematic columns
SELECT '=== SIMPLE QUERY TEST ===' as section;
SELECT 
  id,
  user_id,
  product_id,
  quantity,
  total_amount,
  status,
  created_at
FROM orders
LIMIT 1;

-- 3. Test each potentially problematic column individually
SELECT '=== TESTING INDIVIDUAL COLUMNS ===' as section;

-- Test confirmation_code column
SELECT 'Testing confirmation_code column...' as test;
SELECT confirmation_code FROM orders LIMIT 1;

-- Test payment_method column  
SELECT 'Testing payment_method column...' as test;
SELECT payment_method FROM orders LIMIT 1;

-- Test profiles join
SELECT 'Testing profiles join...' as test;
SELECT profiles (full_name) FROM orders LIMIT 1;

-- Test products join
SELECT 'Testing products join...' as test;
SELECT products (title) FROM orders LIMIT 1; 