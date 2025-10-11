import React, { useRef, useState, useEffect } from 'react'
import Rectangle18 from './Rectangle18'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

import NavigationMenu from './NavigationMenu'
import StorytellingHero from './StorytellingHero'
import Footer from './Footer'
import HoverImage from './HoverImage'
import { responsiveImagePositions } from '../utils/positionConverter'
import Fly, { Z_INDEXES as FLY_Z_INDEXES, POSITIONS as FLY_POSITIONS, START_Z_OFFSETS as FLY_START_Z_OFFSETS } from './Fly'
import MobileSlidingFrame from './MobileSlidingFrame'
import MobileMarquee from './MobileMarquee'
import Frame60 from './Frame60'
import MergedFrame from './MergedFrame'
import '../styles/Gallery.css'

// Footer height constants (responsive vh units)
const FOOTER_HEIGHT_DESKTOP = '44vh'
const FOOTER_HEIGHT_MOBILE = '25vh'

// Landing shutter preloader removed

// VideoBackground component to handle continuous video playback
const VideoBackground = ({ wireframeRef, isMobile, startSubtitle }) => {
  const videoRef = useRef(null)
  const [rotatingWord, setRotatingWord] = useState('')
  const rotationRef = useRef({ intervalId: null, startedAt: 0, index: 0, finished: false })
  const subtitleRef = useRef(null)
  const subtitleInnerRef = useRef(null)
  const underlineRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Function to ensure video is playing
    const ensurePlaying = async () => {
      try {
        if (video.paused) {
          await video.play()
        }
      } catch (error) {
        console.log('Video play failed:', error)
      }
    }

    // Handle visibility change - ensure video keeps playing when tab becomes hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, but keep video playing
        ensurePlaying()
      } else {
        // Tab is visible again, ensure video is still playing
        ensurePlaying()
      }
    }

    // Handle page focus/blur
    const handleFocus = () => ensurePlaying()
    const handleBlur = () => ensurePlaying()

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    // Initial play attempt
    ensurePlaying()

    // Set up interval to periodically ensure video is playing (every 5 seconds)
    const playInterval = setInterval(ensurePlaying, 5000)

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      clearInterval(playInterval)
    }
  }, [])

  // Fast-rotating subtitle that settles on "Life", starts after shutter reveal
  useEffect(() => {
    if (!startSubtitle) return
    const words = [
      'photos', 'videos', 'images', 'moments', 'frames',
      'stills', 'stories', 'portraits', 'reels', 'films',
      'memories', 'snapshots', 'captures', 'highlights'
    ]
    rotationRef.current.startedAt = Date.now()
    rotationRef.current.index = 0
    rotationRef.current.finished = false
    setRotatingWord(words[0])

    const tickMs = 120 // fast changes
    const maxDurationMs = 1600 // after this, settle on "Life"

    const intervalId = setInterval(() => {
      if (rotationRef.current.finished) return
      const elapsed = Date.now() - rotationRef.current.startedAt
      if (elapsed >= maxDurationMs) {
        rotationRef.current.finished = true
        setRotatingWord('Life')
        // Ease into the final word for a gentle settle effect
        const el = subtitleInnerRef.current
        const underline = underlineRef.current
        if (el) {
          gsap.fromTo(el,
            { opacity: 0.75, scale: 0.985 },
            { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }
          )
        }
        // Animate underline after "Life" settles
        if (underline && el) {
          // Set underline width to match the text width with slight reduction
          const textWidth = el.offsetWidth
          const reducedWidth = textWidth * 0.7 // 30% shorter
          gsap.set(underline, { width: reducedWidth + 'px' })
          
          gsap.fromTo(underline,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 }
          )
        }
        clearInterval(intervalId)
        return
      }
      rotationRef.current.index = (rotationRef.current.index + 1) % words.length
      setRotatingWord(words[rotationRef.current.index])
    }, tickMs)
    rotationRef.current.intervalId = intervalId

    return () => {
      if (rotationRef.current.intervalId) {
        clearInterval(rotationRef.current.intervalId)
      }
    }
  }, [startSubtitle])

  return (
    <div
      ref={wireframeRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#0066ff',
        overflow: 'hidden',
        perspective: '900px',
        transformStyle: 'preserve-3d',
        zIndex: 0
      }}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        <source src={isMobile ? "/videos/vashi smol.mp4" : "/videos/SAAVYAS AFTERMOVIE.mp4"} type="video/mp4" />
      </video>
      {/* Main title removed per request; keep only rotating subtitle */}
      {/* Fast-rotating subtitle that settles on Life */}
      <div
        ref={subtitleRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          color: 'white',
          fontSize: 'clamp(28px, 14vw, 148px)',
          fontFamily: "'PP Editorial New', 'Inter', 'Roboto', 'Source Sans Pro', 'Open Sans', 'Nunito Sans', Helvetica, Arial, sans-serif",
          fontWeight: 100,
          fontStyle: 'italic',
          letterSpacing: '-0.02em',
          textAlign: 'center',
          maxWidth: '100vw',
          lineHeight: 1.05,
          textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          willChange: 'opacity, transform'
        }}
        aria-hidden="true"
      >
        <span
          ref={subtitleInnerRef}
          style={{ display: 'inline-block', transformOrigin: '50% 50%' }}
        >
          {rotatingWord}
        </span>
        {/* Animated underline that appears after "Life" settles */}
        <div
          ref={underlineRef}
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            height: '2px',
            background: 'white',
            transformOrigin: '50% 50%',
            scaleX: 0,
            opacity: 0,
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            display: rotatingWord === 'Life' ? 'block' : 'none'
          }}
        />
      </div>
      {/* Fallback background color in case video fails to load */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#0066ff',
        zIndex: 0
      }} />
    </div>
  )
}

