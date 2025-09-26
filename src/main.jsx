import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
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
