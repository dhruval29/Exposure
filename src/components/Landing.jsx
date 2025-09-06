import React, { useRef, useState, useEffect } from 'react'
import MouseMouse from './MouseMouse'
import Rectangle18 from './Rectangle18'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

import Lenis from '@studio-freight/lenis'
import NavigationMenu from './NavigationMenu'
import StorytellingHero from './StorytellingHero'
import Frame36 from './Frame36'
import HoverImage from './HoverImage'
import StaggeredMenu from './StaggeredMenu'
import useLightweightMouseEffect from '../hooks/useLightweightMouseEffect'
import { responsiveImagePositions } from '../utils/positionConverter'


// Inline ZoomReveal so Landing is self-contained
const DEFAULT_ZR_CONFIG = {
  triggerStart: 'top top', // begin only when section is fully reached
  triggerEnd: '+=55%',
  scrub: 2, // 2 = slower scroll; higher = faster, lower = smoother
  zoomDuration: 2.5,
  textDuration: 2.5,
  textLead: 0, // seconds text starts before image (negative to start after)
  navDelayMs: 500,
  postZoomScrollPad: 0.3,
  ease: 'power2.inOut',
  markers: false,
  pin: true,
  pinSpacing: true
}

const ZoomReveal = ({ imageSrc = '/assets/images/ui/zoom-reveal.webp', leftText = 'Take a closer', rightText = 'look at Life', config = DEFAULT_ZR_CONFIG }) => {
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

  // Image load handler
  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  // Get responsive values
  const getResponsiveValues = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const fontSize = Math.min(vw * 0.05, vh * 0.08, 66.7) // Responsive font size
    
    return {
      vw,
      vh,
      fontSize,
      offScreenDistance: vw * 0.6 // Reduced from 1.2 to 0.6 (50% less distance)
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
        end: '+=75%',
        scrub: 2,
        pin: true,
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

    // Store ScrollTrigger reference for proper cleanup
    scrollTriggerRef.current = tl.scrollTrigger

    gsap.set([left, right], { zIndex: 5000, opacity: 1, x: 0 })

    // 1. Image scaling animation
    tl.to(img, {
      width: '100vw',
      height: '100vh',
      x: 0,
      y: 0,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000, // Bottom layer
      duration: 1,
      ease: 'power2.inOut'
    }, 0)

    // 2. Text movement animation (synchronized with image scaling in real-time)
    tl.to(left, {
      x: -responsiveValues.offScreenDistance, // Move off-screen as image scales
      duration: 1, // Same duration as image scaling
      ease: 'power2.inOut'
    }, 0) // Start at the same time as image scaling
    .to(right, {
      x: responsiveValues.offScreenDistance, // Move off-screen as image scales
      duration: 1, // Same duration as image scaling
      ease: 'power2.inOut'
    }, 0) // Start at the same time as image scaling

    // Add extra scroll-only padding after zoom completes (no visual change)
    .to({}, { duration: config.postZoomScrollPad })

    return () => {
      if (tl) tl.kill()
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }
    }
  }, [config.postZoomScrollPad])

  // Animate nav overlay and menu appearance/disappearance smoothly
  useEffect(() => {
    const overlay = navOverlayRef.current
    const inner = navInnerRef.current
    if (!overlay) return
    if (showNav) {
      gsap.set(overlay, { pointerEvents: 'auto' })
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' })
      if (inner) {
        gsap.fromTo(inner, { autoAlpha: 0, y: 16, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' })
      }
    } else {
      gsap.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: () => gsap.set(overlay, { pointerEvents: 'none' }) })
      if (inner) {
        gsap.to(inner, { autoAlpha: 0, y: 10, scale: 0.99, duration: 0.4, ease: 'power2.in' })
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
            gsap.to(slide, { yPercent: 0, duration: 0.8, ease: 'power2.out' })
            cleanupListeners()
          }
        }
        
        const onTouchStart = () => {
          if (!slideArmedRef.current) return
          slideArmedRef.current = false
          gsap.to(slide, { yPercent: 0, duration: 0.8, ease: 'power2.out' })
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
      gsap.to(slide, { yPercent: 100, duration: 0.6, ease: 'power2.in' })
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
      style={{ position: 'relative', width: '100%', height: '100%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
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
              width: imageLoaded ? '0.1px' : '100vw', 
              height: imageLoaded ? '0.05px' : '100vh', 
              objectFit: 'cover', 
              pointerEvents: 'none', 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
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
            right: 'calc(50% + 10px)', 
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
            left: 'calc(50% + 10px)', 
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
          zIndex: 2000, // Middle layer - texture overlay
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)', // Subtle white overlay
          backdropFilter: 'blur(1px) saturate(110%)', // Subtle blur effect
          WebkitBackdropFilter: 'blur(1px) saturate(110%)',
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
          zIndex: 2001 // Top layer - navigation menu
        }}>
          {(showNav || isExitingNav) && <NavigationMenu isExiting={isExitingNav} />}
        </div>
      </div>

      {/* Slide-up page that appears after the nav menu */}
      <div
        ref={postNavSlideRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3000,
          background: 'transparent',
          border: '1px solid rgba(0,0,0,0.15)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 -12px 40px rgba(0,0,0,0.06)'
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none', filter: 'blur(2px) saturate(105%) brightness(0.98)', transform: 'scale(1.02)' }}
          src="/1409899-uhd_3840_2160_25fps (1) (1) (1).mp4"
        />
        {/* Faint overlay to improve contrast over the video */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.08)',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Frame36 />
        </div>
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
  const [showMouseOverlay, setShowMouseOverlay] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [isMenuVisible, setIsMenuVisible] = useState(true)
  const [isMenuSlidingUp, setIsMenuSlidingUp] = useState(false)
  const [isMenuHidden, setIsMenuHidden] = useState(false)
  // Mouse effect removed - page left blank as requested

  // Smooth scroll + slide-up behavior
  useEffect(() => {
    // Video duration will be set dynamically when video loads

    // Additional scroll listener to ensure MouseMouse visibility works in both directions
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const viewportHeight = window.innerHeight
      const slidingHeight = 2768
      
      // Show MouseMouse when we're in the sliding section (after 100vh, before zoom component)
      const slidingSectionStart = viewportHeight
      const zoomComponentStart = viewportHeight + 2768 // Zoom component start position (100vh + sliding height)
      
      if (scrollTop >= slidingSectionStart && scrollTop < zoomComponentStart) {
        setShowMouseOverlay(true)
      } else if (scrollTop < slidingSectionStart) {
        // Before sliding section - show MouseMouse
        setShowMouseOverlay(true)
      } else {
        // After zoom component - hide MouseMouse
        setShowMouseOverlay(false)
      }

      // Menu visibility behavior (same as nav bar)
      if (scrollTop >= zoomComponentStart) {
        setIsMenuSlidingUp(true)
        // Hide completely after slide animation
        setTimeout(() => {
          setIsMenuVisible(false)
          setIsMenuHidden(true)
        }, 600)
      } else {
        // Reset states when scrolling back up
        setIsMenuVisible(true)
        setIsMenuSlidingUp(false)
        setIsMenuHidden(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Temporarily disable Lenis (native scroll)
    const ENABLE_LENIS = false
    if (ENABLE_LENIS) {
      const lenis = new Lenis({ smoothWheel: true, smoothTouch: true, lerp: 0.25, wheelMultiplier: 1.2 })
      lenisRef.current = lenis
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
      requestAnimationFrame(raf)
      lenis.on('scroll', ScrollTrigger.update)
    }

    // Slide the overlay up to reveal Section 2 (placeholder for now)
    if (wireframeRef.current && slidingRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wireframeRef.current,
          start: 'top top',
          end: '+=99%',
          scrub: 4,
          pin: true,
          anticipatePin: 1,
          markers: false,
          onUpdate: () => {
            // Use actual slide position to decide overlay visibility (robust to fast scroll)
            const y = Number(gsap.getProperty(slidingRef.current, 'yPercent')) || 0
            const shouldShow = y > 1 // keep visible until slide fully reaches 0%
            if (shouldShow !== showMouseOverlay) setShowMouseOverlay(shouldShow)
          },
          onLeave: () => setShowMouseOverlay(false),
          onEnterBack: () => setShowMouseOverlay(true)
        }
      })
      gsap.set(slidingRef.current, { yPercent: 100 })
      // Phase 1: slide page from bottom to full screen over the whole timeline
      tl.to(slidingRef.current, { yPercent: 0, ease: 'none', duration: 1 })
      // Sliding page left blank per request
      slidingAnimRef.current = tl
    }

    // Remove text animation and references – placeholder reserved for future

    // Ensure positions are recalculated after timelines are set up
    setTimeout(() => ScrollTrigger.refresh(), 0)

    return () => {
      if (lenisRef.current) lenisRef.current.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const SLIDING_HEIGHT = 2768

  const menuItems = [
    { label: 'Our Journey', ariaLabel: 'Go to our journey page', link: '/' },
    { label: 'Gallery', ariaLabel: 'View our gallery', link: '/gallery' },
    { label: 'Team', ariaLabel: 'Meet our team', link: '/team' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/exposure.explorers_nitg/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/exposure-explorers/' },
    { label: 'YouTube', link: 'https://www.youtube.com/@Exposure-Explorers' }
  ];

  return (
    <div className="landing" style={{ width: '100%', height: `calc(200vh + ${SLIDING_HEIGHT}px)` }}>
      {/* Top Navigation Bar */}
      <Rectangle18 />
      
      {/* StaggeredMenu */}
      {!isMenuHidden && (
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={false}
          menuButtonColor="#000"
          openMenuButtonColor="#000"
          changeMenuColorOnOpen={true}
          colors={['#B19EEF', '#5227FF']}
          logoUrl="/src/assets/logos/reactbits-gh-white.svg"
          accentColor="#ff6b6b"
          onMenuOpen={() => {}}
          onMenuClose={() => {}}
        />
      )}
      
      {/* Loading overlay - video duration */}
      {overlayVisible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5000,
            pointerEvents: 'auto',
            transition: 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            opacity: isLoading ? 1 : 0
          }}
        >
          <video
            ref={(video) => {
              if (video) {
                video.addEventListener('loadedmetadata', () => {
                  const duration = video.duration * 1000 // Convert to milliseconds
                  // Update loading timers based on actual video duration
                  setTimeout(() => setIsLoading(false), duration)
                  setTimeout(() => setOverlayVisible(false), duration + 1000)
                })
              }
            }}
            autoPlay
            muted
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1
            }}
            src="/videos/loading.webm"
          />
        </div>
      )}
      {/* Mouse trail overlay on top of all content */}
      <MouseMouse visible={showMouseOverlay} zIndex={800} />
      {/* Mouse-follow section - fixed at 10vh */}
      <div
        ref={wireframeRef}
        style={{
          width: '100%',
          height: '10vh',
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'transparent',
          overflow: 'hidden',
          perspective: '900px',
          transformStyle: 'preserve-3d',
          zIndex: 0
        }}
      >
        {/* Mouse effect removed - page left blank as requested */}
      </div>

      {/* Sliding page content - positioned after 100vh */}
      <div
        ref={slidingRef}
        style={{
          position: 'absolute',
          top: '100vh',
          left: 0,
          right: 0,
          height: SLIDING_HEIGHT,
          background: 'white',
          zIndex: 999,
          overflow: 'hidden',
          isolation: 'isolate'
        }}
      >
          <div style={{ width: '100%', height: '100%', position: 'relative', background: 'white', overflow: 'hidden' }}>
            {/* Animated gradient background that fades out by first row */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1300px', // Fades out by first row of images
                background: 'linear-gradient(to bottom, #b7bae5 0%, #b7bae5 60%, rgba(183, 186, 229, 0.8) 80%, rgba(183, 186, 229, 0.4) 90%, rgba(183, 186, 229, 0.1) 95%, transparent 100%)',
                zIndex: 1,
                pointerEvents: 'none',
                animation: 'gradientFade 6s ease-in-out infinite',
                opacity: 0.7
              }}
            />
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes gradientFade {
                  0% {
                    opacity: 0.4;
                    transform: translateY(-15px) scale(1.02);
                  }
                  25% {
                    opacity: 0.8;
                    transform: translateY(0px) scale(1);
                  }
                  50% {
                    opacity: 1;
                    transform: translateY(0px) scale(1);
                  }
                  75% {
                    opacity: 0.6;
                    transform: translateY(8px) scale(0.98);
                  }
                  100% {
                    opacity: 0.4;
                    transform: translateY(-15px) scale(1.02);
                  }
                }
              `
            }} />
            <div style={{ 
              left: '6.3vw', 
              top: '6.25vh', 
              position: 'absolute', 
              zIndex: 20
            }}>
              <StorytellingHero />
            </div>
            <HoverImage 
              src="/assets/images/ui/1.webp" 
              style={responsiveImagePositions.image1}
              caption="Sydney Opera House, NSW"
            />
                         <HoverImage 
               src="/assets/images/ui/2.webp" 
               style={responsiveImagePositions.image2}
               caption="Beech WaterFalls, Victoria"
             />
                         <HoverImage 
               src="/assets/images/ui/3.webp" 
               style={responsiveImagePositions.image3}
               caption="Gower Street, Melbourne"
             />
                         <HoverImage 
               src="/assets/images/ui/4.webp" 
               style={responsiveImagePositions.image4}
               caption="Sydney Opera House, NSW"
             />
                         <HoverImage 
               src="/assets/images/ui/5.webp" 
               style={responsiveImagePositions.image5}
               caption="Fitzroy Garden, Melbourne"
             />
                         <HoverImage 
               src="/assets/images/ui/6.webp" 
               style={responsiveImagePositions.image6}
               caption="South Bank, Brisbane"
             />
                         <HoverImage 
               src="/assets/images/ui/7.webp" 
               style={responsiveImagePositions.image7}
               caption="Twelve Apostles, Victoria"
             />
                         <HoverImage 
               src="/assets/images/ui/8.webp" 
               style={responsiveImagePositions.image8}
               caption="Beech Forest, Victoria"
             />
                         <HoverImage 
               src="/assets/images/ui/9.webp" 
               style={responsiveImagePositions.image9}
               caption="Melbourne, Victoria"
             />
                         <HoverImage 
               src="/assets/images/ui/10.webp" 
               style={responsiveImagePositions.image10}
               caption="Fitzroy Garden, Melbourne"
             />
                         <HoverImage 
               src="/assets/images/ui/11.webp" 
               style={responsiveImagePositions.image11}
               caption="Circular Quay, NSW"
             />

                         <HoverImage 
               src="/assets/images/ui/12.webp" 
               style={responsiveImagePositions.image12}
               caption="Gower Street, Melbourne"
             />
                         <HoverImage 
               src="/assets/images/ui/13.webp" 
               style={responsiveImagePositions.image13}
               caption="Melbourne, Victoria"
             />
                         <HoverImage 
               src="/assets/images/ui/14.webp" 
               style={responsiveImagePositions.image14}
               caption="Melbourne, Victoria"
             />
                         <HoverImage 
               src="/assets/images/ui/15.webp" 
               style={responsiveImagePositions.image15}
               caption="Cairns, Queensland"
             />
          </div>
        </div>

        {/* ZoomReveal placed immediately after the dashed sliding section */}
        <div
          style={{
            position: 'absolute',
            top: `calc(100vh + ${SLIDING_HEIGHT}px)`,
            left: 0,
            right: 0,
            height: '100vh',
            background: 'white',
            zIndex: 998
          }}
        >
                     <ZoomReveal imageSrc="/assets/images/ui/zoom-reveal.webp" />
        </div>
    </div>
  )
}

export default Landing


