import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { useMouseEffect } from './MouseEffectPage/useMouseEffect'
import NavigationMenu from './NavigationMenu'
import WeUseThePowerOfStorytellingToFireTheImaginationStirTheSoulAndUltimatelyInspirePeople from './WeUseThePowerOfStorytellingToFireTheImaginationStirTheSoulAndUltimatelyInspirePeople'
import Frame36 from './Frame36'
// Note: Scroll/Lenis removed per request for a static wireframe

// Wireframe assets removed (rectangles were deleted as requested)

// Inline ZoomReveal so Landing is self-contained
const DEFAULT_ZR_CONFIG = {
  triggerStart: 'top top', // begin only when section is fully reached
  triggerEnd: '+=220%',
  scrub: 1, // 1 = follow scroll; higher = faster, lower = smoother
  zoomDuration: 2.5,
  textDuration: 2.5,
  textLead: 0, // seconds text starts before image (negative to start after)
  navDelayMs: 500,
  postZoomScrollPad: 1.2,
  ease: 'power2.inOut',
  markers: false,
  pin: true,
  pinSpacing: true
}

const ZoomReveal = ({ imageSrc = '/1221.png', leftText = 'Take a closer', rightText = 'look at Life', config = DEFAULT_ZR_CONFIG }) => {
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

  useEffect(() => {
    const container = containerRef.current
    const img = imageRef.current
    const left = leftTextRef.current
    const right = rightTextRef.current
    if (!container || !img || !left || !right) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: config.triggerStart,
        end: config.triggerEnd,
        scrub: config.scrub,
        markers: config.markers,
        pin: config.pin,
        pinSpacing: config.pinSpacing,
        anticipatePin: 1,
        onLeave: () => {
          if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current)
          if (navExitTimeoutRef.current) { clearTimeout(navExitTimeoutRef.current); navExitTimeoutRef.current = null }
          setIsExitingNav(false)
          setShowNav(true)
        },
        onEnterBack: () => {
          if (navTimeoutRef.current) { clearTimeout(navTimeoutRef.current); navTimeoutRef.current = null }
          if (navExitTimeoutRef.current) { clearTimeout(navExitTimeoutRef.current); navExitTimeoutRef.current = null }
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

    gsap.set([left, right], { zIndex: 5000, opacity: 1, x: 0 })

    tl.to(img, {
      width: '100vw',
      height: '100vh',
      x: 0,
      y: 0,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      duration: config.zoomDuration,
      ease: config.ease
    }, 'zoomStart')
    .to(left, {
      x: -window.innerWidth * 0.8 + 15,
      duration: config.textDuration,
      ease: 'power2.out'
    }, `zoomStart+=${config.textLead}`)
    .to(right, {
      x: window.innerWidth * 0.8 - 15,
      duration: config.textDuration,
      ease: 'power2.out'
    }, `zoomStart+=${config.textLead}`)
    // Add extra scroll-only padding after zoom completes (no visual change)
    .to({}, { duration: config.postZoomScrollPad })
    // Navigation reveal primarily handled by ScrollTrigger onLeave

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

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

    let removeListeners = () => {}

    if (showNav && !isExitingNav) {
      // Wait for nav fade/entrance (~0.6s), then arm the listener
      const armTimeout = setTimeout(() => {
        slideArmedRef.current = true
        const onWheel = (e) => {
          if (!slideArmedRef.current) return
          if (e.deltaY > 0) {
            slideArmedRef.current = false
            gsap.to(slide, { yPercent: 0, duration: 0.8, ease: 'power2.out' })
            window.removeEventListener('wheel', onWheel, { passive: true })
            window.removeEventListener('touchstart', onTouchStart, { passive: true })
          }
        }
        const onTouchStart = () => {
          if (!slideArmedRef.current) return
          slideArmedRef.current = false
          gsap.to(slide, { yPercent: 0, duration: 0.8, ease: 'power2.out' })
          window.removeEventListener('wheel', onWheel, { passive: true })
          window.removeEventListener('touchstart', onTouchStart, { passive: true })
        }
        window.addEventListener('wheel', onWheel, { passive: true })
        window.addEventListener('touchstart', onTouchStart, { passive: true })
        removeListeners = () => {
          window.removeEventListener('wheel', onWheel, { passive: true })
          window.removeEventListener('touchstart', onTouchStart, { passive: true })
        }
      }, 1600)
      return () => {
        clearTimeout(armTimeout)
        slideArmedRef.current = false
        removeListeners()
      }
    }

    if (isExitingNav) {
      slideArmedRef.current = false
      gsap.to(slide, { yPercent: 100, duration: 0.6, ease: 'power2.in' })
    }

    return () => {
      slideArmedRef.current = false
      removeListeners()
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
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Zoom Reveal"
          style={{ width: '0.1px', height: '0.05px', objectFit: 'cover', pointerEvents: 'none', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', transformOrigin: 'center center', zIndex: 500 }}
        />
        <div ref={leftTextRef} style={{ position: 'absolute', right: 'calc(50% + 0.01px + 15.5px)', top: '50%', transform: 'translateY(-50%)', color: 'black', fontSize: 66.7, fontFamily: 'Helvetica', fontWeight: '400', wordWrap: 'break-word', zIndex: 60, textAlign: 'right' }}>
          {leftText}
        </div>
        <div ref={rightTextRef} style={{ position: 'absolute', left: 'calc(50% + 0.01px + 4.5px)', top: '50%', transform: 'translateY(-50%)', color: 'black', fontSize: 66.7, fontFamily: 'Helvetica', fontWeight: '400', wordWrap: 'break-word', zIndex: 60, textAlign: 'left' }}>
          {rightText}
        </div>
      </div>
      <div
        ref={navOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.144)',
          backdropFilter: 'blur(3px) saturate(120%)',
          WebkitBackdropFilter: 'blur(3px) saturate(120%)',
          opacity: 0,
          pointerEvents: 'none'
        }}
      >
        <div ref={navInnerRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
const HoverImage = ({ src, style, caption }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{
        position: 'absolute',
        ...style
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={caption || 'image'}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 600ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          willChange: 'opacity'
        }}
      />
      {(caption && caption.length > 0) && (
        <div
          style={{
            position: 'absolute',
            left: 12,
            bottom: 10,
            color: '#fff',
            fontFamily: 'Helvetica',
            fontSize: 18,
            lineHeight: 1.1,
            letterSpacing: '0.02em',
            pointerEvents: 'none',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'opacity'
          }}
        >
          {caption}
        </div>
      )}
    </div>
  )
}

const Landing = () => {
  const wireframeRef = useRef(null)
  const slidingRef = useRef(null)
  const lenisRef = useRef(null)
  const slidingAnimRef = useRef(null)
  const { canvasRef } = useMouseEffect({ containerRef: wireframeRef, sizeScale: 0.6, intensity: 0.75, radiusScale: 1.2, minScale: 0.08 })
  

  // Smooth scroll + slide-up behavior
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
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
          end: '+=150%',
          scrub: 0.2,
          pin: true,
          anticipatePin: 1,
          markers: false
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
    }
  }, [])

  const SLIDING_HEIGHT = 2768

  return (
    <div className="landing" style={{ width: '100%', height: `calc(200vh + ${SLIDING_HEIGHT}px)` }}>
      {/* Mouse-follow section - fixed at 100vh */}
      <div
        ref={wireframeRef}
        style={{
          width: '100%',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'white',
          overflow: 'hidden',
          perspective: '900px',
          transformStyle: 'preserve-3d',
          zIndex: 1
        }}
      >
        {/* Mouse follow canvas constrained to wireframe bounds */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100vh', pointerEvents: 'none', zIndex: 1 }} />
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
            <div style={{ 
              left: 91, 
              top: 125, 
              position: 'absolute', 
              zIndex: 1000
            }}>
              <WeUseThePowerOfStorytellingToFireTheImaginationStirTheSoulAndUltimatelyInspirePeople />
            </div>
            <img className="img2025010514053126Icon" alt="" src="IMG_20250105_140531-2 6.png" style={{ position: 'absolute', top: '1307px', left: '86px', width: '483px', height: '281px', objectFit: 'cover' }} />
            <img className="img202411290526471Icon" alt="" src="IMG_20241129_052647 1.png" style={{ position: 'absolute', top: '1706px', left: '446px', width: '313px', height: '556px', objectFit: 'cover' }} />
            <img className="img202412262008556Icon" alt="" src="IMG_20241226_200855 6.png" style={{ position: 'absolute', top: '947px', left: '451px', width: '541px', height: '304px', objectFit: 'cover' }} />
            <img className="img202501051356542Icon" alt="" src="IMG_20250105_135654 2.png" style={{ position: 'absolute', top: '480px', left: '611px', width: '234px', height: '416px', objectFit: 'cover' }} />
            <img className="img202412271513241Icon" alt="" src="IMG_20241227_151324 1.png" style={{ position: 'absolute', top: '1307px', left: '632px', width: '343px', height: '343px', objectFit: 'cover' }} />
            <img className="img202501062013271Icon" alt="" src="IMG_20250106_201327 1.png" style={{ position: 'absolute', top: '942px', left: '86px', width: '315px', height: '315px', objectFit: 'cover' }} />
            <img className="img202411290124101Icon" alt="" src="IMG_20241129_012410 1.png" style={{ position: 'absolute', top: '1706px', left: '804px', width: '646px', height: '364px', objectFit: 'cover' }} />
            <img className="img202411290448467Icon" alt="" src="IMG_20241129_044846 7.png" style={{ position: 'absolute', top: '621px', left: '902px', width: '548px', height: '275px', objectFit: 'cover' }} />
            <img className="img202412291336061Icon" alt="" src="IMG_20241229_133606 1.png" style={{ position: 'absolute', top: '947px', left: '1050px', width: '400px', height: '703px', objectFit: 'cover' }} />
            <img className="img202412271435244Icon" alt="" src="IMG_20241227_143524 4.png" style={{ position: 'absolute', top: '1638px', left: '87px', width: '314px', height: '624px', objectFit: 'cover' }} />
            <img className="img202501051432062Icon" alt="" src="IMG_20250105_143206 2.png" style={{ position: 'absolute', top: '600px', left: '91px', width: '478px', height: '286px', objectFit: 'cover' }} />
            <div className="component14" style={{ position: 'absolute', top: '360px', left: '1254px', width: '213.3px', height: '46.9px', fontSize: '34.91px', fontFamily: 'Helvetica' }}>
              <img className="component14Child" alt="" src="Rectangle 11.svg" style={{ position: 'absolute', height: '100%', width: '100%', top: '0%', right: '0%', bottom: '0%', left: '0%', borderRadius: '8.46px', maxWidth: '100%', overflow: 'hidden', maxHeight: '100%' }} />
              <div className="scroll" style={{ position: 'absolute', top: '4.26%', left: '6.56%', letterSpacing: '0.05em', lineHeight: '122.71%' }}>SCROLL</div>
              <img className="component14Item" alt="" src="Arrow 8.svg" style={{ position: 'absolute', height: '55.44%', width: '13.46%', top: '21.32%', right: '1.69%', bottom: '23.24%', left: '84.86%', maxWidth: '100%', overflow: 'hidden', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <img className="img2024122515315821Icon" alt="" src="IMG_20241225_153158-2 1.png" style={{ position: 'absolute', top: '2312px', left: '86px', width: '673px', height: '357px', objectFit: 'cover' }} />
            <img className="img202412291341411Icon" alt="" src="IMG_20241227_134141 1.png" style={{ position: 'absolute', top: '2126px', left: '804px', width: '323px', height: '574px', objectFit: 'cover' }} />
            <img className="img202412271512161Icon" alt="" src="IMG_20241227_151216 1.png" style={{ position: 'absolute', top: '2130px', left: '1168px', width: '282px', height: '283px', objectFit: 'cover' }} />
            <img className="img202501140936071Icon" alt="" src="IMG_20250114_093607 1.png" style={{ position: 'absolute', top: '2442px', left: '1168px', width: '282px', height: '282px', objectFit: 'cover' }} />
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
          <ZoomReveal imageSrc="/1221.png" />
        </div>
    </div>
  )
}

export default Landing


