-- TEST is_admin FUNCTION WITH YOUR ACTUAL AUTH USER ID
-- This will help identify if the function works with your login

-- Step 1: Get your current auth user ID (if you're logged in)
SELECT 
  'Current Auth User:' as info,
  auth.uid() as current_user_id,
  auth.email() as current_email;

-- Step 2: Test is_admin with your current auth user ID
SELECT 
  'Test is_admin with current user:' as info,
  public.is_admin(auth.uid()) as is_admin_result;

-- Step 3: Test is_admin with the user ID from your public.users record
SELECT 
  'Test is_admin with public.users ID:' as info,
  public.is_admin(u.id) as is_admin_result,
  u.username,
  u.display_name
FROM public.users u
WHERE u.username = 'dhruvalvashi29';

-- Step 4: Show all auth users to see if there are multiple IDs
SELECT 
  'All Auth Users:' as info,
  id,
  email,
  created_at
FROM auth.users
WHERE email ILIKE '%dhruv%' OR email ILIKE '%alvashi%'
ORDER BY created_at DESC;

-- Step 5: Test is_admin with each auth user ID
SELECT 
  'Test is_admin for each auth user:' as info,
  au.email,
  au.id,
  public.is_admin(au.id) as is_admin_result
FROM auth.users au
WHERE au.email ILIKE '%dhruv%' OR au.email ILIKE '%alvashi%'
ORDER BY au.created_at DESC;
