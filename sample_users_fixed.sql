-- Sample User Data for CYNOSURE VENTURES LTD (Fixed Version)
-- This adds wallet and transaction data for existing users

-- First, let's check what users exist in your system
-- SELECT id, email FROM auth.users LIMIT 10;

-- Create wallets for existing users (replace with actual user IDs from your system)
-- You'll need to replace these UUIDs with actual user IDs from your auth.users table

-- Sample Wallets (replace user_id with actual user IDs from your system)
INSERT INTO wallets (user_id, balance, pin) VALUES
-- Replace these UUIDs with actual user IDs from your auth.users table
-- You can get these by running: SELECT id, email FROM auth.users;
('00000000-0000-0000-0000-000000000001', 5000, '1234'),
('00000000-0000-0000-0000-000000000002', 3500, '5678'),
('00000000-0000-0000-0000-000000000003', 8000, '9012'),
('00000000-0000-0000-0000-000000000004', 1200, '3456'),
('00000000-0000-0000-0000-000000000005', 7500, '7890'),
('00000000-0000-0000-0000-000000000006', 2800, '2345'),
('00000000-0000-0000-0000-000000000007', 4200, '6789'),
('00000000-0000-0000-0000-000000000008', 6500, '0123'),
('00000000-0000-0000-0000-000000000009', 1800, '4567'),
('00000000-0000-0000-0000-000000000010', 9200, '8901')
ON CONFLICT (user_id) DO UPDATE SET 
  balance = EXCLUDED.balance,
  pin = EXCLUDED.pin;

-- Sample Transactions (Deposits and Withdrawals)
INSERT INTO transactions (user_id, type, amount, status, reference) VALUES
-- User 1 transactions
('00000000-0000-0000-0000-000000000001', 'deposit', 2000, 'completed', 'deposit_001'),
('00000000-0000-0000-0000-000000000001', 'deposit', 3000, 'completed', 'deposit_002'),
('00000000-0000-0000-0000-000000000001', 'withdrawal', 500, 'completed', 'withdrawal_001'),

-- User 2 transactions
('00000000-0000-0000-0000-000000000002', 'deposit', 1500, 'completed', 'deposit_003'),
('00000000-0000-0000-0000-000000000002', 'deposit', 2000, 'completed', 'deposit_004'),
('00000000-0000-0000-0000-000000000002', 'withdrawal', 800, 'completed', 'withdrawal_002'),

-- User 3 transactions
('00000000-0000-0000-0000-000000000003', 'deposit', 4000, 'completed', 'deposit_005'),
('00000000-0000-0000-0000-000000000003', 'deposit', 4000, 'completed', 'deposit_006'),
('00000000-0000-0000-0000-000000000003', 'withdrawal', 1200, 'completed', 'withdrawal_003'),

-- User 4 transactions
('00000000-0000-0000-0000-000000000004', 'deposit', 800, 'completed', 'deposit_007'),
('00000000-0000-0000-0000-000000000004', 'deposit', 400, 'completed', 'deposit_008'),
('00000000-0000-0000-0000-000000000004', 'withdrawal', 300, 'completed', 'withdrawal_004'),

-- User 5 transactions
('00000000-0000-0000-0000-000000000005', 'deposit', 3000, 'completed', 'deposit_009'),
('00000000-0000-0000-0000-000000000005', 'deposit', 4500, 'completed', 'deposit_010'),
('00000000-0000-0000-0000-000000000005', 'withdrawal', 1000, 'completed', 'withdrawal_005'),

-- User 6 transactions
('00000000-0000-0000-0000-000000000006', 'deposit', 1500, 'completed', 'deposit_011'),
('00000000-0000-0000-0000-000000000006', 'deposit', 1300, 'completed', 'deposit_012'),
('00000000-0000-0000-0000-000000000006', 'withdrawal', 600, 'completed', 'withdrawal_006'),

