-- Quick Setup Script for CYNOSURE VENTURES LTD
-- Run this after you've set up the database schema

-- Step 1: Check your existing users
SELECT 'Your existing users:' as info;
SELECT id, email FROM auth.users LIMIT 5;

-- Step 2: Create a wallet for the first user (replace with your actual user ID)
-- Uncomment and modify the line below with your actual user ID
-- INSERT INTO wallets (user_id, balance, pin) VALUES ('your-user-id-here', 5000, '1234');

-- Step 3: Add some sample transactions for testing
-- Uncomment and modify with your actual user ID
/*
INSERT INTO transactions (user_id, type, amount, status, reference) VALUES
('your-user-id-here', 'deposit', 2000, 'completed', 'deposit_001'),
('your-user-id-here', 'deposit', 3000, 'completed', 'deposit_002'),
('your-user-id-here', 'withdrawal', 500, 'completed', 'withdrawal_001');
*/

-- Step 4: Add sample orders for testing
-- Uncomment and modify with your actual user ID
/*
INSERT INTO orders (user_id, product_id, quantity, total_amount, status, payment_method) VALUES
('your-user-id-here', '1', 2, 1200, 'completed', 'ewallet'),
('your-user-id-here', '3', 1, 800, 'completed', 'mpesa');
*/

-- Step 5: Add sample rides for testing
-- Uncomment and modify with your actual user ID
/*
INSERT INTO rides (user_id, pickup_location, dropoff_location, vehicle_class, vehicle_id, price, status, payment_method) VALUES
('your-user-id-here', 'Nairobi CBD', 'Westlands', 'Standard', '1', 300, 'confirmed', 'ewallet'),
('your-user-id-here', 'Kileleshwa', 'Kilimani', 'Economy', '2', 400, 'confirmed', 'mpesa');
*/

-- Step 6: Check if setup was successful
SELECT 'Setup Summary:' as info;
SELECT 
  'Wallets' as table_name,
  COUNT(*) as count
FROM wallets
UNION ALL
SELECT 
  'Transactions' as table_name,
  COUNT(*) as count
FROM transactions
UNION ALL
SELECT 
  'Orders' as table_name,
  COUNT(*) as count
FROM orders
UNION ALL
SELECT 
  'Rides' as table_name,
  COUNT(*) as count
FROM rides; 