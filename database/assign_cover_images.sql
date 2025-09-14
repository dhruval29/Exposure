-- SOLUTION: Assign cover images to your events
-- Run these queries to fix the placeholder image issue

-- STEP 1: See what images you have available
SELECT 
  id,
  title,
  public_url,
  created_at
FROM public.images 
WHERE is_public = true
ORDER BY created_at DESC;

-- STEP 2: See your events that need cover images
SELECT 
  id,
  title,
  month_year,
  created_at
FROM public.events 
WHERE is_public = true 
  AND cover_image_id IS NULL
ORDER BY created_at DESC;

-- STEP 3: Example of how to assign a cover image to an event
-- Replace 'EVENT_ID_HERE' with actual event ID
-- Replace 'IMAGE_ID_HERE' with actual image ID
-- UPDATE public.events 
-- SET cover_image_id = 'IMAGE_ID_HERE'
-- WHERE id = 'EVENT_ID_HERE';

-- STEP 4: If you want to assign the first available image to all events without covers:
-- (CAREFUL - this assigns the same image to ALL events)
-- UPDATE public.events 
-- SET cover_image_id = (
--   SELECT id FROM public.images 
--   WHERE is_public = true 
--   ORDER BY created_at DESC 
--   LIMIT 1
-- )
-- WHERE cover_image_id IS NULL AND is_public = true;
