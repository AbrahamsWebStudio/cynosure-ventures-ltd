-- Sample User Data for CYNOSURE VENTURES LTD
-- This creates 10 demo users with wallets and transaction history

-- Sample Users with Profiles
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', NOW(), NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', NOW(), NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'mike.wilson@example.com', NOW(), NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'sarah.jones@example.com', NOW(), NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'david.brown@example.com', NOW(), NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'emma.davis@example.com', NOW(), NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'james.miller@example.com', NOW(), NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'lisa.garcia@example.com', NOW(), NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', 'robert.taylor@example.com', NOW(), NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'maria.anderson@example.com', NOW(), NOW(), NOW());

-- User Profiles
INSERT INTO profiles (id, full_name, phone_number, role) VALUES
('11111111-1111-1111-1111-111111111111', 'John Doe', '254700123456', 'customer'),
('22222222-2222-2222-2222-222222222222', 'Jane Smith', '254700234567', 'customer'),
('33333333-3333-3333-3333-333333333333', 'Mike Wilson', '254700345678', 'customer'),
('44444444-4444-4444-4444-444444444444', 'Sarah Jones', '254700456789', 'customer'),
('55555555-5555-5555-5555-555555555555', 'David Brown', '254700567890', 'customer'),
('66666666-6666-6666-6666-666666666666', 'Emma Davis', '254700678901', 'customer'),
('77777777-7777-7777-7777-777777777777', 'James Miller', '254700789012', 'customer'),
('88888888-8888-8888-8888-888888888888', 'Lisa Garcia', '254700890123', 'customer'),
('99999999-9999-9999-9999-999999999999', 'Robert Taylor', '254700901234', 'customer'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Maria Anderson', '254700012345', 'customer');

-- User Wallets with different balances
INSERT INTO wallets (user_id, balance, pin) VALUES
('11111111-1111-1111-1111-111111111111', 5000, '1234'),
('22222222-2222-2222-2222-222222222222', 3500, '5678'),
('33333333-3333-3333-3333-333333333333', 8000, '9012'),
('44444444-4444-4444-4444-444444444444', 1200, '3456'),
('55555555-5555-5555-5555-555555555555', 7500, '7890'),
('66666666-6666-6666-6666-666666666666', 2800, '2345'),
('77777777-7777-7777-7777-777777777777', 4200, '6789'),
('88888888-8888-8888-8888-888888888888', 6500, '0123'),
('99999999-9999-9999-9999-999999999999', 1800, '4567'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 9200, '8901');

-- Sample Transactions (Deposits and Withdrawals)
INSERT INTO transactions (user_id, type, amount, status, reference) VALUES
-- John Doe transactions
('11111111-1111-1111-1111-111111111111', 'deposit', 2000, 'completed', 'deposit_001'),
('11111111-1111-1111-1111-111111111111', 'deposit', 3000, 'completed', 'deposit_002'),
('11111111-1111-1111-1111-111111111111', 'withdrawal', 500, 'completed', 'withdrawal_001'),

-- Jane Smith transactions
('22222222-2222-2222-2222-222222222222', 'deposit', 1500, 'completed', 'deposit_003'),
('22222222-2222-2222-2222-222222222222', 'deposit', 2000, 'completed', 'deposit_004'),
('22222222-2222-2222-2222-222222222222', 'withdrawal', 800, 'completed', 'withdrawal_002'),

-- Mike Wilson transactions
('33333333-3333-3333-3333-333333333333', 'deposit', 4000, 'completed', 'deposit_005'),
('33333333-3333-3333-3333-333333333333', 'deposit', 4000, 'completed', 'deposit_006'),
('33333333-3333-3333-3333-333333333333', 'withdrawal', 1200, 'completed', 'withdrawal_003'),

-- Sarah Jones transactions
('44444444-4444-4444-4444-444444444444', 'deposit', 800, 'completed', 'deposit_007'),
('44444444-4444-4444-4444-444444444444', 'deposit', 400, 'completed', 'deposit_008'),
('44444444-4444-4444-4444-444444444444', 'withdrawal', 300, 'completed', 'withdrawal_004'),

-- David Brown transactions
('55555555-5555-5555-5555-555555555555', 'deposit', 3000, 'completed', 'deposit_009'),
('55555555-5555-5555-5555-555555555555', 'deposit', 4500, 'completed', 'deposit_010'),
('55555555-5555-5555-5555-555555555555', 'withdrawal', 1000, 'completed', 'withdrawal_005'),

-- Emma Davis transactions
('66666666-6666-6666-6666-666666666666', 'deposit', 1500, 'completed', 'deposit_011'),
('66666666-6666-6666-6666-666666666666', 'deposit', 1300, 'completed', 'deposit_012'),
('66666666-6666-6666-6666-666666666666', 'withdrawal', 600, 'completed', 'withdrawal_006'),

-- James Miller transactions
('77777777-7777-7777-7777-777777777777', 'deposit', 2000, 'completed', 'deposit_013'),
('77777777-7777-7777-7777-777777777777', 'deposit', 2200, 'completed', 'deposit_014'),
('77777777-7777-7777-7777-777777777777', 'withdrawal', 900, 'completed', 'withdrawal_007'),

-- Lisa Garcia transactions
('88888888-8888-8888-8888-888888888888', 'deposit', 3500, 'completed', 'deposit_015'),
('88888888-8888-8888-8888-888888888888', 'deposit', 3000, 'completed', 'deposit_016'),
('88888888-8888-8888-8888-888888888888', 'withdrawal', 1500, 'completed', 'withdrawal_008'),

-- Robert Taylor transactions
('99999999-9999-9999-9999-999999999999', 'deposit', 1000, 'completed', 'deposit_017'),
('99999999-9999-9999-9999-999999999999', 'deposit', 800, 'completed', 'deposit_018'),
('99999999-9999-9999-9999-999999999999', 'withdrawal', 400, 'completed', 'withdrawal_009'),

-- Maria Anderson transactions
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'deposit', 5000, 'completed', 'deposit_019'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'deposit', 4200, 'completed', 'deposit_020'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'withdrawal', 2000, 'completed', 'withdrawal_010');

