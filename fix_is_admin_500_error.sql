-- COMPREHENSIVE FIX FOR is_admin RPC 500 ERROR
-- Run this in Supabase SQL Editor to fix the admin access issue

-- Step 1: Ensure all required tables and functions exist
-- (This is idempotent - safe to run multiple times)

-- Create roles table and insert default roles
CREATE TABLE IF NOT EXISTS public.roles (
  id serial primary key,
  name text unique not null
);

CREATE TABLE IF NOT EXISTS public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid not null references public.users(id) on delete cascade,
  role_id int not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

-- Insert default roles
INSERT INTO public.roles(name)
SELECT x.name FROM (VALUES ('admin'), ('editor'), ('viewer')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.roles r WHERE r.name = x.name);

-- Step 2: Recreate the is_admin function with better error handling
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean 
LANGUAGE sql 
STABLE 
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = uid AND r.name = 'admin'
    ),
    false
  );
$$;

-- Step 3: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, anon;

-- Step 4: Create user records for all existing auth users
INSERT INTO public.users (id, username, display_name)
SELECT 
  au.id, 
  COALESCE(SPLIT_PART(au.email, '@', 1), au.id::text) as username,
  COALESCE(au.email, 'User') as display_name
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = au.id)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  display_name = EXCLUDED.username;

-- Step 5: Give admin role to users with specific email patterns
-- Adjust the email patterns as needed for your admin users
INSERT INTO public.user_roles (user_id, role_id)
SELECT au.id, r.id
FROM auth.users au
CROSS JOIN public.roles r
WHERE (au.email ILIKE '%dhruv%' OR au.email ILIKE '%alvashi%' OR au.email ILIKE '%admin%')
  AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Step 6: If no users match the patterns above, make the first user an admin
-- (Only run this if you want the first user to be admin)
INSERT INTO public.user_roles (user_id, role_id)
SELECT au.id, r.id
FROM auth.users au
CROSS JOIN public.roles r
WHERE r.name = 'admin'
  AND NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.role_id = r.id)
ORDER BY au.created_at ASC
LIMIT 1
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Step 7: Test the function
SELECT 
  'Test Results:' as info,
  au.email,
  au.id,
  public.is_admin(au.id) as is_admin_result
FROM auth.users au
ORDER BY au.created_at DESC;

-- Step 8: Test RPC call (this should work now)
SELECT 'RPC Test:' as info, public.is_admin(au.id) as rpc_result, au.email
FROM auth.users au
WHERE au.email ILIKE '%dhruv%' OR au.email ILIKE '%alvashi%'
LIMIT 1;

-- Step 9: Show current user roles for debugging
SELECT 
  'Current User Roles:' as info,
  u.username,
  u.display_name,
  r.name as role_name,
  ur.created_at
FROM public.user_roles ur
JOIN public.users u ON u.id = ur.user_id
JOIN public.roles r ON r.id = ur.role_id
ORDER BY ur.created_at DESC;
