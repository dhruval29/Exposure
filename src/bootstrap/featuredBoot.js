import { supabase } from '../lib/supabaseClient'

// Kick off an early request to discover the first featured image.
// Expose minimal data on window for initial render and inject a preload tag.
(async () => {
  try {
    const { data, error } = await supabase
      .from('featured_gallery')
      .select('*')
      .range(0, 0);

    if (error || !Array.isArray(data) || data.length === 0) return;

    const first = data[0];
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    const getTransformedUrl = (url, width, quality = 70, format = 'webp') => {
      try {
        if (!url) return url;
        if (supabaseUrl && String(url).startsWith(supabaseUrl)) {
          const u = new URL(url);
          u.searchParams.set('width', String(width));
          u.searchParams.set('quality', String(quality));
          u.searchParams.set('format', format);
          return u.toString();
        }
        return url;
      } catch {
        return url;
      }
    };

    const bootItem = {
      src: first.url,
      thumb: first.thumbnail_url ? first.thumbnail_url : getTransformedUrl(first.url, 400),
      title: first.title || 'Image 1',
      camera_make: first.camera_make,
      camera_model: first.camera_model,
      lens_model: first.lens_model,
      focal_length_mm: first.focal_length_mm,
      aperture_fnumber: first.aperture_fnumber,
      shutter_speed: first.shutter_speed,
      iso: first.iso
    };

    // Seed a global for the app to pick up synchronously
    window.__BOOTSTRAP_FEATURED__ = bootItem;

    // Preload the LCP candidate image with high priority
    const preloadHref = bootItem.thumb || bootItem.src;
    if (preloadHref) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = preloadHref;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  } catch (_) {
    // ignore
  }
})();