// Inline ZoomReveal so Landing is self-contained
const DEFAULT_ZR_CONFIG = {
  triggerStart: 'top top', // begin only when section is fully reached
  triggerEnd: '+=55%',
  scrub: 2, // 2 = slower scroll; higher = faster, lower = smoother
  zoomDuration: 2.5,
  textDuration: 2.5,
  textLead: 0, // seconds text starts before image (negative to start after)
  navDelayMs: 500,
  postZoomScrollPad: 0.15, // Desktop default (mobile overridden inline)
  ease: 'power2.inOut',
  markers: false,
  pin: true,
  pinSpacing: true
}

const ZoomReveal = ({ imageSrc = '/assets/mobile/images/zoom-reveal/zoom-reveal.webp', leftText = 'Take a closer', rightText = 'look at Life', config = DEFAULT_ZR_CONFIG }) => {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const leftTextRef = useRef(null)
  const rightTextRef = useRef(null)
  const [showNav, setShowNav] = useState(false)
  const navOverlayRef = useRef(null)
  const navInnerRef = useRef(null)
  const navTimeoutRef = useRef(null)
  const navExitTimeoutRef = useRef(null)
  const [isExitingNav, setIsExitingNav] = useState(false)
  const postNavSlideRef = useRef(null)
  const slideArmedRef = useRef(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const scrollTriggerRef = useRef(null)
  const eventListenersRef = useRef({ wheel: null, touchstart: null })
  const masterTlRef = useRef(null)
  const flyItemsRef = useRef(null)
  const blurOverlayRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const aspectRatio = height / width
      
      // More comprehensive mobile detection
      const isMobileWidth = width <= 768
      const isMobileAspectRatio = aspectRatio > 1.3 // Portrait orientation with tall aspect ratio
      
      // Tablet detection (landscape tablets may have smaller aspect ratios)
      const isTablet = width > 768 && width <= 1024
      
      setIsMobile((isMobileWidth && isMobileAspectRatio) || isTablet)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Image load handler
  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  // Get responsive values with better mobile device handling
  const getResponsiveValues = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const aspectRatio = vh / vw
    const isMobile = vw <= 768
    const isLargeMobile = vw >= 400 && vh >= 900 // Large mobile devices like Galaxy S24 FE
    
    // Adjust font size for different mobile device sizes - moderately increased
    let baseFontSize = Math.min(vw * 0.06, vh * 0.09, 80) // Moderately increased from original
    
    if (isLargeMobile) {
      // For larger mobile devices, use a more conservative scaling
      baseFontSize = Math.min(vw * 0.055, vh * 0.08, 75) // Moderately increased from original
    }
    
    const fontSize = isMobile ? baseFontSize * 1.2 : baseFontSize // Slightly increased from 1.1 to 1.2
    
    // Adjust off-screen distance based on device characteristics
    let offScreenDistance = vw * 0.6
    if (isLargeMobile) {
      // Reduce movement distance for larger mobile devices to prevent jittery animations
      offScreenDistance = vw * 0.45
    }
    
    return {
      vw,
      vh,
      fontSize,
      isMobile,
      isLargeMobile,
      aspectRatio,
      offScreenDistance
    }
  }

  useEffect(() => {
    const container = containerRef.current
    const img = imageRef.current
    const left = leftTextRef.current
    const right = rightTextRef.current
    if (!container || !img || !left || !right) return

    const responsiveValues = getResponsiveValues()

    // Helpers for dynamic pinning distance on handhelds
    const isHandheldForPin = responsiveValues.isMobile || responsiveValues.isLargeMobile || window.innerWidth <= 1024
    const computeExactEnd = () => {
      const el = containerRef.current
      const h = el ? (el.offsetHeight || el.clientHeight || window.innerHeight) : window.innerHeight
      // Increased slightly to 75vh-100vh range for smoother zoom feel
      const vw = window.innerWidth
      const vh = window.innerHeight
      let multiplier = 0.75 // 75vh for larger handhelds (>= ~6.4")
      if (vw <= 375 || vh <= 800) {
        multiplier = 1.0 // 100vh for smaller screens
      }
      return `+=${Math.round(h * multiplier)}`
    }

    // On handhelds: create a separate pin-only trigger with a long end so the
    // section stays pinned longer without slowing the animation timeline.
    let pinTrigger = null
    if (isHandheldForPin) {
      pinTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: computeExactEnd, // long pin duration
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        refreshPriority: 1,
        markers: false,
        onLeave: () => {
          if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current)
          if (navExitTimeoutRef.current) { 
            clearTimeout(navExitTimeoutRef.current)
            navExitTimeoutRef.current = null 
          }
          setIsExitingNav(false)
          setShowNav(true)
        },
        onEnterBack: () => {
          if (navTimeoutRef.current) { 
            clearTimeout(navTimeoutRef.current)
            navTimeoutRef.current = null 
          }
          if (navExitTimeoutRef.current) { 
            clearTimeout(navExitTimeoutRef.current)
            navExitTimeoutRef.current = null 
          }
          setIsExitingNav(true)
          navExitTimeoutRef.current = setTimeout(() => {
            setShowNav(false)
            setIsExitingNav(false)
          }, 900)
        }
      })
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        // Mobile: matched to Fly.jsx feel (50-60%), Desktop: original values
        end: isHandheldForPin 
          ? (responsiveValues.isLargeMobile ? '+=60%' : '+=50%')
          : '+=110%', // Desktop keeps original value
        scrub: isHandheldForPin ? 2.5 : 2, // Mobile: matched to Fly.jsx, Desktop: original
        pin: isHandheldForPin ? false : true, // handhelds use the separate pin trigger
        markers: false,
        anticipatePin: 1,
        refreshPriority: 1,
        invalidateOnRefresh: true,
        pinSpacing: true,
        onLeave: () => {
          if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current)
          if (navExitTimeoutRef.current) { 
            clearTimeout(navExitTimeoutRef.current)
            navExitTimeoutRef.current = null 
          }
          setIsExitingNav(false)
          setShowNav(true)
        },
        onEnterBack: () => {
          if (navTimeoutRef.current) { 
            clearTimeout(navTimeoutRef.current)
            navTimeoutRef.current = null 
          }
          if (navExitTimeoutRef.current) { 
            clearTimeout(navExitTimeoutRef.current)
            navExitTimeoutRef.current = null 
          }
          // Begin reverse animation
          setIsExitingNav(true)
          // Unmount after exit animation completes
          navExitTimeoutRef.current = setTimeout(() => {
            setShowNav(false)
            setIsExitingNav(false)
          }, 900)
        }
      }
    })

    // Store ScrollTrigger reference and timeline for later composition
    scrollTriggerRef.current = tl.scrollTrigger
    masterTlRef.current = tl

    gsap.set([left, right], { zIndex: 5000, opacity: 1, x: 0 })

    // Compose Fly segment first (if items are already available)
    const composeFlySegment = () => {
      const items = flyItemsRef.current || []
      if (!items || items.length === 0) return { flyMaxDuration: 0 }

      const maxZLayer = Math.max(...FLY_Z_INDEXES)
      // Compute per-item durations to find max
      const durations = items.map((_, i) => 0.9 + (maxZLayer - (FLY_Z_INDEXES[i % FLY_Z_INDEXES.length])) * 0.12)
      const flyMaxDuration = Math.max(...durations)

      // Build tweens starting at time 0
      items.forEach((el, i) => {
        const { top, left } = FLY_POSITIONS[i % FLY_POSITIONS.length]
        const leftPct = parseFloat(String(left).replace('%', ''))
        const topPct = parseFloat(String(top).replace('%', ''))
        const xOut = leftPct < 50 ? -800 : 800
        const yOut = topPct < 50 ? -300 : 300

        const zLayer = FLY_Z_INDEXES[i % FLY_Z_INDEXES.length]
        const startOffsetZ = FLY_START_Z_OFFSETS[i % FLY_START_Z_OFFSETS.length]
        const zIn = -1400 + startOffsetZ - (maxZLayer - zLayer) * 40
        const zOut = 1600
        const duration = 0.9 + (maxZLayer - zLayer) * 0.12

        tl.fromTo(
          el,
          { z: zIn, x: 0, y: 0 },
          { z: zOut, x: xOut, y: yOut, force3D: true, duration, ease: 'none' },
          0
        )
      })

      // Pad to ensure timeline length covers the max duration of Fly
      tl.to({}, { duration: flyMaxDuration }, 0)

      return { flyMaxDuration }
    }

    // If Fly items already present, compose now and then add Zoom segment
    const { flyMaxDuration } = composeFlySegment()

    // Place Zoom segment start at ~20% of Fly segment for earliest overlap
    const zoomStart = flyMaxDuration > 0 ? flyMaxDuration * 0.20 : 0

    // Reset any stale transforms and assert percent-based centering before animating
    gsap.set(img, { clearProps: 'transform' })
    gsap.set(img, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      overwrite: 'auto'
    })

    // 1. Image scaling animation (Zoom segment)
    tl.to(img, {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      overwrite: 'auto',
      force3D: true, // Hardware acceleration
      zIndex: 1000,
      // Mobile: slower to match Fly.jsx feel, Desktop: original duration
      duration: isHandheldForPin 
        ? (responsiveValues.isLargeMobile ? 0.95 : 0.85)
        : 2.5, // Desktop keeps original
      // Mobile: power1.inOut for Fly.jsx feel, Desktop: original ease
      ease: isHandheldForPin ? 'power1.inOut' : 'sine.inOut'
    }, zoomStart)

    // 2. Text movement animation (synchronized with image scaling)
    tl.to(left, {
      x: -responsiveValues.offScreenDistance,
      // Mobile: slower to match Fly.jsx feel, Desktop: original duration
      duration: isHandheldForPin 
        ? (responsiveValues.isLargeMobile ? 0.95 : 0.85)
        : 2.5, // Desktop keeps original
      // Mobile: power1.inOut for Fly.jsx feel, Desktop: original ease
      ease: isHandheldForPin ? 'power1.inOut' : 'sine.inOut',
      force3D: true // Hardware acceleration
    }, zoomStart)
    .to(right, {
      x: responsiveValues.offScreenDistance,
      // Mobile: slower to match Fly.jsx feel, Desktop: original duration
      duration: isHandheldForPin 
        ? (responsiveValues.isLargeMobile ? 0.95 : 0.85)
        : 2.5, // Desktop keeps original
      // Mobile: power1.inOut for Fly.jsx feel, Desktop: original ease
      ease: isHandheldForPin ? 'power1.inOut' : 'sine.inOut',
      force3D: true // Hardware acceleration
    }, zoomStart)

    // Add extra scroll-only padding after zoom completes (no visual change)
    // Mobile: reduced padding for faster transition, Desktop: original padding
    .to({}, { duration: isHandheldForPin ? 0.05 : config.postZoomScrollPad })

    return () => {
      if (tl) tl.kill()
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }
    }
  }, [config.postZoomScrollPad])

  // When Fly items mount later, attach them to the master timeline
  useEffect(() => {
    if (!masterTlRef.current || !flyItemsRef.current) return
    // Clear any previously added placeholder padding at 0 if needed is complex; we rely on idempotence by not re-adding twice.
    // No-op here because we already composed in the main effect if items were present.
  }, [])

  // Animate nav overlay and menu appearance/disappearance smoothly - optimized for mobile
  useEffect(() => {
    const overlay = navOverlayRef.current
    const inner = navInnerRef.current
    if (!overlay) return
    
    const responsiveValues = getResponsiveValues()
    
    if (showNav) {
      gsap.set(overlay, { pointerEvents: 'auto' })
      gsap.fromTo(overlay, 
        { opacity: 0 }, 
        { 
          opacity: 1, 
          duration: responsiveValues.isLargeMobile ? 0.8 : 0.6, 
          ease: 'power2.out',
          force3D: true
        }
      )
      if (inner) {
        gsap.fromTo(inner, 
          { autoAlpha: 0, y: responsiveValues.isLargeMobile ? 12 : 16, scale: 0.98 }, 
          { 
            autoAlpha: 1, 
            y: 0, 
            scale: 1, 
            duration: responsiveValues.isLargeMobile ? 0.8 : 0.6, 
            ease: 'power2.out',
            force3D: true
          }
        )
      }
    } else {
      gsap.to(overlay, { 
        opacity: 0, 
        duration: responsiveValues.isLargeMobile ? 0.5 : 0.4, 
        ease: 'power2.in', 
        force3D: true,
        onComplete: () => gsap.set(overlay, { pointerEvents: 'none' }) 
      })
      if (inner) {
        gsap.to(inner, { 
          autoAlpha: 0, 
          y: responsiveValues.isLargeMobile ? 8 : 10, 
          scale: 0.99, 
          duration: responsiveValues.isLargeMobile ? 0.5 : 0.4, 
          ease: 'power2.in',
          force3D: true
        })
      }
    }
  }, [showNav])

  // Slide-up page that appears after nav menu
  useEffect(() => {
    const slide = postNavSlideRef.current
    if (!slide) return
    // Ensure starting position is off-screen
    gsap.set(slide, { yPercent: 100 })
  }, [])

  // Arm slide-up to appear only AFTER nav finishes animating AND on next scroll
  useEffect(() => {
    const slide = postNavSlideRef.current
    if (!slide) return

    // Clean up existing listeners
    const cleanupListeners = () => {
      if (eventListenersRef.current.wheel) {
        window.removeEventListener('wheel', eventListenersRef.current.wheel, { passive: true })
        eventListenersRef.current.wheel = null
      }
      if (eventListenersRef.current.touchstart) {
        window.removeEventListener('touchstart', eventListenersRef.current.touchstart, { passive: true })
        eventListenersRef.current.touchstart = null
      }
    }

    if (showNav && !isExitingNav) {
      // Wait for nav fade/entrance (~0.6s), then arm the listener
      const armTimeout = setTimeout(() => {
        slideArmedRef.current = true
        
        const onWheel = (e) => {
          if (!slideArmedRef.current) return
          if (e.deltaY > 0) {
            slideArmedRef.current = false
            const responsiveValues = getResponsiveValues()
            
            // Only animate footer slide up if we're past the zoom reveal section
            // Check if we've scrolled past the zoom reveal (which is at 300vh from top)
            const zoomRevealEnd = window.innerHeight * 3 // 300vh in pixels
            const currentScroll = window.scrollY
            
            if (currentScroll >= zoomRevealEnd) {
              // Animate footer slide up and clamp to viewport bottom
              gsap.set(slide, { position: 'fixed', left: 0, right: 0, bottom: 0 })
              gsap.to(slide, { 
                yPercent: 0, 
                duration: responsiveValues.isLargeMobile ? 1.0 : 0.8, 
                ease: 'power2.out',
                force3D: true,
                onUpdate: () => {
                  const y = Number(gsap.getProperty(slide, 'yPercent')) || 0
                  if (y < 0) gsap.set(slide, { yPercent: 0 })
                },
                onComplete: () => {
                  gsap.set(slide, { yPercent: 0 })
                }
              })
              
              // Add blur overlay animation
              if (blurOverlayRef.current) {
                gsap.to(blurOverlayRef.current, {
                  opacity: 1,
                  backdropFilter: 'blur(8px)',
                  duration: responsiveValues.isLargeMobile ? 1.0 : 0.8,
                  ease: 'power2.out'
                })
              }
            }
            
            cleanupListeners()
          }
        }
        
        const onTouchStart = () => {
          if (!slideArmedRef.current) return
          slideArmedRef.current = false
          const responsiveValues = getResponsiveValues()
          
          // Only animate footer slide up if we're past the zoom reveal section
          // Check if we've scrolled past the zoom reveal (which is at 300vh from top)
          const zoomRevealEnd = window.innerHeight * 3 // 300vh in pixels
          const currentScroll = window.scrollY
          
          if (currentScroll >= zoomRevealEnd) {
            // Animate footer slide up and clamp to viewport bottom
            gsap.set(slide, { position: 'fixed', left: 0, right: 0, bottom: 0 })
            gsap.to(slide, { 
              yPercent: 0, 
              duration: responsiveValues.isLargeMobile ? 1.0 : 0.8, 
              ease: 'power2.out',
              force3D: true,
              onUpdate: () => {
                const y = Number(gsap.getProperty(slide, 'yPercent')) || 0
                if (y < 0) gsap.set(slide, { yPercent: 0 })
              },
              onComplete: () => {
                gsap.set(slide, { yPercent: 0 })
              }
            })
            
            // Add blur overlay animation
            if (blurOverlayRef.current) {
              gsap.to(blurOverlayRef.current, {
                opacity: 1,
                backdropFilter: 'blur(8px)',
                duration: responsiveValues.isLargeMobile ? 1.0 : 0.8,
                ease: 'power2.out'
              })
            }
          }
          
          cleanupListeners()
        }

        // Store references for cleanup
        eventListenersRef.current.wheel = onWheel
        eventListenersRef.current.touchstart = onTouchStart
        
        window.addEventListener('wheel', onWheel, { passive: true })
        window.addEventListener('touchstart', onTouchStart, { passive: true })
      }, 1600)
      
      return () => {
        clearTimeout(armTimeout)
        slideArmedRef.current = false
        cleanupListeners()
      }
    }

    if (isExitingNav) {
      slideArmedRef.current = false
      const responsiveValues = getResponsiveValues()
      
      // Animate footer slide down and restore absolute positioning
      gsap.to(slide, { 
        yPercent: 100, 
        duration: responsiveValues.isLargeMobile ? 0.7 : 0.6, 
        ease: 'power2.in',
        force3D: true,
        onComplete: () => {
          gsap.set(slide, { position: 'absolute', left: 0, right: 0, bottom: 0 })
        }
      })
      
      // Remove blur overlay animation
      if (blurOverlayRef.current) {
        gsap.to(blurOverlayRef.current, {
          opacity: 0,
          backdropFilter: 'blur(0px)',
          duration: responsiveValues.isLargeMobile ? 0.7 : 0.6,
          ease: 'power2.in'
        })
      }
    }

    return () => {
      slideArmedRef.current = false
      cleanupListeners()
    }
  }, [showNav, isExitingNav])

  // Cleanup pending timers on unmount
  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current)
      if (navExitTimeoutRef.current) clearTimeout(navExitTimeoutRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%', background: '#ede9e4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        {/* Fly images behind the zoomed image */}
        <Fly
          controlled
          onItemsReady={(items) => { flyItemsRef.current = items; if (masterTlRef.current) { /* main effect composes it */ } }}
          containerStyle={{ position: 'absolute', inset: 0 }}
          zIndex={100}
        />
        {imageError ? (
          <div 
            style={{ 
              width: '100vw', 
              height: '100vh', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 500
            }}
            role="img"
            aria-label="Fallback background for zoom reveal"
          >
            <div style={{ color: 'white', fontSize: '2rem', textAlign: 'center' }}>
              Image failed to load
            </div>
          </div>
        ) : (
          <img
            ref={imageRef}
            src={imageSrc}
            alt={`${leftText} ${rightText} - Interactive zoom reveal image`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ 
              width: imageLoaded ? '0.1px' : '100%', 
              height: imageLoaded ? '0.05px' : '100%', 
              objectFit: 'cover', 
              pointerEvents: 'none', 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transformOrigin: 'center center', 
              zIndex: 500,
              opacity: imageLoaded ? 1 : 0.8,
              transition: 'opacity 0.3s ease'
            }}
          />
        )}
        <div 
          ref={leftTextRef} 
          style={{ 
            position: 'absolute', 
            right: `calc(50% + 0.01px + ${getResponsiveValues().isMobile ? '5px' : '15.5px'})`, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'black', 
            fontSize: getResponsiveValues().fontSize, 
            fontFamily: 'Helvetica, Arial, sans-serif', 
            fontWeight: '400', 
            wordWrap: 'break-word', 
            zIndex: 60, 
            textAlign: 'right'
          }}
        >
          {leftText}
        </div>
        <div 
          ref={rightTextRef} 
          style={{ 
            position: 'absolute', 
            left: `calc(50% + 0.01px + ${getResponsiveValues().isMobile ? '2px' : '4.5px'})`, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'black', 
            fontSize: getResponsiveValues().fontSize, 
            fontFamily: 'Helvetica, Arial, sans-serif', 
            fontWeight: '400', 
            wordWrap: 'break-word', 
            zIndex: 60, 
            textAlign: 'left'
          }}
        >
          {rightText}
        </div>
      </div>
      <div
        ref={navOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1000, // Lower z-index to stay below footer
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(237, 233, 228, 0.1)', // Subtle beige overlay
          backdropFilter: 'blur(1px)', // Subtle blur effect
          WebkitBackdropFilter: 'blur(1px)',
          opacity: 0,
          pointerEvents: 'none'
        }}
      >
        <div ref={navInnerRef} style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 10001 // Above footer and StaggeredMenu
        }}>
          {(showNav || isExitingNav) && <NavigationMenu isExiting={isExitingNav} />}
        </div>
      </div>

      {/* Blur overlay that sits above nav but below footer */}
      <div
        ref={blurOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2000, // Above nav (1000) but below footer (3000)
          opacity: 0,
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
          pointerEvents: 'none',
          transition: 'opacity 0.1s ease, backdrop-filter 0.1s ease'
        }}
      />

      {/* Footer section - now self-contained with its own video background */}
      <div
        ref={postNavSlideRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: isMobile ? FOOTER_HEIGHT_MOBILE : FOOTER_HEIGHT_DESKTOP,
          zIndex: 3000
        }}
      >
        <Footer />
      </div>
    </div>
  )
}

