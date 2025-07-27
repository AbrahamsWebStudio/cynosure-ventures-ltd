-- Comprehensive Debug Script for Orders Table
-- Run this in your Supabase SQL Editor

-- 1. Check if orders table exists
SELECT '=== TABLE EXISTENCE CHECK ===' as section;
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ DOES NOT EXIST'
  END as status
FROM information_schema.tables 
WHERE table_name = 'orders' 
AND table_schema = 'public';

-- 2. Check table structure
SELECT '=== TABLE STRUCTURE ===' as section;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT '=== RLS STATUS ===' as section;
SELECT 
  schemaname || '.' || tablename as table_name,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as rls_status
FROM pg_tables 
WHERE tablename = 'orders';

-- 4. Check existing policies
SELECT '=== EXISTING POLICIES ===' as section;
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'orders';

-- 5. Check current user
SELECT '=== CURRENT USER ===' as section;
SELECT 
  current_user as username,
  current_database() as database_name,
  current_schema() as schema_name;

-- 6. Test basic access (this might fail, but will show the error)
SELECT '=== BASIC ACCESS TEST ===' as section;
BEGIN;
  SELECT COUNT(*) as record_count FROM orders LIMIT 1;
ROLLBACK;

-- 7. Check if there are any records
SELECT '=== RECORD COUNT ===' as section;
SELECT COUNT(*) as total_records FROM orders; 