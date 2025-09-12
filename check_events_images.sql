-- Check events and their cover images relationship
-- Run this to see why events are showing placeholder images

-- 1. Check all events and their cover image status
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

-- 2. Count events by cover image status
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
