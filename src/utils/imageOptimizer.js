/**
 * Image optimization utilities for better performance
 */

// Image loading with lazy loading and error handling
export const loadImageOptimized = (src, options = {}) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Set loading attributes for better performance
    img.loading = 'lazy';
    img.decoding = 'async';
    
    // Handle successful load
    img.onload = () => {
      resolve({
        src: img.src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
    };
    
    // Handle load error with fallback
    img.onerror = () => {
      if (options.fallback) {
        resolve(options.fallback);
      } else {
        reject(new Error(`Failed to load image: ${src}`));
      }
    };
    
    // Start loading
    img.src = src;
  });
};

// Batch image loading with concurrency control
export const loadImagesBatch = async (imageSources, options = {}) => {
  const { concurrency = 3, fallback } = options;
  const results = [];
  
  for (let i = 0; i < imageSources.length; i += concurrency) {
    const batch = imageSources.slice(i, i + concurrency);
    const batchPromises = batch.map(src => 
      loadImageOptimized(src, { fallback }).catch(() => fallback || null)
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter(Boolean));
  }
  
  return results;
};

// Create optimized image URLs with WebP support
export const getOptimizedImageUrl = (src, options = {}) => {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // For now, return original src - in production you'd use a CDN service
  return src;
};

// Preload critical images
export const preloadCriticalImages = (imageSources) => {
  imageSources.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Generate placeholder for images
export const generatePlaceholder = (width, height, color = '#f0f0f0') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  return canvas.toDataURL();
};
