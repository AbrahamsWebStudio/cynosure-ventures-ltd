-- Temporary Fix for Orders Query
-- Run this in your Supabase SQL Editor

-- Test the orders query without the problematic joins
SELECT 
  id,
  user_id,
  product_id,
  quantity,
  total_amount,
  status,
  created_at,
  confirmation_code,
  payment_method
FROM orders
ORDER BY created_at DESC
LIMIT 5; 