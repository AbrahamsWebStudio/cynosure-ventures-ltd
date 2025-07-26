-- Database Functions for CYNOSURE VENTURES LTD

-- Function to process e-wallet payments for products
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

-- Function to process e-wallet ride payments
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

-- Function to increment wallet balance (already exists, but adding here for completeness)
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

-- Function to create a new wallet for a user if it doesn't exist
CREATE OR REPLACE FUNCTION create_wallet_if_not_exists(
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO wallets (user_id, balance, pin)
  VALUES (p_user_id, 0, NULL)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Function to get user's wallet balance
CREATE OR REPLACE FUNCTION get_wallet_balance(
  p_user_id UUID
)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  wallet_balance DECIMAL;
BEGIN
  SELECT balance INTO wallet_balance
  FROM wallets
  WHERE user_id = p_user_id;
  
  RETURN COALESCE(wallet_balance, 0);
END;
$$;

-- Function to validate wallet PIN
CREATE OR REPLACE FUNCTION validate_wallet_pin(
  p_user_id UUID,
  p_pin VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_pin VARCHAR;
BEGIN
  SELECT pin INTO stored_pin
  FROM wallets
  WHERE user_id = p_user_id;
  
  RETURN stored_pin = p_pin;
END;
$$;

-- Function to update wallet PIN
CREATE OR REPLACE FUNCTION update_wallet_pin(
  p_user_id UUID,
  p_pin VARCHAR
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE wallets
  SET pin = p_pin
  WHERE user_id = p_user_id;
END;
$$;

-- Function to get user's transaction history
CREATE OR REPLACE FUNCTION get_user_transactions(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  type VARCHAR,
  amount DECIMAL,
  status VARCHAR,
  reference VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.type,
    t.amount,
    t.status,
    t.reference,
    t.created_at
  FROM transactions t
  WHERE t.user_id = p_user_id
  ORDER BY t.created_at DESC
  LIMIT p_limit;
END;
$$;

-- Function to get user's ride history
CREATE OR REPLACE FUNCTION get_user_rides(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  pickup_location TEXT,
  dropoff_location TEXT,
  vehicle_class VARCHAR,
  price DECIMAL,
  status VARCHAR,
  payment_method VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.pickup_location,
    r.dropoff_location,
    r.vehicle_class,
    r.price,
    r.status,
    r.payment_method,
    r.created_at
  FROM rides r
  WHERE r.user_id = p_user_id
  ORDER BY r.created_at DESC
  LIMIT p_limit;
END;
$$;

-- Function to get user's order history
CREATE OR REPLACE FUNCTION get_user_orders(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  product_id UUID,
  quantity INTEGER,
  total_amount DECIMAL,
  status VARCHAR,
  payment_method VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.product_id,
    o.quantity,
    o.total_amount,
    o.status,
    o.payment_method,
    o.created_at
  FROM orders o
  WHERE o.user_id = p_user_id
  ORDER BY o.created_at DESC
  LIMIT p_limit;
END;
$$; 