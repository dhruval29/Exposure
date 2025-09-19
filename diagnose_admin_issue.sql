-- DIAGNOSTIC SCRIPT FOR is_admin 500 ERROR

-- 1. Check if the is_admin function exists and is accessible
SELECT 
  'Function Check:' as info,
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines 
WHERE routine_name = 'is_admin' 
  AND routine_schema = 'public';

-- 2. Check if all required tables exist
SELECT 
  'Table Check:' as info,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'roles', 'user_roles')
ORDER BY table_name;

-- 3. Check roles data
SELECT 'Roles Data:' as info, * FROM public.roles ORDER BY id;

-- 4. Check users data
SELECT 'Users Data:' as info, id, username, display_name, created_at FROM public.users ORDER BY created_at DESC LIMIT 5;

-- 5. Check user_roles data
SELECT 
  'User Roles Data:' as info,
  ur.user_id,
  u.username,
  r.name as role_name,
  ur.created_at
FROM public.user_roles ur
JOIN public.users u ON u.id = ur.user_id
JOIN public.roles r ON r.id = ur.role_id
ORDER BY ur.created_at DESC;

-- 6. Check auth users (if accessible)
SELECT 'Auth Users:' as info, id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- 7. Test is_admin function with a specific user ID
-- Replace 'USER_ID_HERE' with an actual user ID from auth.users
-- SELECT 'Function Test:' as info, public.is_admin('USER_ID_HERE'::uuid) as result;

-- 8. Check function permissions
SELECT 
  'Function Permissions:' as info,
  routine_name,
  grantee,
  privilege_type
FROM information_schema.routine_privileges 
WHERE routine_name = 'is_admin' 
  AND routine_schema = 'public';
