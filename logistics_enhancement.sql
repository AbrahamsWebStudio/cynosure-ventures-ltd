-- Logistics Enhancement for CYNOSURE VENTURES LTD
-- This script adds weight classes, taxes, and fragile handling to the logistics system

-- Step 1: Create weight classes table
CREATE TABLE IF NOT EXISTS weight_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  min_weight DECIMAL(10,2) NOT NULL,
  max_weight DECIMAL(10,2) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  price_per_km DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 16.0, -- VAT rate in Kenya
  fragile_surcharge DECIMAL(10,2) NOT NULL DEFAULT 0.0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Add logistics-related columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_fragile BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_class_id UUID REFERENCES weight_classes(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions_cm VARCHAR(50); -- Format: "LxWxH"
ALTER TABLE products ADD COLUMN IF NOT EXISTS special_handling_notes TEXT;

-- Step 3: Create logistics_orders table for delivery tracking
CREATE TABLE IF NOT EXISTS logistics_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  distance_km DECIMAL(10,2) NOT NULL,
  weight_class_id UUID REFERENCES weight_classes(id),
  total_weight_kg DECIMAL(10,2) NOT NULL,
  subtotal_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.0,
  fragile_surcharge DECIMAL(10,2) NOT NULL DEFAULT 0.0,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(20),
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  tracking_number VARCHAR(50) UNIQUE,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create logistics_order_items table for detailed tracking
CREATE TABLE IF NOT EXISTS logistics_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  logistics_order_id UUID REFERENCES logistics_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  weight_kg DECIMAL(10,2) NOT NULL,
  is_fragile BOOLEAN DEFAULT FALSE,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Insert default weight classes
INSERT INTO weight_classes (name, min_weight, max_weight, base_price, price_per_km, tax_rate, fragile_surcharge, description) VALUES
('Light', 0.0, 5.0, 200.0, 15.0, 16.0, 50.0, 'Small packages and documents'),
('Medium', 5.1, 20.0, 350.0, 25.0, 16.0, 75.0, 'Standard packages and boxes'),
('Heavy', 20.1, 50.0, 500.0, 35.0, 16.0, 100.0, 'Large items and equipment'),
('Oversized', 50.1, 100.0, 800.0, 50.0, 16.0, 150.0, 'Furniture and large equipment'),
('Freight', 100.1, 999.0, 1200.0, 75.0, 16.0, 200.0, 'Industrial and commercial freight');

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_logistics_orders_user_id ON logistics_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_logistics_orders_status ON logistics_orders(status);
CREATE INDEX IF NOT EXISTS idx_logistics_orders_tracking ON logistics_orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_logistics_order_items_order_id ON logistics_order_items(logistics_order_id);
CREATE INDEX IF NOT EXISTS idx_products_weight_class ON products(weight_class_id);
CREATE INDEX IF NOT EXISTS idx_products_fragile ON products(is_fragile);

-- Step 7: Enable RLS on new tables
ALTER TABLE weight_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_order_items ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies
-- Weight classes are public (read-only)
CREATE POLICY "Weight classes are viewable by all" ON weight_classes
  FOR SELECT USING (true);

-- Users can view their own logistics orders
CREATE POLICY "Users can view own logistics orders" ON logistics_orders
  FOR ALL USING (auth.uid() = user_id);

-- Users can view their own logistics order items
CREATE POLICY "Users can view own logistics order items" ON logistics_order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM logistics_orders 
      WHERE logistics_orders.id = logistics_order_items.logistics_order_id 
      AND logistics_orders.user_id = auth.uid()
    )
  );

