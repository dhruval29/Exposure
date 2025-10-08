import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

// Global route transition loader that matches the spec:
// 1) On link click, a black screen slides UP from the bottom to fully cover.
// 2) While covered, navigation occurs in the background.
// 3) After the new route renders, the screen exits by sliding UP (off the top).
const RouteTransitionLoader = () => {
  const overlayRef = useRef(null)
  const isAnimatingRef = useRef(false)
  const pendingHrefRef = useRef(null)
  const pendingStateRef = useRef(undefined)
  const navigate = useNavigate()
  const location = useLocation()

  // Ensure overlay starts off-screen and non-interactive
  useEffect(() => {
    const el = overlayRef.current
    if (!el) return
    gsap.set(el, { yPercent: 100, pointerEvents: 'none' })
  }, [])

  // Tuning
  const COVER_IN_DURATION = 1.1 // slower cover-in
  const COVER_OUT_DURATION = 0.9 // slower exit
  const EASE_IN = 'power4.inOut' // accelerate then decelerate while covering
  const EASE_OUT = 'power4.in' // accelerate off the top

  // Intercept internal link clicks to run the entrance animation before navigating
  useEffect(() => {
    const handler = (e) => {
      // Only left click without modifier keys
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = e.target.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      const target = anchor.getAttribute('target')
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (target === '_blank') return
      if (href.startsWith('#')) return

      // Same-path navigation should still animate, but let React Router handle search/hash differences
      e.preventDefault()

      // Debounce if animation already running
      if (isAnimatingRef.current) return
      isAnimatingRef.current = true
      pendingHrefRef.current = href
      pendingStateRef.current = undefined

      const el = overlayRef.current
      if (!el) {
        navigate(href)
        return
      }

      // Mark active and notify
      window.__routeTransitionActive = true
      try { window.dispatchEvent(new CustomEvent('route-transition-start')) } catch {}
      gsap.set(el, { pointerEvents: 'auto' })
      gsap.to(el, {
        yPercent: 0,
        duration: COVER_IN_DURATION,
        ease: EASE_IN,
        onComplete: () => {
          // Navigate once fully covered
          navigate(pendingHrefRef.current, { state: pendingStateRef.current })
        }
      })
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [navigate])

  // Listen for programmatic transition requests
  useEffect(() => {
    const onRequest = (e) => {
      const detail = e?.detail
      if (!detail || isAnimatingRef.current) return
      const href = typeof detail === 'string' ? detail : detail.href
      const navState = typeof detail === 'object' ? detail.state : undefined
      isAnimatingRef.current = true
      pendingHrefRef.current = href
      pendingStateRef.current = navState
      const el = overlayRef.current
      if (!el) {
        navigate(href, { state: navState })
        return
      }
      // Mark active and notify
      window.__routeTransitionActive = true
      try { window.dispatchEvent(new CustomEvent('route-transition-start')) } catch {}
      gsap.set(el, { pointerEvents: 'auto' })
      gsap.to(el, {
        yPercent: 0,
        duration: COVER_IN_DURATION,
        ease: EASE_IN,
        onComplete: () => navigate(href, { state: navState })
      })
    }
    window.addEventListener('route-transition', onRequest)
    return () => window.removeEventListener('route-transition', onRequest)
  }, [navigate])

  // After location changes (new route rendered), play the exit animation if we had animated in
  useEffect(() => {
    const el = overlayRef.current
    if (!el) return
    if (!isAnimatingRef.current) return

    // For routes that require content readiness, wait for a signal
    const path = location.pathname
    const shouldWaitForContent = path === '/pictures' || path === '/contact' || path === '/events'

    const playExit = () => {
      gsap.to(el, {
        yPercent: -100,
        duration: COVER_OUT_DURATION,
        ease: EASE_OUT,
        onComplete: () => {
          gsap.set(el, { yPercent: 100, pointerEvents: 'none' })
          isAnimatingRef.current = false
          pendingHrefRef.current = null
          window.__routeTransitionActive = false
          try { window.dispatchEvent(new CustomEvent('route-transition-complete')) } catch {}
        }
      })
    }

    if (!shouldWaitForContent) {
      playExit()
      return
    }

    let timeoutId = null
    const onContentReady = (ev) => {
      try {
        const path = ev?.detail?.path || ev?.detail
        if (path && path !== location.pathname) return
      } catch {}
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('route-content-ready', onContentReady)
      playExit()
    }

    // If already flagged ready, skip waiting
    if (window.__routeContentReadyForPath === path) {
      playExit()
      return
    }

    window.addEventListener('route-content-ready', onContentReady)
    // Fallback timeout to avoid hanging in case of slow network
    timeoutId = setTimeout(() => {
      window.removeEventListener('route-content-ready', onContentReady)
      playExit()
    }, 5000)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('route-content-ready', onContentReady)
    }
  }, [location])

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        background: '#000',
        zIndex: 99999,
        transform: 'translateZ(0)'
      }}
      aria-hidden="true"
    />
  )
}

export default RouteTransitionLoader

// Helper to trigger the transition from anywhere
export function startRouteTransition(href, state) {
  try {
    const ev = new CustomEvent('route-transition', { detail: state !== undefined ? { href, state } : href })
    window.dispatchEvent(ev)
  } catch {
    // Fallback if CustomEvent not available
    const ev = document.createEvent('CustomEvent')
    ev.initCustomEvent('route-transition', false, false, state !== undefined ? { href, state } : href)
    window.dispatchEvent(ev)
  }
}


