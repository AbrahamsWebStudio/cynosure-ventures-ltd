-- Fix Orders Table - Add Missing Columns
-- Run this in your Supabase SQL Editor

-- Add missing columns to the existing orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20),
ADD COLUMN IF NOT EXISTS confirmation_code VARCHAR(50);

-- Verify the table structure now
SELECT '=== UPDATED TABLE STRUCTURE ===' as section;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test the query again
SELECT '=== TESTING FIXED QUERY ===' as section;
SELECT 
  id,
  user_id,
  product_id,
  quantity,
  total_amount,
  status,
  created_at,
  confirmation_code,
  payment_method,
  profiles (full_name),
  products (title)
FROM orders
ORDER BY created_at DESC
LIMIT 1; 