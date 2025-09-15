-- COPY AND PASTE THIS ENTIRE SCRIPT INTO SUPABASE SQL EDITOR

-- Step 1: Create user record for your email login
INSERT INTO public.users (id, username, display_name)
SELECT au.id, 'dhruvalvashi29', 'Dhruv Alvashi'
FROM auth.users au
WHERE au.email = 'dhruvalvashi29@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  display_name = EXCLUDED.display_name;

-- Step 2: Give admin role to your email login
INSERT INTO public.user_roles (user_id, role_id)
SELECT au.id, r.id
FROM auth.users au
CROSS JOIN public.roles r
WHERE au.email = 'dhruvalvashi29@gmail.com' AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Step 3: Test that it worked
SELECT 
  au.email,
  au.id,
  public.is_admin(au.id) as is_admin_now
FROM auth.users au
WHERE au.email = 'dhruvalvashi29@gmail.com';
