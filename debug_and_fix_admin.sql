-- COMPREHENSIVE ADMIN FIX - Run this step by step

-- Step 1: Check what auth users exist
SELECT 'Auth Users:' as info, id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- Step 2: Check what's in user_roles now
SELECT 'Current User Roles:' as info, ur.user_id, u.username, r.name as role_name
FROM public.user_roles ur
JOIN public.users u ON u.id = ur.user_id
JOIN public.roles r ON r.id = ur.role_id;

-- Step 3: Force create the admin role if missing
INSERT INTO public.roles(name) VALUES ('admin') ON CONFLICT (name) DO NOTHING;

-- Step 4: Get your actual auth user ID and create user record
-- This creates a record for EVERY auth user (in case email doesn't match exactly)
INSERT INTO public.users (id, username, display_name)
SELECT au.id, COALESCE(SPLIT_PART(au.email, '@', 1), au.id::text), COALESCE(au.email, 'User')
FROM auth.users au
WHERE au.email ILIKE '%dhruv%' OR au.email ILIKE '%alvashi%'
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  display_name = EXCLUDED.display_name;

-- Step 5: Give admin role to any user with dhruv in email
INSERT INTO public.user_roles (user_id, role_id)
SELECT au.id, r.id
FROM auth.users au
CROSS JOIN public.roles r
WHERE (au.email ILIKE '%dhruv%' OR au.email ILIKE '%alvashi%') AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Step 6: Test the is_admin function for all users
SELECT 
  'Test Results:' as info,
  au.email,
  au.id,
  public.is_admin(au.id) as is_admin_result
FROM auth.users au
ORDER BY au.created_at DESC;

-- Step 7: Also test the RPC function directly
SELECT 'RPC Test:' as info, public.is_admin(au.id) as rpc_result, au.email
FROM auth.users au
WHERE au.email ILIKE '%dhruv%';
