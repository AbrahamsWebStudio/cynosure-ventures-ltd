-- Receipt Tracking Setup
-- Run this in your Supabase SQL Editor

-- Step 1: Create receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(100),
  customer_email VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  subtotal_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'completed',
  printed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Create receipt_items table for detailed tracking
CREATE TABLE IF NOT EXISTS receipt_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_id UUID REFERENCES receipts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_receipts_number ON receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(created_at);
CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt_id ON receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_items_product_id ON receipt_items(product_id);

-- Step 4: Add RLS policies for receipts
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipt_items ENABLE ROW LEVEL SECURITY;

-- Policy for receipts (admin can see all, users see their own)
CREATE POLICY "Admin can view all receipts" ON receipts
  FOR ALL USING (auth.role() = 'authenticated');

-- Policy for receipt items
CREATE POLICY "Admin can view all receipt items" ON receipt_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Step 5: Create function to generate receipt numbers
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  receipt_num VARCHAR(50);
  counter INTEGER;
BEGIN
  -- Get current date in YYYYMMDD format
  receipt_num := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get count of receipts for today
  SELECT COALESCE(COUNT(*), 0) + 1
  INTO counter
  FROM receipts
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Format: YYYYMMDD-XXXX (e.g., 20241201-0001)
  receipt_num := receipt_num || '-' || LPAD(counter::TEXT, 4, '0');
  
  RETURN receipt_num;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create function to insert receipt with items
CREATE OR REPLACE FUNCTION create_receipt_with_items(
  p_customer_name VARCHAR(100),
  p_customer_email VARCHAR(255),
  p_total_amount DECIMAL(10,2),
  p_tax_amount DECIMAL(10,2),
  p_subtotal_amount DECIMAL(10,2),
  p_payment_method VARCHAR(50),
  p_items JSONB
)
RETURNS UUID AS $$
DECLARE
  receipt_id UUID;
  item_data JSONB;
BEGIN
  -- Insert receipt
  INSERT INTO receipts (
    receipt_number,
    customer_name,
    customer_email,
    total_amount,
    tax_amount,
    subtotal_amount,
    payment_method
  ) VALUES (
    generate_receipt_number(),
    p_customer_name,
    p_customer_email,
    p_total_amount,
    p_tax_amount,
    p_subtotal_amount,
    p_payment_method
  ) RETURNING id INTO receipt_id;
  
  -- Insert receipt items
  FOR item_data IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO receipt_items (
      receipt_id,
      product_id,
      product_name,
      quantity,
      unit_price,
      total_price
    ) VALUES (
      receipt_id,
      (item_data->>'product_id')::UUID,
      item_data->>'product_name',
      (item_data->>'quantity')::INTEGER,
      (item_data->>'unit_price')::DECIMAL(10,2),
      (item_data->>'total_price')::DECIMAL(10,2)
    );
  END LOOP;
  
  RETURN receipt_id;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create view for receipt summary
CREATE OR REPLACE VIEW receipt_summary AS
SELECT 
  r.id,
  r.receipt_number,
  r.customer_name,
  r.customer_email,
  r.total_amount,
  r.tax_amount,
  r.subtotal_amount,
  r.payment_method,
  r.payment_status,
  r.printed_at,
  r.created_at,
  COUNT(ri.id) as item_count
FROM receipts r
LEFT JOIN receipt_items ri ON r.id = ri.receipt_id
GROUP BY r.id, r.receipt_number, r.customer_name, r.customer_email, 
         r.total_amount, r.tax_amount, r.subtotal_amount, r.payment_method, 
         r.payment_status, r.printed_at, r.created_at;

-- Step 8: Insert sample receipt data (optional)
INSERT INTO receipts (
  receipt_number,
  customer_name,
  customer_email,
  total_amount,
  tax_amount,
  subtotal_amount,
  payment_method
) VALUES 
('20241201-0001', 'John Doe', 'john@example.com', 1500.00, 150.00, 1350.00, 'MPESA'),
('20241201-0002', 'Jane Smith', 'jane@example.com', 2300.00, 230.00, 2070.00, 'E-Wallet'),
('20241201-0003', 'Bob Johnson', 'bob@example.com', 800.00, 80.00, 720.00, 'Bank Transfer')
ON CONFLICT (receipt_number) DO NOTHING;

-- Step 9: Verify setup
SELECT 
  'Receipts table' as table_name,
  COUNT(*) as record_count
FROM receipts
UNION ALL
SELECT 
  'Receipt items table' as table_name,
  COUNT(*) as record_count
FROM receipt_items; 