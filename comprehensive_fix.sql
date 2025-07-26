-- Comprehensive Fix for CYNOSURE VENTURES LTD
-- This script fixes all database issues and ensures proper functionality

-- 1. Ensure wallets table has unique constraint
ALTER TABLE wallets ADD CONSTRAINT IF NOT EXISTS wallets_user_id_unique UNIQUE (user_id);

-- 2. Ensure all required tables exist with proper structure
CREATE TABLE IF NOT EXISTS rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  vehicle_class VARCHAR(50),
  vehicle_id UUID REFERENCES vehicles(id),
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  reference VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bank_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  bank VARCHAR(100) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  booking_type VARCHAR(50),
  vehicle_id UUID REFERENCES vehicles(id),
  pickup_location TEXT,
  dropoff_location TEXT,
  vehicle_class VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create or replace the ride payment function
CREATE OR REPLACE FUNCTION process_ewallet_payment(
  p_user_id UUID,
  p_amount DECIMAL,
  p_booking_type VARCHAR,
  p_vehicle_id UUID,
  p_pickup TEXT,
  p_dropoff TEXT,
  p_vehicle_class VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has sufficient balance
  IF NOT EXISTS (
    SELECT 1 FROM wallets
    WHERE user_id = p_user_id AND balance >= p_amount
  ) THEN
    RAISE EXCEPTION 'Insufficient wallet balance';
  END IF;

  -- Deduct amount from wallet
  UPDATE wallets
  SET balance = balance - p_amount
  WHERE user_id = p_user_id;

  -- Insert transaction record for withdrawal
  INSERT INTO transactions (
    user_id,
    type,
    amount,
    status,
    reference
  ) VALUES (
    p_user_id,
    'withdrawal',
    p_amount,
    'completed',
    'ewallet_payment_' || gen_random_uuid()
  );

  -- Insert ride booking
  INSERT INTO rides (
    user_id,
    pickup_location,
    dropoff_location,
    vehicle_class,
    vehicle_id,
    price,
    status,
    payment_method
  ) VALUES (
    p_user_id,
    p_pickup,
    p_dropoff,
    p_vehicle_class,
    p_vehicle_id,
    p_amount,
    'confirmed',
    'ewallet'
  );

  -- Insert transaction for the ride payment
  INSERT INTO transactions (
    user_id,
    type,
    amount,
    status,
    reference
  ) VALUES (
    p_user_id,
    'ride_payment',
    p_amount,
    'completed',
    'ride_payment_' || gen_random_uuid()
  );
END;
$$;

-- 4. Create product payment function
CREATE OR REPLACE FUNCTION process_ewallet_product_payment(
  p_user_id UUID,
  p_amount DECIMAL,
  p_cart_items JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has sufficient balance
  IF NOT EXISTS (
    SELECT 1 FROM wallets
    WHERE user_id = p_user_id AND balance >= p_amount
  ) THEN
    RAISE EXCEPTION 'Insufficient wallet balance';
  END IF;

  -- Deduct amount from wallet
  UPDATE wallets
  SET balance = balance - p_amount
  WHERE user_id = p_user_id;

  -- Insert transaction record for withdrawal
  INSERT INTO transactions (
    user_id,
    type,
    amount,
    status,
    reference
  ) VALUES (
    p_user_id,
    'withdrawal',
    p_amount,
    'completed',
    'ewallet_product_payment_' || gen_random_uuid()
  );

  -- Insert orders for each cart item
  FOR i IN 0..jsonb_array_length(p_cart_items) - 1 LOOP
    INSERT INTO orders (
      user_id,
      product_id,
      quantity,
      total_amount,
      status,
      payment_method
    ) VALUES (
      p_user_id,
      (p_cart_items->i->>'id')::UUID,
      1,
      (p_cart_items->i->>'price')::DECIMAL,
      'completed',
      'ewallet'
    );
  END LOOP;

  -- Insert transaction for the product payment
  INSERT INTO transactions (
    user_id,
    type,
    amount,
    status,
    reference
  ) VALUES (
    p_user_id,
    'product_payment',
    p_amount,
    'completed',
    'product_payment_' || gen_random_uuid()
  );
END;
$$;

-- 5. Create wallet balance increment function
CREATE OR REPLACE FUNCTION increment_wallet_balance(
  p_user_id UUID,
  p_amount DECIMAL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO wallets (user_id, balance)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET balance = wallets.balance + p_amount;
END;
$$;

-- 6. Add RLS policies for security
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for rides
CREATE POLICY IF NOT EXISTS "Users can view their own rides" ON rides
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own rides" ON rides
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for orders
CREATE POLICY IF NOT EXISTS "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for transactions
CREATE POLICY IF NOT EXISTS "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for bank_payments
CREATE POLICY IF NOT EXISTS "Users can view their own bank payments" ON bank_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own bank payments" ON bank_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_payments_user_id ON bank_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- 8. Verify setup
SELECT 
  'Database Setup Status' as info,
  COUNT(*) as count,
  'tables created/updated' as description
FROM information_schema.tables 
WHERE table_name IN ('rides', 'orders', 'transactions', 'bank_payments', 'wallets')
AND table_schema = 'public'

UNION ALL

SELECT 
  'Function Status' as info,
  COUNT(*) as count,
  'payment functions available' as description
FROM information_schema.routines 
WHERE routine_name IN ('process_ewallet_payment', 'process_ewallet_product_payment', 'increment_wallet_balance')
AND routine_schema = 'public'

UNION ALL

SELECT 
  'Constraint Status' as info,
  COUNT(*) as count,
  'unique constraints added' as description
FROM information_schema.table_constraints 
WHERE constraint_name = 'wallets_user_id_unique'
AND table_schema = 'public'; 