-- Sample Orders (Product purchases)
INSERT INTO orders (user_id, product_id, quantity, total_amount, status, payment_method) VALUES
-- John Doe orders
('11111111-1111-1111-1111-111111111111', '1', 2, 1200, 'completed', 'ewallet'),
('11111111-1111-1111-1111-111111111111', '3', 1, 800, 'completed', 'mpesa'),

-- Jane Smith orders
('22222222-2222-2222-2222-222222222222', '2', 1, 600, 'completed', 'ewallet'),
('22222222-2222-2222-2222-222222222222', '4', 3, 1500, 'completed', 'mpesa'),

-- Mike Wilson orders
('33333333-3333-3333-3333-333333333333', '1', 1, 600, 'completed', 'ewallet'),
('33333333-3333-3333-3333-333333333333', '5', 2, 1000, 'completed', 'ewallet'),

-- Sarah Jones orders
('44444444-4444-4444-4444-444444444444', '2', 1, 600, 'completed', 'ewallet'),

-- David Brown orders
('55555555-5555-5555-5555-555555555555', '3', 1, 800, 'completed', 'mpesa'),
('55555555-5555-5555-5555-555555555555', '4', 2, 1000, 'completed', 'ewallet'),

-- Emma Davis orders
('66666666-6666-6666-6666-666666666666', '1', 1, 600, 'completed', 'ewallet'),
('66666666-6666-6666-6666-666666666666', '5', 1, 500, 'completed', 'mpesa'),

-- James Miller orders
('77777777-7777-7777-7777-777777777777', '2', 2, 1200, 'completed', 'ewallet'),

-- Lisa Garcia orders
('88888888-8888-8888-8888-888888888888', '3', 1, 800, 'completed', 'ewallet'),
('88888888-8888-8888-8888-888888888888', '4', 1, 500, 'completed', 'mpesa'),

-- Robert Taylor orders
('99999999-9999-9999-9999-999999999999', '1', 1, 600, 'completed', 'ewallet'),

