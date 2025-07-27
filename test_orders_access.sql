-- Test Orders Table Access
-- Run this in your Supabase SQL Editor

-- Try to select from orders table
SELECT 
  'Test Query' as test_type,
  COUNT(*) as record_count,
  'SUCCESS' as status
FROM orders
LIMIT 1;

-- If the above fails, this will show the actual error
-- The error message will help us understand what's wrong 