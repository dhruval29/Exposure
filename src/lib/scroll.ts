import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register once globally
if (!gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger)
}

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

export default ScrollTrigger


