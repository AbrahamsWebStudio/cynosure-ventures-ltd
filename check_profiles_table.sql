-- Check Profiles Table Structure
-- Run this in your Supabase SQL Editor

-- 1. Check if profiles table exists
SELECT '=== PROFILES TABLE EXISTENCE ===' as section;
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ DOES NOT EXIST'
  END as status
FROM information_schema.tables 
WHERE table_name = 'profiles' 
AND table_schema = 'public';

-- 2. If profiles table exists, check its structure
SELECT '=== PROFILES TABLE STRUCTURE ===' as section;
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check if products table exists
SELECT '=== PRODUCTS TABLE EXISTENCE ===' as section;
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ DOES NOT EXIST'
  END as status
FROM information_schema.tables 
WHERE table_name = 'products' 
AND table_schema = 'public';

-- 4. If products table exists, check its structure
SELECT '=== PRODUCTS TABLE STRUCTURE ===' as section;
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position; 