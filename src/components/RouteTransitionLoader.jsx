import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

// Global route transition loader that matches the spec:
// 1) On link click, a black screen slides UP from the bottom to fully cover.
// 2) While covered, navigation occurs in the background.
// 3) After the new route renders, the screen exits by sliding UP (off the top).
const RouteTransitionLoader = () => {
  const overlayRef = useRef(null)
  const textRef = useRef(null)
  const isAnimatingRef = useRef(false)
  const pendingHrefRef = useRef(null)
  const pendingStateRef = useRef(undefined)
  const [destinationText, setDestinationText] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  // Map route paths to display names
  const getPageName = (path) => {
    const pageNames = {
      '/': 'Home',
      '/our-journey': 'Our Journey',
      '/effects': 'Effects',
      '/gallery': 'Gallery',
      '/pictures': 'Pictures',
      '/members': 'Members',
      '/the-team': 'The Team',
      '/admin': 'Admin',
      '/fly': 'Fly',
      '/events': 'Events',
      '/contact': 'Contact',
      '/scroll-stack-demo': 'Scroll Stack Demo'
    }
    return pageNames[path] || 'Loading...'
  }

  // Ensure overlay starts off-screen and non-interactive
  useEffect(() => {
    const el = overlayRef.current
    const textEl = textRef.current
    if (!el) return
    gsap.set(el, { yPercent: 100, pointerEvents: 'none' })
    if (textEl) {
      gsap.set(textEl, { opacity: 0, y: 20 })
    }
  }, [])

  // Tuning
  const COVER_IN_DURATION = 1.1 // slower cover-in
  const COVER_OUT_DURATION = 0.9 // slower exit
  const MIN_TEXT_DISPLAY_DURATION = 1.5 // minimum time text stays visible
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
      
      // Set destination text
      setDestinationText(getPageName(href))
      
      gsap.to(el, {
        yPercent: 0,
        duration: COVER_IN_DURATION,
        ease: EASE_IN,
        onComplete: () => {
          // Animate text in during settling stage
          const textEl = textRef.current
          if (textEl) {
            gsap.to(textEl, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              delay: 0.2
            })
          }
          
          // Navigate once fully covered
          navigate(pendingHrefRef.current, { state: pendingStateRef.current })
          
          // Set minimum display duration
          setTimeout(() => {
            if (isAnimatingRef.current) {
              window.__minTextDurationComplete = true
            }
          }, MIN_TEXT_DISPLAY_DURATION * 1000)
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
      
      // Set destination text
      setDestinationText(getPageName(href))
      
      gsap.to(el, {
        yPercent: 0,
        duration: COVER_IN_DURATION,
        ease: EASE_IN,
        onComplete: () => {
          // Animate text in during settling stage
          const textEl = textRef.current
          if (textEl) {
            gsap.to(textEl, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              delay: 0.2
            })
          }
          
          navigate(href, { state: navState })
          
          // Set minimum display duration
          setTimeout(() => {
            if (isAnimatingRef.current) {
              window.__minTextDurationComplete = true
            }
          }, MIN_TEXT_DISPLAY_DURATION * 1000)
        }
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
      const textEl = textRef.current
      
      // Check if minimum duration has passed
      const checkMinDuration = () => {
        if (!window.__minTextDurationComplete) {
          setTimeout(checkMinDuration, 100)
          return
        }
        
        // Fade out text first
        if (textEl) {
          gsap.to(textEl, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: 'power2.in'
          })
        }
        
        // Then slide overlay up
        gsap.to(el, {
          yPercent: -100,
          duration: COVER_OUT_DURATION,
          ease: EASE_OUT,
          delay: 0.2,
          onComplete: () => {
            gsap.set(el, { yPercent: 100, pointerEvents: 'none' })
            if (textEl) {
              gsap.set(textEl, { opacity: 0, y: 20 })
            }
            setDestinationText('')
            isAnimatingRef.current = false
            pendingHrefRef.current = null
            window.__routeTransitionActive = false
            window.__minTextDurationComplete = false
            try { window.dispatchEvent(new CustomEvent('route-transition-complete')) } catch {}
          }
        })
      }
      
      checkMinDuration()
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
        background: '#F2EAE0',
        zIndex: 99999,
        transform: 'translateZ(0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      aria-hidden="true"
    >
      <div
        ref={textRef}
        style={{
          color: '#333',
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontFamily: "'PP Editorial New', 'Inter', 'Roboto', 'Source Sans Pro', 'Open Sans', 'Nunito Sans', Helvetica, Arial, sans-serif",
          fontWeight: 100,
          fontStyle: 'italic',
          letterSpacing: '-0.02em',
          textAlign: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          opacity: 0
        }}
      >
        {destinationText}
      </div>
    </div>
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