-- User 7 transactions
('00000000-0000-0000-0000-000000000007', 'deposit', 2000, 'completed', 'deposit_013'),
('00000000-0000-0000-0000-000000000007', 'deposit', 2200, 'completed', 'deposit_014'),
('00000000-0000-0000-0000-000000000007', 'withdrawal', 900, 'completed', 'withdrawal_007'),

-- User 8 transactions
('00000000-0000-0000-0000-000000000008', 'deposit', 3500, 'completed', 'deposit_015'),
('00000000-0000-0000-0000-000000000008', 'deposit', 3000, 'completed', 'deposit_016'),
('00000000-0000-0000-0000-000000000008', 'withdrawal', 1500, 'completed', 'withdrawal_008'),

-- User 9 transactions
('00000000-0000-0000-0000-000000000009', 'deposit', 1000, 'completed', 'deposit_017'),
('00000000-0000-0000-0000-000000000009', 'deposit', 800, 'completed', 'deposit_018'),
('00000000-0000-0000-0000-000000000009', 'withdrawal', 400, 'completed', 'withdrawal_009'),

-- User 10 transactions
('00000000-0000-0000-0000-000000000010', 'deposit', 5000, 'completed', 'deposit_019'),
('00000000-0000-0000-0000-000000000010', 'deposit', 4200, 'completed', 'deposit_020'),
('00000000-0000-0000-0000-000000000010', 'withdrawal', 2000, 'completed', 'withdrawal_010');

-- Sample Orders (Product purchases) - replace user_id with actual user IDs
INSERT INTO orders (user_id, product_id, quantity, total_amount, status, payment_method) VALUES
-- User 1 orders
('00000000-0000-0000-0000-000000000001', '1', 2, 1200, 'completed', 'ewallet'),
('00000000-0000-0000-0000-000000000001', '3', 1, 800, 'completed', 'mpesa'),

-- User 2 orders
('00000000-0000-0000-0000-000000000002', '2', 1, 600, 'completed', 'ewallet'),
('00000000-0000-0000-0000-000000000002', '4', 3, 1500, 'completed', 'mpesa'),

-- User 3 orders
('00000000-0000-0000-0000-000000000003', '1', 1, 600, 'completed', 'ewallet'),
('00000000-0000-0000-0000-000000000003', '5', 2, 1000, 'completed', 'ewallet'),

-- User 4 orders
('00000000-0000-0000-0000-000000000004', '2', 1, 600, 'completed', 'ewallet'),

-- User 5 orders
('00000000-0000-0000-0000-000000000005', '3', 1, 800, 'completed', 'mpesa'),
('00000000-0000-0000-0000-000000000005', '4', 2, 1000, 'completed', 'ewallet'),

-- User 6 orders
('00000000-0000-0000-0000-000000000006', '1', 1, 600, 'completed', 'ewallet'),
('00000000-0000-0000-0000-000000000006', '5', 1, 500, 'completed', 'mpesa'),

-- User 7 orders
('00000000-0000-0000-0000-000000000007', '2', 2, 1200, 'completed', 'ewallet'),

-- User 8 orders
('00000000-0000-0000-0000-000000000008', '3', 1, 800, 'completed', 'ewallet'),
('00000000-0000-0000-0000-000000000008', '4', 1, 500, 'completed', 'mpesa'),

-- User 9 orders
('00000000-0000-0000-0000-000000000009', '1', 1, 600, 'completed', 'ewallet'),

-- User 10 orders
('00000000-0000-0000-0000-000000000010', '5', 3, 1500, 'completed', 'ewallet'),
('00000000-0000-0000-0000-000000000010', '2', 1, 600, 'completed', 'mpesa');

-- Sample Ride Bookings - replace user_id with actual user IDs
INSERT INTO rides (user_id, pickup_location, dropoff_location, vehicle_class, vehicle_id, price, status, payment_method) VALUES
-- User 1 rides
('00000000-0000-0000-0000-000000000001', 'Nairobi CBD', 'Westlands', 'Standard', '1', 300, 'confirmed', 'ewallet'),
('00000000-0000-0000-0000-000000000001', 'Kileleshwa', 'Kilimani', 'Economy', '2', 400, 'confirmed', 'mpesa'),

