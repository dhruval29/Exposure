import { useEffect, useState } from 'react'

// Returns false while the global route transition cover is active; true after it exits
export default function useRouteTransitionReady() {
  const [ready, setReady] = useState(() => !window.__routeTransitionActive)

  useEffect(() => {
    const onStart = () => setReady(false)
    const onComplete = () => setReady(true)
    window.addEventListener('route-transition-start', onStart)
    window.addEventListener('route-transition-complete', onComplete)
    return () => {
      window.removeEventListener('route-transition-start', onStart)
      window.removeEventListener('route-transition-complete', onComplete)
    }
  }, [])

  return ready
}


