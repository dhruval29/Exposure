import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
// import { useMouseEffect } from './MouseEffectPage/useMouseEffect' // REMOVED - duplicate effect causing performance issues
import NavigationMenu from './NavigationMenu'
import WeUseThePowerOfStorytellingToFireTheImaginationStirTheSoulAndUltimatelyInspirePeople from './WeUseThePowerOfStorytellingToFireTheImaginationStirTheSoulAndUltimatelyInspirePeople'
import Frame36 from './Frame36'
// Note: Scroll/Lenis removed per request for a static wireframe

// Wireframe assets removed (rectangles were deleted as requested)

// Lightweight mouse effect hook for React Landing component
const useLightweightMouseEffect = (containerRef) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mouse tracking state
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const forceScaleRef = useRef(0);

  // Settings - optimized for performance
  const settingsRef = useRef({
    imgSize: 0,
    maxDistance: 0,
    gap: 0,
    step: 0,
    cols: 0,
    rows: 0
  });

  // Simplified image data - just a few images for performance
  const localImageData = [
    { id: 'forest', ratio: 600 / 428, path: '/pictures/forest.jpg' },
    { id: 'IMG_20250105_140531-2', ratio: 600 / 651, path: '/pictures/IMG_20250105_140531-2.jpg' },
    { id: 'IMG_20241129_052647', ratio: 600 / 522, path: '/pictures/IMG_20241129_052647.jpg' },
    { id: 'IMG_20241226_200855', ratio: 600 / 420, path: '/pictures/IMG_20241226_200855.jpg' },
    { id: 'IMG_20250105_135654', ratio: 600 / 612, path: '/pictures/IMG_20250105_135654.jpg' }
  ];

  // Touch detection
  const isTouch = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const getViewportWidth = () => {
    if (containerRef && containerRef.current) return containerRef.current.clientWidth;
    return window.innerWidth;
  };

  const getViewportHeight = () => {
    if (containerRef && containerRef.current) return containerRef.current.clientHeight;
    return window.innerHeight;
  };

  // Update settings based on window size
  const updateSettings = () => {
    const vw = getViewportWidth();
    const vh = getViewportHeight();
    if (vw >= 1024) {
      settingsRef.current.imgSize = vh * 0.15;
      settingsRef.current.maxDistance = vh * 0.4;
    } else {
      settingsRef.current.imgSize = vh * 0.1;
      settingsRef.current.maxDistance = vh * 0.25;
    }
    settingsRef.current.gap = vh * 0.35;
    settingsRef.current.step = settingsRef.current.imgSize + settingsRef.current.gap;
    settingsRef.current.cols = Math.ceil(vw / settingsRef.current.step) + 2;
    settingsRef.current.rows = Math.ceil(vh / settingsRef.current.step) + 2;
  };

  // Resize canvas
  const resizeCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const vw = getViewportWidth();
      const vh = getViewportHeight();
      canvas.width = vw;
      canvas.height = vh;
      updateSettings();
    }
  };

  // Load images
  const loadImages = async () => {
    try {
      console.log('Starting to load images for mouse effect...');
      const promises = localImageData.map(data => {
        console.log('Loading image:', data.path);
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const ratio = data.ratio || (img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1);
            console.log('Image loaded successfully:', data.path, 'ratio:', ratio);
            resolve({ ...data, ratio, img });
          };
          img.onerror = () => {
            console.warn('Image failed to load, using fallback:', data.path);
            // Create a colored rectangle as fallback
            const fallbackCanvas = document.createElement('canvas');
            fallbackCanvas.width = 200;
            fallbackCanvas.height = 200;
            const fallbackCtx = fallbackCanvas.getContext('2d');
            
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            fallbackCtx.fillStyle = color;
            fallbackCtx.fillRect(0, 0, 200, 200);
            
            fallbackCtx.fillStyle = 'rgba(255,255,255,0.3)';
            fallbackCtx.fillRect(50, 50, 100, 100);
            
            const fallbackImg = new Image();
            fallbackImg.onload = () => resolve({ ...data, ratio: data.ratio || 1, img: fallbackImg });
            fallbackImg.src = fallbackCanvas.toDataURL();
          };
          img.src = data.path;
        });
      });
      
      const loadedImages = await Promise.all(promises);
      setImages(loadedImages);
      setIsLoading(false);
      console.log('Lightweight mouse effect images loaded:', loadedImages.length);
    } catch (error) {
      console.error('Error loading images:', error);
      setIsLoading(false);
    }
  };

  // Mouse move handler - throttled for performance
  let lastMouseUpdate = 0;
  const mouseThrottleMs = 16;
  
  const handleMouseMove = (e) => {
    const now = performance.now();
    if (now - lastMouseUpdate < mouseThrottleMs) return;
    
    lastMouseUpdate = now;
    const vw = getViewportWidth();
    const vh = getViewportHeight();
    
    if (containerRef && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      mouseRef.current.x = Math.max(0, Math.min(localX, vw));
      mouseRef.current.y = Math.max(0, Math.min(localY, vh));
    } else {
      mouseRef.current.x = Math.max(0, Math.min(e.clientX, vw));
      mouseRef.current.y = Math.max(0, Math.min(e.clientY, vh));
    }
  };

  // Main animation loop - optimized for performance
  let lastFrameTime = 0;
  const targetFPS = 30; // Reduced FPS for better performance
  const frameInterval = 1000 / targetFPS;
  
  const animate = (currentTime) => {
    if (!isActive || !canvasRef.current) {
      console.log('Animation not active or canvas not ready:', { isActive, hasCanvas: !!canvasRef.current });
      return;
    }
    
    // Frame rate limiting
    if (currentTime - lastFrameTime < frameInterval) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = currentTime;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const settings = settingsRef.current;
    
    timeRef.current += 0.016;
    if (timeRef.current > 1000) timeRef.current = 0;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate center point
    const centerX = mouseRef.current.x;
    const centerY = mouseRef.current.y;
    
    // Draw images in grid pattern - optimized
    let imagesDrawn = 0;
    for (let row = 0; row < settings.rows; row++) {
      for (let col = 0; col < settings.cols; col++) {
        const imageIndex = (col + row * settings.cols) % images.length;
        const image = images[imageIndex];
        
        if (!image || !image.img) continue;
        
        // Calculate position
        const x = col * settings.step;
        const y = row * settings.step;
        
        // Only draw if image is visible on screen
        if (x + settings.imgSize > 0 && x < getViewportWidth() && 
            y + settings.imgSize > 0 && y < getViewportHeight()) {
          
          // Calculate aspect ratio and dimensions
          let drawWidth, drawHeight;
          if (image.ratio > 1) {
            drawWidth = settings.imgSize;
            drawHeight = drawWidth / image.ratio;
          } else {
            drawHeight = settings.imgSize;
            drawWidth = drawHeight * image.ratio;
          }
          
          // Calculate distance from center
          const dx = x + (settings.imgSize - drawWidth) / 2 + settings.imgSize * 0.5 - centerX;
          const dy = y + (settings.imgSize - drawHeight) / 2 + settings.imgSize * 0.5 - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, Math.min(1, 1 - distance / settings.maxDistance));
          const scale = Math.max(0.1, proximity * 2) * forceScaleRef.current;
          const finalWidth = drawWidth * scale;
          const finalHeight = drawHeight * scale;
          
          if (finalWidth > 0.5 && finalHeight > 0.5) {
            ctx.drawImage(
              image.img,
              x + (settings.imgSize - finalWidth) / 2,
              y + (settings.imgSize - finalHeight) / 2,
              finalWidth,
              finalHeight
            );
            imagesDrawn++;
          }
        }
      }
    }
    
    // Log every 30 frames for debugging
    if (Math.floor(timeRef.current * 30) % 30 === 0) {
      console.log('Mouse effect animation running:', { imagesDrawn, centerX, centerY, settings: settingsRef.current });
    }
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Start animation
  const startAnimation = () => {
    console.log('Starting mouse effect animation...');
    setIsActive(true);
    forceScaleRef.current = 1;
    animate();
  };

  // Stop animation
  const stopAnimation = () => {
    console.log('Stopping mouse effect animation...');
    setIsActive(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    forceScaleRef.current = 1;
  };

  // Initialize
  useEffect(() => {
    console.log('Initializing lightweight mouse effect...');
    resizeCanvas();
    loadImages();
    
    // Initialize mouse position to center
    mouseRef.current.x = getViewportWidth() * 0.5;
    mouseRef.current.y = getViewportHeight() * 0.5;
    console.log('Mouse position initialized to center:', mouseRef.current);
    
    // Event listeners
    const targetEl = containerRef && containerRef.current ? containerRef.current : window;
    console.log('Adding mouse move listener to:', targetEl === window ? 'window' : 'container');
    targetEl.addEventListener('mousemove', handleMouseMove, { passive: true });
    if (targetEl === window) {
      window.addEventListener('resize', resizeCanvas);
    } else if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(resizeCanvas);
      ro.observe(containerRef.current);
      animationRef.current = { ...(animationRef.current || {}), _ro: ro };
    }
    
    // Start animation if not on touch device
    if (!isTouch()) {
      console.log('Not on touch device, starting animation...');
      startAnimation();
    } else {
      console.log('On touch device, not starting animation');
    }
    
    return () => {
      const cleanupTarget = containerRef && containerRef.current ? containerRef.current : window;
      cleanupTarget.removeEventListener('mousemove', handleMouseMove);
      if (cleanupTarget === window) {
        window.removeEventListener('resize', resizeCanvas);
      } else if (animationRef.current && animationRef.current._ro) {
        animationRef.current._ro.disconnect();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Start/stop animation when images are loaded
  useEffect(() => {
    console.log('Image loading effect triggered:', { isLoading, isTouch: isTouch() });
    if (!isLoading && !isTouch()) {
      console.log('Images loaded and not on touch, starting animation...');
      startAnimation();
    }
  }, [isLoading]);

  return {
    canvasRef,
    isLoading,
    isActive,
    startAnimation,
    stopAnimation
  };
};

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
          start: 'top top',
          end: '+=50%',
          scrub: 2,
          pin: true,
          markers: false,
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
      zIndex: 1000,
      duration: 1,
      ease: 'power2.inOut'
    }, 0)

    // 2. Text movement animation (synchronized with image scaling)
    tl.to(left, {
      x: -window.innerWidth + 50, // 50px from left edge
      duration: 1,
      ease: 'power2.inOut'
    }, 0)

    tl.to(right, {
      x: window.innerWidth - 50, // 50px from right edge
      duration: 1,
      ease: 'power2.inOut'
    }, 0)

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
        <div ref={leftTextRef} style={{ position: 'absolute', right: 'calc(50% + 10px)', top: '50%', transform: 'translateY(-50%)', color: 'black', fontSize: 66.7, fontFamily: 'Helvetica', fontWeight: '400', wordWrap: 'break-word', zIndex: 60, textAlign: 'right' }}>
          {leftText}
        </div>
        <div ref={rightTextRef} style={{ position: 'absolute', left: 'calc(50% + 10px)', top: '50%', transform: 'translateY(-50%)', color: 'black', fontSize: 66.7, fontFamily: 'Helvetica', fontWeight: '400', wordWrap: 'break-word', zIndex: 60, textAlign: 'left' }}>
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
  // Mouse effect removed - page left blank as requested
  

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
          scrub: 2,
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
            <div style={{ 
              left: 91, 
              top: 125, 
              position: 'absolute', 
              zIndex: 1000
            }}>
              <WeUseThePowerOfStorytellingToFireTheImaginationStirTheSoulAndUltimatelyInspirePeople />
            </div>
            <HoverImage 
              src="/pictures/IMG_20250105_140531-2.jpg" 
              style={{ position: 'absolute', top: '1307px', left: '86px', width: '483px', height: '281px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20241129_052647 (2).jpg" 
              style={{ position: 'absolute', top: '1706px', left: '446px', width: '313px', height: '556px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20241226_200855.jpg" 
              style={{ position: 'absolute', top: '947px', left: '451px', width: '541px', height: '304px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20250105_135654.jpg" 
              style={{ position: 'absolute', top: '480px', left: '611px', width: '234px', height: '416px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20241227_151324.jpg" 
              style={{ position: 'absolute', top: '1307px', left: '632px', width: '343px', height: '343px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20250106_201327.jpg" 
              style={{ position: 'absolute', top: '942px', left: '86px', width: '315px', height: '315px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20241129_012410.jpg" 
              style={{ position: 'absolute', top: '1706px', left: '804px', width: '646px', height: '364px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20241129_044846.jpg" 
              style={{ position: 'absolute', top: '621px', left: '902px', width: '548px', height: '275px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20241229_133606.jpg" 
              style={{ position: 'absolute', top: '947px', left: '1050px', width: '400px', height: '703px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20241227_143524.jpg" 
              style={{ position: 'absolute', top: '1638px', left: '87px', width: '314px', height: '624px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20250105_143206.jpg" 
              style={{ position: 'absolute', top: '600px', left: '91px', width: '478px', height: '286px' }}
              caption=""
            />

            <HoverImage 
              src="/pictures/IMG_20241225_153158-2.jpg" 
              style={{ position: 'absolute', top: '2312px', left: '86px', width: '673px', height: '357px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20250108_164936.jpg" 
              style={{ position: 'absolute', top: '2126px', left: '804px', width: '323px', height: '574px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20241227_151216.jpg" 
              style={{ position: 'absolute', top: '2130px', left: '1168px', width: '282px', height: '283px' }}
              caption=""
            />
            <HoverImage 
              src="/pictures/IMG_20250114_093607.jpg" 
              style={{ position: 'absolute', top: '2442px', left: '1168px', width: '282px', height: '282px' }}
              caption=""
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
          <ZoomReveal imageSrc="/1221.png" />
        </div>
    </div>
  )
}

export default Landing


