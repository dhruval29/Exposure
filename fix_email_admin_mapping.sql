-- FIX EMAIL-BASED ADMIN ACCESS
-- This ensures your email login gets proper admin access

-- Step 1: Check what auth user ID is created for your email
SELECT 
  'Auth User for Email:' as info,
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'dhruvalvashi29@gmail.com'
ORDER BY created_at DESC;

-- Step 2: Check what user record exists for that auth ID
SELECT 
  'Public User Record:' as info,
  u.id,
  u.username,
  u.display_name,
  u.created_at
FROM public.users u
WHERE u.id IN (
  SELECT id FROM auth.users WHERE email = 'dhruvalvashi29@gmail.com'
);

-- Step 3: Create/update user record for your email-based auth user
INSERT INTO public.users (id, username, display_name)
SELECT 
  au.id,
  'dhruvalvashi29',
  'dhruvalvashi29@gmail.com'
FROM auth.users au
WHERE au.email = 'dhruvalvashi29@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  username = 'dhruvalvashi29',
  display_name = 'dhruvalvashi29@gmail.com';

-- Step 4: Ensure admin role is assigned to your email-based auth user
INSERT INTO public.user_roles (user_id, role_id)
SELECT 
  au.id,
  r.id
FROM auth.users au
CROSS JOIN public.roles r
WHERE au.email = 'dhruvalvashi29@gmail.com' 
  AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Step 5: Test the is_admin function with your actual auth user ID
SELECT 
  'Test is_admin for email user:' as info,
  au.email,
  au.id,
  public.is_admin(au.id) as is_admin_result
FROM auth.users au
WHERE au.email = 'dhruvalvashi29@gmail.com';

-- Step 6: Show all your user records and roles
SELECT 
  'All User Records:' as info,
  u.username,
  u.display_name,
  r.name as role_name,
  ur.created_at
FROM public.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.roles r ON r.id = ur.role_id
WHERE u.username = 'dhruvalvashi29' OR u.display_name ILIKE '%dhruv%'
ORDER BY ur.created_at DESC;
