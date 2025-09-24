-- EXIF columns for images
alter table if exists public.images
  add column if not exists exif_json jsonb,
  add column if not exists camera_make text,
  add column if not exists camera_model text,
  add column if not exists lens_model text,
  add column if not exists focal_length_mm numeric,
  add column if not exists aperture_fnumber numeric,
  add column if not exists shutter_speed text,
  add column if not exists iso int,
  add column if not exists taken_at timestamptz;

-- Extend public_gallery view with EXIF (drop/create)
drop view if exists public.public_gallery cascade;
create view public.public_gallery as
select 
  id,
  public_url as url,
  title,
  description,
  created_at,
  width,
  height,
  exif_json,
  camera_make,
  camera_model,
  lens_model,
  focal_length_mm,
  aperture_fnumber,
  shutter_speed,
  iso,
  taken_at
from public.images
where is_public = true
order by created_at desc;

grant select on public.public_gallery to authenticated, anon;
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
