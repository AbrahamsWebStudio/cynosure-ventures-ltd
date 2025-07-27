-- Simulate the exact query your application is making
-- This will help us see the exact error

-- Test the exact query from your OrdersClient
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
ORDER BY created_at DESC;

-- If the above fails, let's try a simpler query
SELECT 'Testing basic access...' as test;
SELECT COUNT(*) FROM orders;

-- If that fails too, let's check if we can see the table at all
SELECT 'Testing table visibility...' as test;
SELECT * FROM information_schema.tables WHERE table_name = 'orders'; 