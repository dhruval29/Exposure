-- DIAGNOSTIC: Check Admin Access Issue
-- Run these queries in Supabase SQL Editor to diagnose the admin problem

-- 1. Check if roles exist
SELECT * FROM public.roles;

-- 2. Check if you have any users in the system
SELECT id, username, display_name, created_at FROM public.users LIMIT 10;

-- 3. Check user_roles assignments
SELECT 
  ur.user_id,
  u.username,
  u.display_name,
  r.name as role_name,
  ur.created_at
FROM public.user_roles ur
JOIN public.users u ON u.id = ur.user_id
JOIN public.roles r ON r.id = ur.role_id
ORDER BY ur.created_at DESC;

-- 4. Test the is_admin function with your current user ID
-- Replace 'YOUR_USER_ID_HERE' with your actual auth.users ID
-- SELECT public.is_admin('YOUR_USER_ID_HERE'::uuid);

-- 5. Check your current auth user (if you're logged in)
-- This might not work in SQL editor, but you can try
-- SELECT auth.uid(), auth.email();

-- 6. Show all auth users (if accessible)
-- SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;
