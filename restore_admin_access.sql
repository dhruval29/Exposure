-- RESTORE ADMIN ACCESS
-- Run these queries to restore your admin access

-- 1. First, make sure roles exist
INSERT INTO public.roles(name)
SELECT x.name FROM (VALUES ('admin'), ('editor'), ('viewer')) AS x(name)
WHERE NOT EXISTS (SELECT 1 FROM public.roles r WHERE r.name = x.name);

-- 2. Check what roles we have now
SELECT * FROM public.roles;

-- 3. Create a user record for yourself if it doesn't exist
-- Replace 'YOUR_USER_ID_HERE' with your actual auth.users ID
-- Replace 'your-username' with your desired username
-- INSERT INTO public.users (id, username, display_name)
-- VALUES ('YOUR_USER_ID_HERE'::uuid, 'your-username', 'Admin User')
-- ON CONFLICT (id) DO UPDATE SET
--   username = EXCLUDED.username,
--   display_name = EXCLUDED.display_name;

-- 4. Assign admin role to yourself
-- Replace 'YOUR_USER_ID_HERE' with your actual auth.users ID
-- INSERT INTO public.user_roles (user_id, role_id)
-- SELECT 'YOUR_USER_ID_HERE'::uuid, r.id
-- FROM public.roles r
-- WHERE r.name = 'admin'
-- ON CONFLICT (user_id, role_id) DO NOTHING;

-- 5. Test the admin function
-- Replace 'YOUR_USER_ID_HERE' with your actual auth.users ID
-- SELECT public.is_admin('YOUR_USER_ID_HERE'::uuid) as is_admin_result;

-- 6. Alternative: Make the FIRST user in auth.users an admin automatically
-- (Only run this if you're the only user or the first user should be admin)
-- INSERT INTO public.users (id, username, display_name)
-- SELECT au.id, SPLIT_PART(au.email, '@', 1), 'Admin User'
-- FROM auth.users au
-- ORDER BY au.created_at ASC
-- LIMIT 1
-- ON CONFLICT (id) DO UPDATE SET
--   username = EXCLUDED.username,
--   display_name = EXCLUDED.display_name;

-- INSERT INTO public.user_roles (user_id, role_id)
-- SELECT au.id, r.id
-- FROM auth.users au
-- CROSS JOIN public.roles r
-- WHERE r.name = 'admin'
-- ORDER BY au.created_at ASC
-- LIMIT 1
-- ON CONFLICT (user_id, role_id) DO NOTHING;