-- Step 9: Create function to calculate logistics pricing
CREATE OR REPLACE FUNCTION calculate_logistics_price(
  p_distance_km DECIMAL,
  p_weight_kg DECIMAL,
  p_has_fragile_items BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
  weight_class_name VARCHAR(50),
  base_price DECIMAL(10,2),
  distance_cost DECIMAL(10,2),
  subtotal DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  fragile_surcharge DECIMAL(10,2),
  total_amount DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_weight_class weight_classes%ROWTYPE;
BEGIN
  -- Find the appropriate weight class
  SELECT * INTO v_weight_class
  FROM weight_classes
  WHERE p_weight_kg >= min_weight AND p_weight_kg <= max_weight
  LIMIT 1;

  IF v_weight_class IS NULL THEN
    RAISE EXCEPTION 'Weight %.2f kg does not fall within any defined weight class', p_weight_kg;
  END IF;

  -- Calculate costs
  RETURN QUERY
  SELECT 
    v_weight_class.name,
    v_weight_class.base_price,
    (p_distance_km * v_weight_class.price_per_km)::DECIMAL(10,2),
    (v_weight_class.base_price + (p_distance_km * v_weight_class.price_per_km))::DECIMAL(10,2),
    ((v_weight_class.base_price + (p_distance_km * v_weight_class.price_per_km)) * v_weight_class.tax_rate / 100)::DECIMAL(10,2),
    CASE WHEN p_has_fragile_items THEN v_weight_class.fragile_surcharge ELSE 0 END,
    (v_weight_class.base_price + (p_distance_km * v_weight_class.price_per_km) + 
     ((v_weight_class.base_price + (p_distance_km * v_weight_class.price_per_km)) * v_weight_class.tax_rate / 100) +
     CASE WHEN p_has_fragile_items THEN v_weight_class.fragile_surcharge ELSE 0 END)::DECIMAL(10,2);
END;
$$;

-- Step 10: Create function to generate tracking numbers
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS VARCHAR(50)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'CVL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
         LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$;

-- Step 11: Create function to process logistics payment
CREATE OR REPLACE FUNCTION process_logistics_payment(
  p_user_id UUID,
  p_logistics_order_id UUID,
  p_payment_method VARCHAR(20)
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update logistics order status
  UPDATE logistics_orders
  SET 
    status = 'confirmed',
    payment_method = p_payment_method,
    updated_at = NOW()
  WHERE id = p_logistics_order_id AND user_id = p_user_id;

  -- Insert transaction record
  INSERT INTO transactions (
    user_id,
    type,
    amount,
    status,
    reference
  ) VALUES (
    p_user_id,
    'logistics_payment',
    (SELECT total_amount FROM logistics_orders WHERE id = p_logistics_order_id),
    'completed',
    'logistics_payment_' || gen_random_uuid()
  );
END;
$$;

-- Step 12: Update existing products with sample weight data
UPDATE products 
SET 
  weight_kg = CASE 
    WHEN category = 'Electronics' THEN 2.5
    WHEN category = 'Clothing' THEN 0.5
    WHEN category = 'Books' THEN 1.0
    WHEN category = 'Food' THEN 3.0
    ELSE 1.5
  END,
  is_fragile = CASE 
    WHEN category = 'Electronics' THEN TRUE
    WHEN title ILIKE '%glass%' OR title ILIKE '%ceramic%' THEN TRUE
    ELSE FALSE
  END,
  weight_class_id = (
    SELECT id FROM weight_classes 
    WHERE weight_kg >= min_weight AND weight_kg <= max_weight
    LIMIT 1
  )
WHERE weight_kg IS NULL;

-- Step 13: Verify the setup
SELECT '=== WEIGHT CLASSES ===' as section;
SELECT name, min_weight, max_weight, base_price, price_per_km, tax_rate, fragile_surcharge 
FROM weight_classes ORDER BY min_weight;

SELECT '=== SAMPLE PRODUCTS WITH WEIGHT ===' as section;
SELECT title, category, weight_kg, is_fragile, 
       (SELECT name FROM weight_classes WHERE id = products.weight_class_id) as weight_class
FROM products 
WHERE weight_kg IS NOT NULL 
LIMIT 5; 