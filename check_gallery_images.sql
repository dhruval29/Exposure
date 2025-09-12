-- CHECK GALLERY IMAGES ISSUE
-- Run these queries to see what's wrong with your /pictures gallery

-- QUERY 1: Check if public_gallery view is working
SELECT * FROM public.public_gallery LIMIT 10;

-- QUERY 2: Check if you have public images in the database
SELECT 
  id,
  title,
  public_url,
  is_public,
  created_at
FROM public.images 
WHERE is_public = true
ORDER BY created_at DESC 
LIMIT 10;

-- QUERY 3: Compare direct table vs view results
SELECT 'Direct Table' as source, COUNT(*) as count FROM public.images WHERE is_public = true
UNION ALL
SELECT 'Public Gallery View' as source, COUNT(*) as count FROM public.public_gallery;

-- QUERY 4: Check for any broken public_urls
SELECT 
  id,
  title,
  public_url,
  CASE 
    WHEN public_url IS NULL THEN 'No URL'
    WHEN public_url = '' THEN 'Empty URL'
    WHEN public_url LIKE 'http%' THEN 'Valid URL format'
    ELSE 'Invalid URL format'
  END as url_status
FROM public.images 
WHERE is_public = true
ORDER BY created_at DESC 
LIMIT 10;
