-- Fix for Ride Payment Function
-- This ensures the process_ewallet_payment function works correctly with ride bookings

-- Drop and recreate the function with proper parameter handling
DROP FUNCTION IF EXISTS process_ewallet_payment(UUID, DECIMAL, VARCHAR, UUID, TEXT, TEXT, VARCHAR);

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

-- Also create a simpler version for testing
CREATE OR REPLACE FUNCTION process_ride_payment_simple(
  p_user_id UUID,
  p_amount DECIMAL,
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

-- Test the function exists
SELECT 
  'Function Status' as info,
  COUNT(*) as count,
  'database functions available' as description
FROM information_schema.routines 
WHERE routine_name IN ('process_ewallet_payment', 'process_ride_payment_simple'); 