import React from 'react'

// This component applies best-effort techniques to reduce mobile browser UI chrome
// (address bar/search bar/toolbars) when the page is opened on mobile. It only
// performs lightweight, safe operations: setting theme-color, stabilizing 100svh,
// nudging scroll on mount and orientation changes, and toggling a body class.
// Use only on routes where immersive view is desired.
export default function MobileChromeHider() {
  React.useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches
    if (!isTouch || !isSmallScreen) return

    const originalOverflow = document.documentElement.style.overflow
    const originalBodyOverflow = document.body.style.overflow

    // Add an immersive class for CSS hooks
    document.body.classList.add('mobile-immersive')

    // Update theme-color to blend with page background (helps some browsers hide UI)
    const desiredTheme = '#ffffff'
    let themeMeta = document.querySelector('meta[name="theme-color"]')
    if (!themeMeta) {
      themeMeta = document.createElement('meta')
      themeMeta.setAttribute('name', 'theme-color')
      document.head.appendChild(themeMeta)
    }
    const prevTheme = themeMeta.getAttribute('content')
    themeMeta.setAttribute('content', desiredTheme)

    // Set an env var for dynamic viewport height to avoid 100vh issues
    const setVhVar = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    setVhVar()

    // Light scroll nudges can collapse the address bar on some mobile browsers
    const nudgeScroll = () => {
      // Avoid fighting app-level scroll locks; only nudge when scrollable
      if (document.scrollingElement && document.scrollingElement.scrollHeight > window.innerHeight) {
        window.scrollTo(0, 1)
      }
    }

    // Ensure no accidental overscroll hidden prevents collapsing UI
    document.documentElement.style.overflow = 'auto'
    document.body.style.overflow = 'auto'

    // Apply on mount and after a short delay
    nudgeScroll()
    const mountTimer = setTimeout(nudgeScroll, 250)

    // Keep viewport stable across orientation/resize
    const onResize = () => {
      setVhVar()
      nudgeScroll()
    }

    // Some Android Chrome collapses on user interaction; be gentle
    const onTouchEnd = () => nudgeScroll()

    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      clearTimeout(mountTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      window.removeEventListener('touchend', onTouchEnd)
      document.documentElement.style.overflow = originalOverflow
      document.body.style.overflow = originalBodyOverflow
      document.body.classList.remove('mobile-immersive')
      if (themeMeta && typeof prevTheme === 'string') {
        themeMeta.setAttribute('content', prevTheme)
      }
    }
  }, [])

  return null
}


