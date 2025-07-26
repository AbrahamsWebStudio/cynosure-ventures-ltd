-- Add PIN column to wallets table
ALTER TABLE wallets ADD COLUMN pin VARCHAR(4);

-- Create bank_payments table
CREATE TABLE bank_payments (
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

-- Add payment_method column to rides table
ALTER TABLE rides ADD COLUMN payment_method VARCHAR(20);

-- Create function to process e-wallet payments
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

  -- Insert transaction record
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

-- Create function to increment wallet balance (if not exists)
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

-- Create RLS policies for bank_payments
ALTER TABLE bank_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bank payments" ON bank_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank payments" ON bank_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update rides table to include payment tracking
ALTER TABLE rides ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_bank_payments_user_id ON bank_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id); 