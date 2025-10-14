import React, { useState } from 'react';

/**
 * OptimizedImage component with WebP support, lazy loading, and fade-in effect
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {boolean} priority - If true, loads eagerly instead of lazy
 * @param {string} className - Additional CSS classes
 */
export const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height,
  priority = false,
  className = '',
  style = {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if source is already WebP
  const isWebP = src.toLowerCase().endsWith('.webp');
  
  // Generate WebP source if original is JPG/PNG
  const webpSrc = isWebP ? src : src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const showWebPSource = !isWebP && /\.(jpg|jpeg|png)$/i.test(src);

  const imgStyle = {
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    ...style
  };

  if (hasError || !showWebPSource) {
    // Fallback to regular img if error or no WebP support needed
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={imgStyle}
        {...props}
      />
    );
  }

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={imgStyle}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;

