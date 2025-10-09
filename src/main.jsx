import { StrictMode } from 'react'
import './index.css'
// Initialize global ScrollTrigger defaults (smooth scrub without Lenis)
import './lib/scroll.ts'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Hydrate root after main thread settles for a tick
const mount = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
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
