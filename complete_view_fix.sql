-- COMPLETE VIEW FIX - Run this entire script in Supabase SQL Editor

-- Drop existing views if they have SECURITY DEFINER
drop view if exists public.public_events cascade;
drop view if exists public.public_gallery cascade;

-- Create public_events view (safe, without SECURITY DEFINER)
create view public.public_events as
select 
  e.id, 
  e.title, 
  e.description, 
  e.month_year,
  e.created_at,
  e.updated_at,
  i.public_url as cover_image_url,
  i.title as cover_image_title,
  i.description as cover_image_description
from public.events e
left join public.images i on i.id = e.cover_image_id
where e.is_public = true
order by e.created_at desc;

-- Create public_gallery view (safe, without SECURITY DEFINER)
create view public.public_gallery as
select 
  id, 
  public_url as url, 
  title, 
  description, 
  created_at,
  width,
  height
from public.images
where is_public = true
order by created_at desc;

-- Grant appropriate permissions to the views
grant select on public.public_events to authenticated, anon;
grant select on public.public_gallery to authenticated, anon;

-- Test both views work
SELECT 'public_events' as view_name, COUNT(*) as count FROM public.public_events
UNION ALL
SELECT 'public_gallery' as view_name, COUNT(*) as count FROM public.public_gallery;
