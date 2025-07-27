-- Check if orders table exists
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN 'EXISTS'
    ELSE 'DOES NOT EXIST'
  END as status
FROM information_schema.tables 
WHERE table_name = 'orders' 
AND table_schema = 'public';

-- Check table structure if it exists
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position; 