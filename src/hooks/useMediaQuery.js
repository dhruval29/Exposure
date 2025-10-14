import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive media queries
 * @param {string} query - Media query string (e.g., '(max-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    
    // Use modern addEventListener if available
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, [query]);

  return matches;
};

export default useMediaQuery;

