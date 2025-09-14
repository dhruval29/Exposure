-- DIAGNOSTIC QUERIES FOR IMAGE ISSUE
-- Copy and paste these queries one by one into your Supabase SQL Editor

-- QUERY 1: Check how many images you have
SELECT 
  COUNT(*) as total_images,
  COUNT(CASE WHEN is_public = true THEN 1 END) as public_images,
  COUNT(CASE WHEN is_public = false THEN 1 END) as private_images
FROM public.images;

-- QUERY 2: Show your recent images
SELECT 
  id,
  title,
  storage_path,
  public_url,
  is_public,
  created_at
FROM public.images 
ORDER BY created_at DESC
LIMIT 10;

-- QUERY 3: Check events and their cover images
SELECT 
  e.id,
  e.title,
  e.month_year,
  e.cover_image_id,
  i.public_url as cover_image_url,
  i.title as cover_image_title,
  CASE 
    WHEN e.cover_image_id IS NULL THEN 'No cover image assigned'
    WHEN i.id IS NULL THEN 'Cover image ID exists but image not found'
    WHEN i.public_url IS NULL OR i.public_url = '' THEN 'Image exists but no public URL'
    ELSE 'Image should be working'
  END as status
FROM public.events e
LEFT JOIN public.images i ON i.id = e.cover_image_id
WHERE e.is_public = true
ORDER BY e.created_at DESC;

-- QUERY 4: Count events by status
SELECT 
  CASE 
    WHEN e.cover_image_id IS NULL THEN 'No cover image assigned'
    WHEN i.id IS NULL THEN 'Cover image ID exists but image not found'
    WHEN i.public_url IS NULL OR i.public_url = '' THEN 'Image exists but no public URL'
    ELSE 'Image should be working'
  END as status,
  COUNT(*) as count
FROM public.events e
LEFT JOIN public.images i ON i.id = e.cover_image_id
WHERE e.is_public = true
GROUP BY 1
ORDER BY count DESC;
