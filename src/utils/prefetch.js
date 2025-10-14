/**
 * Route prefetching utility
 * Preloads route components before navigation for faster transitions
 */

// Map routes to their lazy component loaders
const routeMap = {
  '/': () => import('../components/Landing'),
  '/gallery': () => import('../components/Featured'),
  '/pictures': () => import('../components/FeaturedMobile'),
  '/about-us': () => import('../components/AboutUs'),
  '/about-us-mobile': () => import('../components/AboutUsMobile'),
  '/the-team': () => import('../components/TheTeamPage'),
  '/the-team-mobile': () => import('../components/the-team-mobile'),
  '/contact': () => import('../components/ContactUs'),
  '/contact-mobile': () => import('../components/ContactUsMobile'),
  '/admin': () => import('../components/Admin'),
  '/events': () => import('../components/Events'),
  '/fly': () => import('../components/Fly'),
};

// Track which routes have been prefetched
const prefetchedRoutes = new Set();

/**
 * Prefetch a route's component
 * @param {string} routePath - The route path to prefetch
 */
export const prefetchRoute = (routePath) => {
  // Don't prefetch if already done
  if (prefetchedRoutes.has(routePath)) {
    return;
  }

  const loader = routeMap[routePath];
  if (loader) {
    // Mark as prefetched immediately to avoid duplicates
    prefetchedRoutes.add(routePath);
    
    // Start loading the component
    loader().catch((err) => {
      // If prefetch fails, remove from set so it can be retried
      prefetchedRoutes.delete(routePath);
      console.warn(`Failed to prefetch route: ${routePath}`, err);
    });
  }
};

/**
 * Prefetch multiple routes at once
 * @param {string[]} routes - Array of route paths to prefetch
 */
export const prefetchRoutes = (routes) => {
  routes.forEach(route => prefetchRoute(route));
};

/**
 * Clear prefetch cache (useful for testing)
 */
export const clearPrefetchCache = () => {
  prefetchedRoutes.clear();
};

export default prefetchRoute;

