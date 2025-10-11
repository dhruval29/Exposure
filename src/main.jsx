import { StrictMode } from 'react'
import './index.css'
// Initialize global ScrollTrigger defaults (smooth scrub without Lenis)
import './lib/scroll.ts'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SpeedInsights } from "@vercel/speed-insights/react"
// Initialize performance monitoring
import { initPerformanceMonitoring } from './utils/performanceMonitor.js'

// Hydrate root after main thread settles for a tick
const mount = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
      <SpeedInsights />
    </StrictMode>,
  )
  
  // Initialize performance monitoring
  initPerformanceMonitoring()
  
  // Disable image dragging globally
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault()
      return false
    }
  }, { passive: false })
  
  // Prevent context menu on images to avoid "Open image in new tab"
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault()
      return false
    }
  }, { passive: false })
  
  // Remove boot cover ASAP after mount
  const cover = document.getElementById('boot-cover')
  if (cover) {
    // Use rAF to avoid layout jank and ensure React committed
    requestAnimationFrame(() => {
      cover.parentNode && cover.parentNode.removeChild(cover)
    })
  }
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(mount)
} else {
  setTimeout(mount, 0)
}
