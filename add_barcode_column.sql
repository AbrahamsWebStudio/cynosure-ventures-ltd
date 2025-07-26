-- Add barcode column to products table
-- Run this in your Supabase SQL Editor

-- Step 1: Add barcode column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode VARCHAR(50);

-- Step 2: Add index for faster barcode lookups
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);

-- Step 3: Add unique constraint to prevent duplicate barcodes
-- (Optional - uncomment if you want unique barcodes)
-- ALTER TABLE products ADD CONSTRAINT unique_product_barcode UNIQUE (barcode);

-- Step 4: Update existing products with sample barcodes (optional)
UPDATE products 
SET barcode = CONCAT('123456789', LPAD(id::text, 4, '0'))
WHERE barcode IS NULL;

-- Step 5: Verify the changes
SELECT 
  id,
  title,
  barcode,
  created_at
FROM products 
LIMIT 5; 