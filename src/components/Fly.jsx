import React, { useEffect, useRef, useState } from 'react'
import styles from './Fly.module.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const IMAGES = [
  '/assets/mobile/images/fly-images/1.webp',
  '/assets/mobile/images/fly-images/2.webp',  // Converted from JPG
  '/assets/mobile/images/fly-images/3.webp',  // Converted from JPG - 81 KB savings!
  '/assets/mobile/images/fly-images/4.webp',
  '/assets/mobile/images/fly-images/5.webp',  // Converted from JPG
  '/assets/mobile/images/fly-images/6.webp',  // Converted from JPG
  '/assets/mobile/images/fly-images/7.webp',
  '/assets/mobile/images/fly-images/8.webp',
  '/assets/mobile/images/fly-images/9.webp',
  '/assets/mobile/images/fly-images/10.webp',
]

// Fixed, hand-picked z-indexes to avoid changing on reload
export const Z_INDEXES = [12, 8, 4, 10, 6, 2, 14, 16, 18, 20]


// Mobile positions (from previous git version)
export const MOBILE_POSITIONS = [
  { top: '05%', left: '-40%',   widthPct: 28 },    // Top-left, mostly off
  { top: '-10%', left: '100%', widthPct: 24 },      // Top-right, off right edge
  { top: '110%', left: '-40%', widthPct: 26 },      // Far bottom-left, off bottom
  { top: '-35%',  left: '85%', widthPct: 22 },      // Top-right, partially off
  { top: '80%', left: '110%', widthPct: 20 },      // Bottom-right, off right
  { top: '-40%',  left: '-25%', widthPct: 30 },      // Far top-center, mostly off
  { top: '110%', left: '-30%', widthPct: 28 },       // Bottom-left, mostly off
  { top: '105%', left: '120%', widthPct: 25 },      // Far bottom-right corner
  { top: '90%', left: '25%', widthPct: 18 },        // Bottom-center-left
  { top: '105%', left: '10%', widthPct: 23 },       // Bottom-center-right
]

// Desktop positions (current positions from user adjustments)
export const DESKTOP_POSITIONS = [
  { top: '05%', left: '20%',   widthPct: 28 },    // Top-left, mostly off
  { top: '-10%', left: '100%', widthPct: 24 },      // Top-right, off right edge
  { top: '60%', left: '-50%', widthPct: 26 },      // Far bottom-left, off bottom
  { top: '-35%',  left: '85%', widthPct: 22 },      // Top-right, partially off
  { top: '80%', left: '110%', widthPct: 20 },      // Bottom-right, off right
  { top: '-40%',  left: '-25%', widthPct: 30 },      // Far top-center, mostly off
  { top: '110%', left: '-30%', widthPct: 28 },       // Bottom-left, mostly off
  { top: '105%', left: '50%', widthPct: 25 },      // Far bottom-right corner
  { top: '90%', left: '45%', widthPct: 18 },        // Bottom-center-left
  { top: '75%', left: '10%', widthPct: 23 },       // Bottom-center-right
]

// Initial depth tweak per image to bring a few very close initially
// Positive numbers make start closer (less negative Z)
export const START_Z_OFFSETS = [
  150,
  1200, // make image 2 start even closer
  1000,
  1200,
  1200, // make image 5 start even closer
  1000,
  1800, // image 7
  1100, // image 8
  900,  // image 9
  1300, // image 10
]

const Fly = ({ controlled = false, onItemsReady, containerStyle, zIndex }) => {
  const containerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Enhanced screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setIsMobile('small-mobile');
      } else if (width <= 768) {
        setIsMobile('mobile');
      } else if (width <= 1024) {
        setIsMobile('tablet');
      } else {
        setIsMobile('desktop');
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (controlled) {
      const ctx = gsap.context(() => {
        const items = gsap.utils.toArray(`.${styles.item}`)
        if (typeof onItemsReady === 'function') {
          onItemsReady(items)
        }
        // Apply responsive scaling to all items in controlled mode
        if (isMobile === 'small-mobile') {
          gsap.set(items, { scale: 1.4 })
        } else if (isMobile === 'mobile') {
          gsap.set(items, { scale: 1.4 })
        } else if (isMobile === 'tablet') {
          gsap.set(items, { scale: 1.4 })
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
        // Use different positions based on screen size
        const positions = isMobile === 'desktop' ? DESKTOP_POSITIONS : MOBILE_POSITIONS
        const { top, left } = positions[i % positions.length]
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
            // Responsive scaling based on screen size
            scale: isMobile === 'small-mobile' ? 1.4 : 
                   isMobile === 'mobile' ? 1.4 : 
                   isMobile === 'tablet' ? 1.4 : 1
          },
          { 
            z: zOut, 
            x: xOut, 
            y: yOut, 
            force3D: true, 
            duration,
            // Keep the responsive scale throughout the animation
            scale: isMobile === 'small-mobile' ? 1.4 : 
                   isMobile === 'mobile' ? 1.4 : 
                   isMobile === 'tablet' ? 1.4 : 1
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
        // Use different positions based on screen size
        const positions = isMobile === 'desktop' ? DESKTOP_POSITIONS : MOBILE_POSITIONS
        const { top, left, widthPct } = positions[idx % positions.length]
        const z = Z_INDEXES[idx % Z_INDEXES.length]
        // Responsive width scaling
        const responsiveWidth = isMobile === 'small-mobile' ? widthPct * 1.4 : 
                               isMobile === 'mobile' ? widthPct * 1.4 : 
                               isMobile === 'tablet' ? widthPct * 1.4 : widthPct
        return (
          <div key={`${src}-${idx}`} className={styles.item} style={{ top, left, width: `${responsiveWidth}%`, zIndex: z }}>
            <img 
              src={src} 
              alt={`fly-${idx + 1}`} 
              className={styles.img} 
              draggable={false} 
              style={{
                transform: isMobile === 'small-mobile' ? 'scale(1.4)' : 
                          isMobile === 'mobile' ? 'scale(1.4)' : 
                          isMobile === 'tablet' ? 'scale(1.4)' : 'scale(1)'
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Fly


