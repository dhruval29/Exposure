import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register once globally
if (!gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger)
}

// Global GSAP performance optimizations
gsap.config({
  force3D: true, // Force GPU acceleration for better performance
  nullTargetWarn: false, // Reduce console noise
  autoSleep: 60, // Put inactive tweens to sleep after 60 seconds
})

// ScrollTrigger performance optimizations
ScrollTrigger.config({
  limitCallbacks: true, // Limit callbacks per frame for better performance
  syncInterval: 200, // Sync interval in ms for better performance
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load', // Only refresh on these events
})

// Set sensible global defaults for smoothness without Lenis
// These act as base values; component-specific ScrollTriggers can still override
ScrollTrigger.defaults({
  // A small scrub creates smoothness while keeping responsiveness
  scrub: 1.5,
  markers: false,
  // Avoid accidental global pin unless explicitly requested by components
  // Note: defaults does not support pin; components should set pin when needed
})

// Provide a helper to tweak per-platform if ever needed
export const setGlobalScrollSmoothness = (scrub: number = 1.5) => {
  ScrollTrigger.defaults({ scrub })
}

// Force refresh after route/component mounts to ensure proper calculations
export const refreshScroll = () => {
  // Defer a frame to ensure layout is stable
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

// Batch ScrollTrigger animations for better performance
export const batchScrollTriggers = (elements: string | Element[], config: ScrollTrigger.BatchVars) => {
  return ScrollTrigger.batch(elements, {
    interval: 0.1, // Stagger time between animations
    batchMax: 3,   // Max items to animate at once
    ...config
  })
}

export default ScrollTrigger