// Reusable hoverable absolute-positioned image with overlay and caption

 const Landing = () => {
  const wireframeRef = useRef(null)
  const slidingRef = useRef(null)
   const slidingAnimRef = useRef(null)
  const [isMenuVisible, setIsMenuVisible] = useState(true)
  const [isMenuSlidingUp, setIsMenuSlidingUp] = useState(false)
  const [isMenuHidden, setIsMenuHidden] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const navVisibilityRef = useRef('visible')
  const [showNavTitle, setShowNavTitle] = useState(false)
  // Initial landing overlay matching RouteTransitionLoader style
  const [showInitialOverlay, setShowInitialOverlay] = useState(true)
  const initialOverlayRef = useRef(null)
  const initialTextRef = useRef(null)
  // Mouse effect removed - page left blank as requested

  // Enhanced mobile/tablet detection for different device sizes
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const aspectRatio = height / width
      
      // More comprehensive mobile detection
      const isMobileWidth = width <= 768
      const isMobileAspectRatio = aspectRatio > 1.3 // Portrait orientation with tall aspect ratio

      // Tablet detection (landscape tablets may have smaller aspect ratios)
      const isTablet = width > 768 && width <= 1024

      setIsMobile((isMobileWidth && isMobileAspectRatio) || isTablet)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Landing shutter preloader removed

  // Smooth scroll + slide-up behavior
  useEffect(() => {
    // Video duration will be set dynamically when video loads

    // Throttle scroll handler to prevent excessive updates on mobile
    let scrollTimeout = null
    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      
      // Throttle scroll events on mobile for better performance
      const isMobile = window.innerWidth <= 768
      const throttleDelay = isMobile ? 16 : 8 // ~60fps on mobile, ~120fps on desktop
      
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.scrollY
        const viewportHeight = window.innerHeight
      
      const slidingSectionStart = viewportHeight
      const newSectionStart = viewportHeight + (isMobile ? viewportHeight * 2.4 : viewportHeight * 3) // New section starts after sliding page + marquee (mobile)
      
      // Calculate new section height in pixels for accurate positioning
      let newSectionHeightPx
      if (isMobile) {
        // Mobile doesn't have the new section, so zoom component starts right after sliding
        newSectionHeightPx = 0
      } else {
        // Desktop - convert 62vh to pixels
        newSectionHeightPx = window.innerHeight * 0.62
      }
      
      const zoomComponentStart = newSectionStart + newSectionHeightPx // Zoom component start position
      

      // Menu visibility synchronized with navbar disappearance
      // Use the exact same trigger point as navbar (Rectangle18.jsx)
      const marqueeSectionStart = isMobile 
        ? viewportHeight + (viewportHeight * 2.4) // Mobile: zoom component starts here (after marquee)
        : viewportHeight + (viewportHeight * 3) // Desktop: Frame60 starts here
      const SHOW_BUFFER = 120 // px before threshold to show (for smooth re-appearance)
      const shouldHide = scrollTop >= marqueeSectionStart // Same as navbar - no delay
      const shouldShow = scrollTop <= (marqueeSectionStart - SHOW_BUFFER)

      // Only update navigation state if there's an actual change to prevent unnecessary re-renders
      if (navVisibilityRef.current === 'visible' && shouldHide) {
        // Begin smooth slide-up, then hide after the animation duration (match navbar ~600ms)
        navVisibilityRef.current = 'hiding'
        setIsMenuSlidingUp(true)
        setTimeout(() => {
          setIsMenuVisible(false)
          setIsMenuHidden(true)
          setIsMenuSlidingUp(false)
          navVisibilityRef.current = 'hidden'
        }, 600)
      } else if (navVisibilityRef.current === 'hidden' && shouldShow) {
        navVisibilityRef.current = 'showing'
        setIsMenuVisible(true)
        setIsMenuSlidingUp(false)
        setIsMenuHidden(false)
        // settle state
        setTimeout(() => {
          navVisibilityRef.current = 'visible'
        }, 300)
      }

      // Update nav title visibility exactly when sliding section's top hits viewport top
      if (slidingRef.current) {
        const top = slidingRef.current.getBoundingClientRect().top
        setShowNavTitle(top <= 0)
      }
      }, throttleDelay) // Close the setTimeout
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    // Initialize on mount
    handleScroll()


    // Loading screen functionality removed

    // Start with internal preloader settled: show sliding section immediately without pull-up
    if (wireframeRef.current && slidingRef.current) {
      gsap.set(slidingRef.current, { yPercent: 0, willChange: 'transform', force3D: true, transform: 'translate3d(0,0,0)' })
      // Keep reference null since no intro animation is created
      slidingAnimRef.current = null
    }

    // Remove text animation and references – placeholder reserved for future

    // Ensure positions are recalculated after timelines are set up
    // Use requestAnimationFrame for better timing on mobile
    const refreshScrollTriggers = () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        // Force a second refresh on mobile to ensure proper pinning
        if (window.innerWidth <= 768) {
          requestAnimationFrame(() => ScrollTrigger.refresh())
        }
      })
    }
    refreshScrollTriggers()

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [])

  // Initial full-screen overlay styled like RouteTransitionLoader
  useEffect(() => {
    if (!showInitialOverlay) return
    const el = initialOverlayRef.current
    const textEl = initialTextRef.current
    if (!el) return
    // Start fully visible (covered), match RouteTransitionLoader text entrance
    gsap.set(el, { yPercent: 0, pointerEvents: 'auto' })
    if (textEl) {
      gsap.set(textEl, { opacity: 0, y: 20 })
      gsap.to(textEl, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 })
    }
    const MIN_TEXT_DISPLAY_DURATION = 1.5
    const COVER_OUT_DURATION = 0.9
    const EASE_OUT = 'power4.in'
    const timeoutId = setTimeout(() => {
      if (textEl) {
        gsap.to(textEl, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' })
      }
      gsap.to(el, {
        yPercent: -100,
        duration: COVER_OUT_DURATION,
        ease: EASE_OUT,
        delay: 0.2,
        onComplete: () => {
          gsap.set(el, { yPercent: 100, pointerEvents: 'none' })
          if (textEl) gsap.set(textEl, { opacity: 0, y: 20 })
          setShowInitialOverlay(false)
        }
      })
    }, MIN_TEXT_DISPLAY_DURATION * 1000)
    return () => clearTimeout(timeoutId)
  }, [showInitialOverlay])

  // Sliding height: desktop 300vh, mobile/tablet 200vh
  const getSlidingHeight = () => {
    const vw = window.innerWidth
    const isHandheld = vw <= 1024
    if (!isHandheld) return '300vh' // desktop: 300vh

    // Handheld (mobile/tablet) – 200vh
    return '200vh' // mobile: 200vh
  }
  
  const SLIDING_HEIGHT = getSlidingHeight()


  // Responsive section height for different mobile device sizes
  const getNewSectionHeight = () => {
    if (!isMobile) return '62vh' // Desktop unchanged
    
    const vh = window.innerHeight
    const vw = window.innerWidth
    
    // For larger mobile devices (like Galaxy S24 FE 6.7"), use fixed pixel height
    // to prevent gaps and animation issues
    if (vw >= 400 && vh >= 900) {
      // Large mobile devices - use calculated pixel height instead of vh
      return `${Math.max(600, vh * 0.8)}px` // 80% of viewport height, minimum 600px
    } else if (vw >= 375 && vh >= 800) {
      // Medium mobile devices
      return `${Math.max(500, vh * 0.7)}px` // 70% of viewport height, minimum 500px
    } else {
      // Small mobile devices - keep vh units as they work fine
      return '62vh'
    }
  }
  
  const NEW_SECTION_HEIGHT = getNewSectionHeight()
  
  // Calculate total page height more accurately for mobile devices
  const getTotalPageHeight = () => {
    if (!isMobile) {
      // Desktop: 100vh (hero) + 300vh (sliding) + 62vh (new section) = 462vh
      return `calc(100vh + ${SLIDING_HEIGHT} + 62vh)`
    }
    
    // Mobile: 100vh (hero) + 200vh (sliding) + 40vh (marquee) + 100vh (zoom reveal) + footer height
    // No extra spacer so there is no scroll past the footer
    return `calc(100vh + ${SLIDING_HEIGHT} + 40vh + 100vh + ${FOOTER_HEIGHT_MOBILE})`
  }

  return (
    <div className="landing" style={{ width: '100%', height: getTotalPageHeight() }}>
      {showInitialOverlay && (
        <div
          ref={initialOverlayRef}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            height: '100vh',
            background: '#F2EAE0',
            zIndex: 100000,
            transform: 'translateZ(0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-hidden="true"
        >
          <div
            ref={initialTextRef}
            style={{
              color: '#333',
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontFamily: "'PP Editorial New'",
              fontWeight: 200,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              textAlign: 'center',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              opacity: 1
            }}
          >
            Home
          </div>
        </div>
      )}
      {/* Top Navigation Bar */}
      <Rectangle18 
        isVisible={isMenuVisible}
        isSlidingUp={isMenuSlidingUp}
        showText={showNavTitle}
      />
      
      
      {/* Mobile title overlay removed as requested */}

      {/* All loading screens removed */}
      {/* First landing page section with video background - fixed at 100vh */}
      <VideoBackground wireframeRef={wireframeRef} isMobile={isMobile} startSubtitle={!showInitialOverlay} />

      {/* Sliding page content - positioned after 100vh */}
      <div
        ref={slidingRef}
        style={{
          position: 'absolute',
          top: '100vh',
          left: 0,
          right: 0,
          height: isMobile ? SLIDING_HEIGHT : '300vh',
          background: 'transparent',
          zIndex: 999,
          overflow: 'visible', // Changed from hidden to visible for parallax
          isolation: 'isolate'
        }}
      >
        {isMobile ? <MobileSlidingFrame /> : <MergedFrame />}
      </div>

      {/* New Content Section - only for desktop/tablet; hidden on mobile */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            top: `calc(100vh + ${SLIDING_HEIGHT})`,
            left: 0,
            right: 0,
            height: NEW_SECTION_HEIGHT,
            background: 'transparent',
            zIndex: 998,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
            padding: 0,
            minHeight: '50vh',
            overflow: 'hidden'
          }}
        >
          {/* Transparent gradient overlay removed to show video background */}
          
          {/* Content wrapper */}
          <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Frame60 />
          </div>
        </div>
      )}

      {/* Mobile Marquee Section - only for mobile, positioned after mobile frame 2 */}
      {isMobile && (
        <div
          style={{
            position: 'absolute',
            top: `calc(100vh + ${SLIDING_HEIGHT})`,
            left: 0,
            right: 0,
            height: '40vh',
            background: '#000000',
            zIndex: 997
          }}
        >
          <MobileMarquee />
        </div>
      )}

      {/* ZoomReveal placed after sliding (mobile) or after new section (desktop/tablet) */}
      <div
        style={{
          position: 'absolute',
          top: isMobile 
            ? `calc(100vh + ${SLIDING_HEIGHT} + 40vh)`
            : `calc(100vh + ${SLIDING_HEIGHT} + ${NEW_SECTION_HEIGHT})`,
          left: 0,
          right: 0,
          height: '100vh',
          background: '#ede9e4',
          zIndex: 998
        }}
      >
        <ZoomReveal imageSrc="/assets/mobile/images/zoom-reveal/zoom-reveal.webp" />
      </div>

      {/* No extra spacer on mobile to prevent scrolling past the footer */}
    </div>
  )
}

export default Landing


