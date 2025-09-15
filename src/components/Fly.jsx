import React, { useEffect, useRef, useState } from 'react'
import styles from './Fly.module.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const IMAGES = [
  '/assets/mobile/images/fly-images/1.webp',
  '/assets/mobile/images/fly-images/2.webp',
  '/assets/mobile/images/fly-images/3.webp',
  '/assets/mobile/images/fly-images/4.webp',
  '/assets/mobile/images/fly-images/5.webp',
  '/assets/mobile/images/fly-images/6.webp',
]

// Fixed, hand-picked z-indexes to avoid changing on reload
export const Z_INDEXES = [12, 8, 4, 10, 6, 2]

// Fixed positions and sizes (no randomness)
// Positions derived from 1536x776 px design, converted to percentages
// Each has: top %, left %, width % (relative to container width)
export const POSITIONS = [
  { top: '28.61%', left: '-30%',   widthPct: 36 },
  { top: '23.30%', left: '101.58%', widthPct: 16.25 },
  { top: '110.55%', left: '20.37%', widthPct: 26.72 },
  { top: '-10.22%',  left: '70.82%', widthPct: 14.14 },
  { top: '80.23%', left: '70.85%', widthPct: 20.4 },
  { top: '-20.31%',  left: '25.26%', widthPct: 23.98 },
]

// Initial depth tweak per image to bring a few very close initially
// Positive numbers make start closer (less negative Z)
export const START_Z_OFFSETS = [
  800,
  1200, // make image 2 start even closer
  800,
  800,
  1200, // make image 5 start even closer
  800,
]

const Fly = ({ controlled = false, onItemsReady, containerStyle, zIndex }) => {
  const containerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (controlled) {
      const ctx = gsap.context(() => {
        const items = gsap.utils.toArray(`.${styles.item}`)
        if (typeof onItemsReady === 'function') {
          onItemsReady(items)
        }
        // Apply mobile scaling to all items in controlled mode
        if (isMobile) {
          gsap.set(items, { scale: 1.2 })
        }
      }, containerRef)
      return () => ctx.revert()
    }

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(`.${styles.item}`)

      // One pinned section controlling the depth fly-through
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=50%',
          scrub: 2.5,
          pin: true,
          anticipatePin: 1,
        },
        defaults: { ease: 'none' },
      })

      const maxZLayer = Math.max(...Z_INDEXES)
      items.forEach((el, i) => {
        // Base exit direction (toward nearest edge) from fixed positions
        const { top, left } = POSITIONS[i % POSITIONS.length]
        const leftPct = parseFloat(String(left).replace('%', ''))
        const topPct = parseFloat(String(top).replace('%', ''))
        const xOut = leftPct < 50 ? -800 : 800
        const yOut = topPct < 50 ? -300 : 300

        // Use z-index layer to control duration, and a per-image offset to control initial closeness
        const zLayer = Z_INDEXES[i % Z_INDEXES.length]
        const startOffsetZ = START_Z_OFFSETS[i % START_Z_OFFSETS.length]
        // Base start much deeper, then pull some images closer using offsets
        const zIn = -1400 + startOffsetZ - (Math.max(...Z_INDEXES) - zLayer) * 40
        const zOut = 1600
        const duration = 0.9 + (Math.max(...Z_INDEXES) - zLayer) * 0.12

        // Start all together (start offset = 0), end at different times via duration
        tl.fromTo(
          el,
          { 
            z: zIn, 
            x: 0, 
            y: 0,
            // Increase initial scale by 20% for mobile
            scale: isMobile ? 1.2 : 1
          },
          { 
            z: zOut, 
            x: xOut, 
            y: yOut, 
            force3D: true, 
            duration,
            // Keep the mobile scale throughout the animation
            scale: isMobile ? 1.2 : 1
          },
          0
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [controlled, onItemsReady, isMobile])

  return (
    <div ref={containerRef} className={styles.container} style={{ ...(containerStyle || {}), zIndex }}>
      {IMAGES.map((src, idx) => {
        const { top, left, widthPct } = POSITIONS[idx % POSITIONS.length]
        const z = Z_INDEXES[idx % Z_INDEXES.length]
        // Increase width by 20% for mobile
        const mobileWidth = isMobile ? widthPct * 1.2 : widthPct
        return (
          <div key={`${src}-${idx}`} className={styles.item} style={{ top, left, width: `${mobileWidth}%`, zIndex: z }}>
            <img 
              src={src} 
              alt={`fly-${idx + 1}`} 
              className={styles.img} 
              draggable={false} 
              style={{
                transform: isMobile ? 'scale(1.2)' : 'scale(1)'
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Fly


