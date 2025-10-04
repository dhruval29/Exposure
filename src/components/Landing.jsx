import React, { useRef, useState, useEffect } from 'react'
import Rectangle18 from './Rectangle18'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

import Lenis from '@studio-freight/lenis'
import NavigationMenu from './NavigationMenu'
import StorytellingHero from './StorytellingHero'
import Footer from './Footer'
import HoverImage from './HoverImage'
import { responsiveImagePositions } from '../utils/positionConverter'
import Fly, { Z_INDEXES as FLY_Z_INDEXES, POSITIONS as FLY_POSITIONS, START_Z_OFFSETS as FLY_START_Z_OFFSETS } from './Fly'
import IPhone13141 from './IPhone13141'
import MobileSlidingFrame from './MobileSlidingFrame'
import Frame60 from './Frame60'
import MergedFrame from './MergedFrame'
import '../styles/Gallery.css'


// Inline ZoomReveal so Landing is self-contained
const DEFAULT_ZR_CONFIG = {
  triggerStart: 'top top', // begin only when section is fully reached
  triggerEnd: '+=55%',
  scrub: 2, // 2 = slower scroll; higher = faster, lower = smoother
  zoomDuration: 2.5,
  textDuration: 2.5,
  textLead: 0, // seconds text starts before image (negative to start after)
  navDelayMs: 500,
  postZoomScrollPad: 0.15,
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
    
    // Adjust font size for different mobile device sizes
    let baseFontSize = Math.min(vw * 0.05, vh * 0.08, 66.7)
    
    if (isLargeMobile) {
      // For larger mobile devices, use a more conservative scaling
      baseFontSize = Math.min(vw * 0.045, vh * 0.06, 60)
    }
    
    const fontSize = isMobile ? baseFontSize * 1.1 : baseFontSize
    
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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: responsiveValues.isLargeMobile ? '+=135%' : '+=110%', // Normal scroll distance
        scrub: responsiveValues.isLargeMobile ? 1.5 : 2, // Smoother scrub for large mobile
        pin: true,
        markers: false,
        anticipatePin: 1,
        refreshPriority: 1, // Higher priority to ensure this triggers first
        pinSpacing: true, // Ensure proper spacing calculation
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

    // 1. Image scaling animation (Zoom segment) - optimized for mobile
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
      duration: responsiveValues.isLargeMobile ? 1.2 : 1, // Slightly longer for large mobile
      // Gentle initial deceleration
      ease: 'sine.inOut'
    }, zoomStart)

    // 2. Text movement animation (synchronized with image scaling) - optimized for mobile
    tl.to(left, {
      x: -responsiveValues.offScreenDistance,
      duration: responsiveValues.isLargeMobile ? 1.2 : 1,
      // Gentle initial deceleration
      ease: 'sine.inOut',
      force3D: true // Hardware acceleration
    }, zoomStart)
    .to(right, {
      x: responsiveValues.offScreenDistance,
      duration: responsiveValues.isLargeMobile ? 1.2 : 1,
      // Gentle initial deceleration
      ease: 'sine.inOut',
      force3D: true // Hardware acceleration
    }, zoomStart)

    // Add extra scroll-only padding after zoom completes (no visual change)
    .to({}, { duration: config.postZoomScrollPad })

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
              // Animate footer slide up
              gsap.to(slide, { 
                yPercent: 0, 
                duration: responsiveValues.isLargeMobile ? 1.0 : 0.8, 
                ease: 'power2.out',
                force3D: true
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
            // Animate footer slide up
            gsap.to(slide, { 
              yPercent: 0, 
              duration: responsiveValues.isLargeMobile ? 1.0 : 0.8, 
              ease: 'power2.out',
              force3D: true
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
      
      // Animate footer slide down
      gsap.to(slide, { 
        yPercent: 100, 
        duration: responsiveValues.isLargeMobile ? 0.7 : 0.6, 
        ease: 'power2.in',
        force3D: true
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
      style={{ position: 'relative', width: '100%', height: '100%', background: '#ede9e4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
            right: `calc(50% + ${getResponsiveValues().isMobile ? '5px' : '10px'})`, 
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
            left: `calc(50% + ${getResponsiveValues().isMobile ? '5px' : '10px'})`, 
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
          height: '339px',
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
  const lenisRef = useRef(null)
  const slidingAnimRef = useRef(null)
  const [showLoader, setShowLoader] = useState(true)
  const loaderRef = useRef(null)
  const loaderPanelRef = useRef(null)
  const loaderTextRef = useRef(null)
  const [isMenuVisible, setIsMenuVisible] = useState(true)
  const [isMenuSlidingUp, setIsMenuSlidingUp] = useState(false)
  const [isMenuHidden, setIsMenuHidden] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const navVisibilityRef = useRef('visible')
  const [showNavTitle, setShowNavTitle] = useState(false)
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

  // Intro shutter loader
  useEffect(() => {
    if (!showLoader) return
    const wrapper = loaderRef.current
    const panel = loaderPanelRef.current
    const text = loaderTextRef.current
    if (!wrapper || !panel || !text) return

    // Prepare positions
    gsap.set(panel, { height: '100vh' })
    gsap.set(text, { autoAlpha: 1, y: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
    tl.to(text, { autoAlpha: 1, duration: 0.2 })
      .add('reveal')
      .to(panel, { height: 0, duration: 2.0, ease: 'power4.inOut' }, 'reveal')
      .to(text, { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 'reveal+=0.3')
      .set(wrapper, { pointerEvents: 'none', display: 'none' })
      .add(() => setShowLoader(false))

    return () => { tl.kill() }
  }, [showLoader])

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
      const newSectionStart = viewportHeight + (isMobile ? viewportHeight * 2 : viewportHeight * 3) // New section starts after sliding page
      
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
        ? viewportHeight + (viewportHeight * 2) // Mobile: zoom component starts here
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

    // Temporarily disable Lenis (native scroll)
    const ENABLE_LENIS = false
    if (ENABLE_LENIS) {
      const lenis = new Lenis({ smoothWheel: true, smoothTouch: true, lerp: 0.25, wheelMultiplier: 1.2 })
      lenisRef.current = lenis
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
      requestAnimationFrame(raf)
      lenis.on('scroll', ScrollTrigger.update)
    }

    // Loading screen functionality removed

    // Slide the overlay up to reveal Section 2 (placeholder for now)
    if (wireframeRef.current && slidingRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wireframeRef.current,
          start: 'top top',
          end: '+=30%', // Slightly more scroll distance to reduce flashing
          scrub: (window.innerWidth >= 400 && window.innerHeight >= 900) ? 1.5 : 2, // Match ZoomReveal feel
          pin: false, // Don't pin the video section - keep it fixed
          markers: false,
          refreshPriority: 0, // Lower priority than zoom reveal
          onUpdate: () => {
            // Hysteresis thresholds to prevent rapid toggling around 0
            const y = Number(gsap.getProperty(slidingRef.current, 'yPercent')) || 0
          },
          onLeave: () => {},
          onEnterBack: () => {}
        }
      })
      gsap.set(slidingRef.current, { yPercent: 100, willChange: 'transform', force3D: true, transform: 'translate3d(0,0,0)' })
      // Phase 1: slide page from bottom to full screen with deceleration as it approaches the top
      tl.to(slidingRef.current, { 
        yPercent: 0, 
        ease: 'none',
        duration: 1, 
        force3D: true 
      })
      // Sliding page left blank per request
      slidingAnimRef.current = tl
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
      if (lenisRef.current) lenisRef.current.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [])

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
    
    // Mobile: 100vh (hero) + 200vh (blank sliding) + 100vh (zoom reveal) + 200vh (extra scroll for nav transition) + 339px (footer) = 600vh + 339px
    return `calc(100vh + ${SLIDING_HEIGHT} + 100vh + 200vh + 339px)`
  }

  return (
    <div className="landing" style={{ width: '100%', height: getTotalPageHeight() }}>
      {/* Shutter Loader Overlay */}
      {showLoader && (
        <div
          ref={loaderRef}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            overflow: 'hidden',
            pointerEvents: 'auto'
          }}
        >
          <div
            ref={loaderPanelRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100vh',
              background: '#ede9e4',
              transformOrigin: 'top center'
            }}
          />
          <div
            ref={loaderTextRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#000',
              fontSize: 'clamp(32px, 6.67vw, 96px)',
              fontFamily: "'PP Editorial New', Helvetica, Arial, sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: '97%',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            <p style={{ margin: 0 }}>EXPOSURE </p>
            <p style={{ margin: 0 }}>EXPLORERS</p>
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
          <source src="/videos/1093650-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
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
            background: '#ede9e4',
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
          {/* Animated gradient overlay, similar to sliding page */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, #ede9e4 0%, #ede9e4 60%, rgba(237, 233, 228, 0.8) 80%, rgba(237, 233, 228, 0.4) 90%, rgba(237, 233, 228, 0.1) 95%, transparent 100%)',
              zIndex: 0,
              pointerEvents: 'none',
              opacity: 0.7
            }}
          />
          
          {/* Content wrapper above gradient */}
          <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Frame60 />
          </div>
        </div>
      )}

      {/* ZoomReveal placed after sliding (mobile) or after new section (desktop/tablet) */}
      <div
        style={{
          position: 'absolute',
          top: isMobile 
            ? `calc(100vh + ${SLIDING_HEIGHT})`
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

      {/* Extra scroll spacer for mobile - provides additional scroll space after zoom reveal */}
      {isMobile && (
        <div
          style={{
            position: 'absolute',
            top: `calc(100vh + ${SLIDING_HEIGHT} + 100vh)`,
            left: 0,
            right: 0,
            height: '200vh',
            background: '#ede9e4',
            zIndex: 997
          }}
        />
      )}
    </div>
  )
}

export default Landing


