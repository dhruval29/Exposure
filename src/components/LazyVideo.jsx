import React, { useRef, useEffect, useState } from 'react';

/**
 * LazyVideo component that loads video only when it's near the viewport
 * @param {string} src - Video source URL
 * @param {string} poster - Poster image URL
 * @param {string} className - CSS classes
 * @param {object} props - Additional video props
 */
export const LazyVideo = ({ src, poster, className = '', preload = 'none', ...props }) => {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '200px', // Start loading 200px before visible
        threshold: 0.01
      }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      preload={isInView ? 'metadata' : preload}
      {...props}
    >
      {isInView && src && <source src={src} type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
};

export default LazyVideo;

