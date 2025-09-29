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
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(mount)
} else {
  setTimeout(mount, 0)
}
