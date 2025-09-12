-- FIX: Create the missing public_gallery view
-- Run this in your Supabase SQL Editor to restore your gallery

-- Create the public_gallery view (without SECURITY DEFINER)
CREATE VIEW public.public_gallery AS
SELECT 
  id, 
  public_url as url, 
  title, 
  description, 
  created_at,
  width,
  height
FROM public.images
WHERE is_public = true
ORDER BY created_at DESC;

-- Grant permissions to the view
GRANT SELECT ON public.public_gallery TO authenticated, anon;

-- Test the view works
SELECT COUNT(*) as total_images FROM public.public_gallery;

-- Show first 5 images from the view
SELECT * FROM public.public_gallery LIMIT 5;
