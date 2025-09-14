-- Diagnostic SQL to check your images data
-- Run this in Supabase SQL Editor to see what's happening with your images

-- 1. Check how many images are in the database
SELECT 
  COUNT(*) as total_images,
  COUNT(CASE WHEN is_public = true THEN 1 END) as public_images,
  COUNT(CASE WHEN is_public = false THEN 1 END) as private_images
FROM public.images;

-- 2. Show all images with their details
SELECT 
  id,
  title,
  storage_path,
  public_url,
  is_public,
  uploaded_by,
  created_at
FROM public.images 
ORDER BY created_at DESC
LIMIT 20;

-- 3. Check the public_gallery view
SELECT * FROM public.public_gallery LIMIT 10;

-- 4. Check if there are any RLS policy issues by testing direct access
SELECT 
  id, 
  title, 
  public_url,
  is_public
FROM public.images 
WHERE is_public = true 
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Check storage bucket objects (if accessible)
-- Note: This might not work depending on permissions
SELECT 
  name,
  bucket_id,
  created_at
FROM storage.objects 
WHERE bucket_id = 'images' 
ORDER BY created_at DESC 
LIMIT 10;
