-- Add confirmation_code column to orders table
-- Run this in your Supabase SQL Editor

-- Step 1: Add confirmation_code column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS confirmation_code TEXT;

-- Step 2: Add index for faster confirmation code lookups
CREATE INDEX IF NOT EXISTS idx_orders_confirmation_code ON orders(confirmation_code);

-- Step 3: Verify the changes
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'confirmation_code';

-- Step 4: Check current orders table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position; 