-- User 2 rides
('00000000-0000-0000-0000-000000000002', 'Lavington', 'Karen', 'Executive', '3', 800, 'confirmed', 'ewallet'),
('00000000-0000-0000-0000-000000000002', 'South B', 'Embakasi', 'PSV', '4', 150, 'confirmed', 'mpesa'),

-- User 3 rides
('00000000-0000-0000-0000-000000000003', 'Runda', 'Gigiri', 'Executive', '5', 800, 'confirmed', 'ewallet'),
('00000000-0000-0000-0000-000000000003', 'Donholm', 'Buruburu', 'Standard', '6', 300, 'confirmed', 'ewallet'),

-- User 4 rides
('00000000-0000-0000-0000-000000000004', 'Kasarani', 'Thika Road', 'PSV', '7', 150, 'confirmed', 'ewallet'),

-- User 5 rides
('00000000-0000-0000-0000-000000000005', 'Muthaiga', 'Westlands', 'Executive', '8', 800, 'confirmed', 'mpesa'),
('00000000-0000-0000-0000-000000000005', 'Kilimani', 'Lavington', 'Standard', '9', 300, 'confirmed', 'ewallet'),

-- User 6 rides
('00000000-0000-0000-0000-000000000006', 'South C', 'Langata', 'Economy', '10', 400, 'confirmed', 'ewallet'),
('00000000-0000-0000-0000-000000000006', 'Umoja', 'Donholm', 'PSV', '11', 150, 'confirmed', 'mpesa'),

-- User 7 rides
('00000000-0000-0000-0000-000000000007', 'Westlands', 'CBD', 'Standard', '12', 300, 'confirmed', 'ewallet'),

-- User 8 rides
('00000000-0000-0000-0000-000000000008', 'Karen', 'Runda', 'Executive', '13', 800, 'confirmed', 'ewallet'),
('00000000-0000-0000-0000-000000000008', 'Buruburu', 'South B', 'PSV', '14', 150, 'confirmed', 'mpesa'),

-- User 9 rides
('00000000-0000-0000-0000-000000000009', 'Donholm', 'Embakasi', 'Economy', '15', 400, 'confirmed', 'ewallet'),

-- User 10 rides
('00000000-0000-0000-0000-000000000010', 'Gigiri', 'Westlands', 'Executive', '16', 800, 'confirmed', 'ewallet'),
('00000000-0000-0000-0000-000000000010', 'Langata', 'CBD', 'Standard', '17', 300, 'confirmed', 'mpesa');

-- Sample Bank Payments (Pending) - replace user_id with actual user IDs
INSERT INTO bank_payments (user_id, amount, bank, account_number, status, booking_type) VALUES
('00000000-0000-0000-0000-000000000001', 1200, 'Equity Bank', '1234567890', 'pending', 'product_order'),
('00000000-0000-0000-0000-000000000002', 800, 'KCB Bank', '0987654321', 'pending', 'ride'),
('00000000-0000-0000-0000-000000000003', 1500, 'Cooperative Bank', '1122334455', 'pending', 'product_order'),
('00000000-0000-0000-0000-000000000004', 600, 'Absa Bank', '5566778899', 'pending', 'ride'),
('00000000-0000-0000-0000-000000000005', 2000, 'NCBA Bank', '9988776655', 'pending', 'product_order');

-- Display sample data summary
SELECT 
  'Wallet Summary' as info,
  COUNT(*) as count,
  'active wallets with funds' as description
FROM wallets WHERE balance > 0
UNION ALL
SELECT 
  'Transactions' as info,
  COUNT(*) as count,
  'completed transactions' as description
FROM transactions WHERE status = 'completed'
UNION ALL
SELECT 
  'Orders' as info,
  COUNT(*) as count,
  'product orders' as description
FROM orders WHERE status = 'completed'
UNION ALL
SELECT 
  'Rides' as info,
  COUNT(*) as count,
  'confirmed ride bookings' as description
FROM rides WHERE status = 'confirmed'; 