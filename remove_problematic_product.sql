-- Remove problematic product that's causing loading issues
-- Run this in your Supabase SQL Editor

-- Step 1: Check if the product exists
SELECT 
  id,
  title,
  price,
  created_at
FROM products 
WHERE id = '8163e241-4b16-406e-a838-4c2ce231d025';

-- Step 2: Check if this product has any associated orders
SELECT 
  COUNT(*) as order_count
FROM orders 
WHERE product_id = '8163e241-4b16-406e-a838-4c2ce231d025';

-- Step 3: Delete the problematic product (only if no orders exist)
-- Uncomment the line below if you want to delete the product
-- DELETE FROM products WHERE id = '8163e241-4b16-406e-a838-4c2ce231d025';

-- Step 4: Alternative - Update the product with valid data instead of deleting
-- Uncomment and modify the lines below if you want to fix the product instead
/*
UPDATE products 
SET 
  title = 'Fixed Product',
  price = 100,
  description = 'This product has been fixed',
  category = 'general',
  stock = 10
WHERE id = '8163e241-4b16-406e-a838-4c2ce231d025';
*/

-- Step 5: Verify the product is gone or fixed
SELECT 
  id,
  title,
  price,
  created_at
FROM products 
WHERE id = '8163e241-4b16-406e-a838-4c2ce231d025'; 