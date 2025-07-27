-- Debug Orders Table Permissions
-- Run this in your Supabase SQL Editor

-- 1. Check if orders table exists and its structure
SELECT 
  'Table Status' as check_type,
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN 'EXISTS'
    ELSE 'DOES NOT EXIST'
  END as status
FROM information_schema.tables 
WHERE table_name = 'orders' 
AND table_schema = 'public'

UNION ALL

-- 2. Check RLS status
SELECT 
  'RLS Status' as check_type,
  schemaname || '.' || tablename as table_name,
  CASE 
    WHEN rowsecurity THEN 'ENABLED'
    ELSE 'DISABLED'
  END as status
FROM pg_tables 
WHERE tablename = 'orders'

UNION ALL

-- 3. Check existing policies
SELECT 
  'Policy' as check_type,
  policyname as table_name,
  'EXISTS' as status
FROM pg_policies 
WHERE tablename = 'orders'

UNION ALL

-- 4. Check if current user can access the table
SELECT 
  'Current User Access' as check_type,
  current_user as table_name,
  'LOGGED IN' as status; 