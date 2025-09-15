-- FIX ADMIN LOGIN ISSUE
-- Your email login creates a different user ID than what's in user_roles

-- 1. First, let's see all auth users to find your actual login ID
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- 2. Check what user ID is created when you login with dhruvalvashi29@gmail.com
-- (This will show after you run query 1)

-- 3. Once you find your actual user ID from auth.users, run this:
-- Replace 'YOUR_ACTUAL_AUTH_USER_ID' with the ID from auth.users for dhruvalvashi29@gmail.com

-- Create/update your user record in public.users
-- INSERT INTO public.users (id, username, display_name)
-- VALUES ('YOUR_ACTUAL_AUTH_USER_ID'::uuid, 'dhruvalvashi29', 'Dhruv Alvashi')
-- ON CONFLICT (id) DO UPDATE SET
--   username = EXCLUDED.username,
--   display_name = EXCLUDED.display_name;

-- 4. Give this user admin role
-- INSERT INTO public.user_roles (user_id, role_id)
-- SELECT 'YOUR_ACTUAL_AUTH_USER_ID'::uuid, r.id
-- FROM public.roles r
-- WHERE r.name = 'admin'
-- ON CONFLICT (user_id, role_id) DO NOTHING;

-- 5. Test the admin function with your actual user ID
-- SELECT public.is_admin('YOUR_ACTUAL_AUTH_USER_ID'::uuid) as should_be_true;

-- ALTERNATIVE AUTOMATIC FIX:
-- This automatically gives admin access to the user with email dhruvalvashi29@gmail.com

-- Step A: Create user record for the email-based login
INSERT INTO public.users (id, username, display_name)
SELECT au.id, 'dhruvalvashi29', 'Dhruv Alvashi'
FROM auth.users au
WHERE au.email = 'dhruvalvashi29@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  display_name = EXCLUDED.display_name;

-- Step B: Give admin role to the email-based login
INSERT INTO public.user_roles (user_id, role_id)
SELECT au.id, r.id
FROM auth.users au
CROSS JOIN public.roles r
WHERE au.email = 'dhruvalvashi29@gmail.com' AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Step C: Verify it worked
SELECT 
  au.email,
  au.id,
  public.is_admin(au.id) as is_admin
FROM auth.users au
WHERE au.email = 'dhruvalvashi29@gmail.com';