-- Maria Anderson orders
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '5', 3, 1500, 'completed', 'ewallet'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2', 1, 600, 'completed', 'mpesa');

-- Sample Ride Bookings
INSERT INTO rides (user_id, pickup_location, dropoff_location, vehicle_class, vehicle_id, price, status, payment_method) VALUES
-- John Doe rides
('11111111-1111-1111-1111-111111111111', 'Nairobi CBD', 'Westlands', 'Standard', '1', 300, 'confirmed', 'ewallet'),
('11111111-1111-1111-1111-111111111111', 'Kileleshwa', 'Kilimani', 'Economy', '2', 400, 'confirmed', 'mpesa'),

-- Jane Smith rides
('22222222-2222-2222-2222-222222222222', 'Lavington', 'Karen', 'Executive', '3', 800, 'confirmed', 'ewallet'),
('22222222-2222-2222-2222-222222222222', 'South B', 'Embakasi', 'PSV', '4', 150, 'confirmed', 'mpesa'),

-- Mike Wilson rides
('33333333-3333-3333-3333-333333333333', 'Runda', 'Gigiri', 'Executive', '5', 800, 'confirmed', 'ewallet'),
('33333333-3333-3333-3333-333333333333', 'Donholm', 'Buruburu', 'Standard', '6', 300, 'confirmed', 'ewallet'),

-- Sarah Jones rides
('44444444-4444-4444-4444-444444444444', 'Kasarani', 'Thika Road', 'PSV', '7', 150, 'confirmed', 'ewallet'),

-- David Brown rides
('55555555-5555-5555-5555-555555555555', 'Muthaiga', 'Westlands', 'Executive', '8', 800, 'confirmed', 'mpesa'),
('55555555-5555-5555-5555-555555555555', 'Kilimani', 'Lavington', 'Standard', '9', 300, 'confirmed', 'ewallet'),

-- Emma Davis rides
('66666666-6666-6666-6666-666666666666', 'South C', 'Langata', 'Economy', '10', 400, 'confirmed', 'ewallet'),
('66666666-6666-6666-6666-666666666666', 'Umoja', 'Donholm', 'PSV', '11', 150, 'confirmed', 'mpesa'),

-- James Miller rides
('77777777-7777-7777-7777-777777777777', 'Westlands', 'CBD', 'Standard', '12', 300, 'confirmed', 'ewallet'),

-- Lisa Garcia rides
('88888888-8888-8888-8888-888888888888', 'Karen', 'Runda', 'Executive', '13', 800, 'confirmed', 'ewallet'),
('88888888-8888-8888-8888-888888888888', 'Buruburu', 'South B', 'PSV', '14', 150, 'confirmed', 'mpesa'),

-- Robert Taylor rides
('99999999-9999-9999-9999-999999999999', 'Donholm', 'Embakasi', 'Economy', '15', 400, 'confirmed', 'ewallet'),

-- Maria Anderson rides
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Gigiri', 'Westlands', 'Executive', '16', 800, 'confirmed', 'ewallet'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Langata', 'CBD', 'Standard', '17', 300, 'confirmed', 'mpesa');

-- Sample Bank Payments (Pending)
INSERT INTO bank_payments (user_id, amount, bank, account_number, status, booking_type) VALUES
('11111111-1111-1111-1111-111111111111', 1200, 'Equity Bank', '1234567890', 'pending', 'product_order'),
('22222222-2222-2222-2222-222222222222', 800, 'KCB Bank', '0987654321', 'pending', 'ride'),
('33333333-3333-3333-3333-333333333333', 1500, 'Cooperative Bank', '1122334455', 'pending', 'product_order'),
('44444444-4444-4444-4444-444444444444', 600, 'Absa Bank', '5566778899', 'pending', 'ride'),
('55555555-5555-5555-5555-555555555555', 2000, 'NCBA Bank', '9988776655', 'pending', 'product_order');

-- Display sample data summary
SELECT 
  'User Summary' as info,
  COUNT(*) as count,
  'users with wallets and transactions' as description
FROM profiles
UNION ALL
SELECT 
  'Wallet Balances' as info,
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