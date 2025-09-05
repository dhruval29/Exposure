import React, { useRef, useState, useEffect } from 'react'
import MouseMouse from './MouseMouse'
import Rectangle18 from './Rectangle18'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

import Lenis from '@studio-freight/lenis'
// import { useMouseEffect } from './MouseEffectPage/useMouseEffect' // REMOVED - duplicate effect causing performance issues
import NavigationMenu from './NavigationMenu'
import StorytellingHero from './StorytellingHero'
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

  // Simplified image data - using sliding content images
  const localImageData = [
    { id: 'sliding-1', ratio: 600 / 400, path: '/New folder/images/sliding content/1.webp' },
    { id: 'sliding-2', ratio: 600 / 400, path: '/New folder/images/sliding content/2.webp' },
    { id: 'sliding-3', ratio: 600 / 400, path: '/New folder/images/sliding content/3.webp' },
    { id: 'sliding-4', ratio: 600 / 400, path: '/New folder/images/sliding content/4.webp' },
    { id: 'sliding-5', ratio: 600 / 400, path: '/New folder/images/sliding content/5.webp' }
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
      const promises = localImageData.map(data => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const ratio = data.ratio || (img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1);
            resolve({ ...data, ratio, img });
          };
          img.onerror = () => {
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
    } catch (error) {
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
    
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Start animation
  const startAnimation = () => {
    setIsActive(true);
    forceScaleRef.current = 1;
    animate();
  };

  // Stop animation
  const stopAnimation = () => {
    setIsActive(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    forceScaleRef.current = 1;
  };

  // Initialize
  useEffect(() => {
    resizeCanvas();
    loadImages();
    
    // Initialize mouse position to center
    mouseRef.current.x = getViewportWidth() * 0.5;
    mouseRef.current.y = getViewportHeight() * 0.5;
    
    // Event listeners
    const targetEl = containerRef && containerRef.current ? containerRef.current : window;
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
      startAnimation();
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
    if (!isLoading && !isTouch()) {
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

const ZoomReveal = ({ imageSrc = '/New folder/images/zoom reveal.webp', leftText = 'Take a closer', rightText = 'look at Life', config = DEFAULT_ZR_CONFIG }) => {
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
  const [showMouseOverlay, setShowMouseOverlay] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [showLoadingTitle, setShowLoadingTitle] = useState(false)
  // Mouse effect removed - page left blank as requested

  // Smooth scroll + slide-up behavior
  useEffect(() => {
    // Simple landing loading gate (2s)
    const textTimer = setTimeout(() => setShowLoadingTitle(true), 1000)
    const loadTimer = setTimeout(() => setIsLoading(false), 3000)
    const removeTimer = setTimeout(() => setOverlayVisible(false), 4000)

    // Additional scroll listener to ensure MouseMouse visibility works in both directions
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const viewportHeight = window.innerHeight
      const slidingHeight = 2768
      
      // Show MouseMouse when we're in the sliding section (after 100vh, before zoom component)
      const slidingSectionStart = viewportHeight
      const zoomComponentStart = 3544 // From ScrollTracker data
      
      if (scrollTop >= slidingSectionStart && scrollTop < zoomComponentStart) {
        setShowMouseOverlay(true)
      } else if (scrollTop < slidingSectionStart) {
        // Before sliding section - show MouseMouse
        setShowMouseOverlay(true)
      } else {
        // After zoom component - hide MouseMouse
        setShowMouseOverlay(false)
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
      clearTimeout(textTimer)
      clearTimeout(loadTimer)
      clearTimeout(removeTimer)
      if (lenisRef.current) lenisRef.current.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const SLIDING_HEIGHT = 2768

  return (
    <div className="landing" style={{ width: '100%', height: `calc(200vh + ${SLIDING_HEIGHT}px)` }}>
      {/* Top Navigation Bar */}
      <Rectangle18 />
      
      {/* Loading overlay - 2s gate */}
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
          {/* keyframes for per-letter reveal */}
          <style>{`
            @keyframes landingCharIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
          {showLoadingTitle && (
            <div style={{ position: 'absolute', top: 314, left: 503, width: 530, height: 171 }}>
              {/* Line 1 */}
              <div style={{
                letterSpacing: '-0.02em',
                lineHeight: '97%',
                color: '#ffffff',
                fontFamily: "'PP Editorial New', Helvetica, Arial, sans-serif",
                fontSize: 96,
                textAlign: 'left',
                opacity: isLoading ? 1 : 0,
                transition: 'opacity 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}>
                {Array.from('EXPOSURE ').map((ch, i) => (
                  <span key={`l1-${i}`} style={{ display: 'inline-block', opacity: 0, transform: 'translateY(16px)', animation: `landingCharIn 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`, animationDelay: `${200 + i * 50}ms` }}>{ch}</span>
                ))}
              </div>
              {/* Line 2 */}
              <div style={{
                letterSpacing: '-0.02em',
                lineHeight: '97%',
                color: '#ffffff',
                fontFamily: "'PP Editorial New', Helvetica, Arial, sans-serif",
                fontSize: 96,
                textAlign: 'left',
                opacity: isLoading ? 1 : 0,
                transition: 'opacity 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                display: 'flex',
                flexWrap: 'nowrap'
              }}>
                {Array.from('EXPLORERS').map((ch, i) => (
                  <span key={`l2-${i}`} style={{ display: 'inline-block', opacity: 0, transform: 'translateY(16px)', animation: `landingCharIn 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`, animationDelay: `${200 + 9 * 50 + i * 50}ms` }}>{ch}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Mouse trail overlay on top of all content */}
      <MouseMouse visible={showMouseOverlay} zIndex={800} />
      {/* Mouse-follow section - fixed at 100vh */}
      <div
        ref={wireframeRef}
        style={{
          width: '100%',
          height: '100vh',
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
          border: '1px solid red',
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
              <StorytellingHero />
            </div>
            <HoverImage 
              src="/New folder/images/sliding content/1.webp" 
              style={{ position: 'absolute', top: '1307px', left: '86px', width: '483px', height: '281px' }}
              caption=""
            />
                         <HoverImage 
               src="/New folder/images/sliding content/2.webp" 
               style={{ position: 'absolute', top: '1706px', left: '446px', width: '313px', height: '556px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/3.webp" 
               style={{ position: 'absolute', top: '947px', left: '451px', width: '541px', height: '304px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/4.webp" 
               style={{ position: 'absolute', top: '480px', left: '611px', width: '234px', height: '416px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/5.webp" 
               style={{ position: 'absolute', top: '1307px', left: '632px', width: '343px', height: '343px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/6.webp" 
               style={{ position: 'absolute', top: '942px', left: '86px', width: '315px', height: '315px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/7.webp" 
               style={{ position: 'absolute', top: '1706px', left: '804px', width: '646px', height: '364px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/8.webp" 
               style={{ position: 'absolute', top: '621px', left: '902px', width: '548px', height: '275px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/9.webp" 
               style={{ position: 'absolute', top: '947px', left: '1050px', width: '400px', height: '703px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/10.webp" 
               style={{ position: 'absolute', top: '1638px', left: '87px', width: '314px', height: '624px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/11.webp" 
               style={{ position: 'absolute', top: '600px', left: '91px', width: '478px', height: '286px' }}
               caption=""
             />

                         <HoverImage 
               src="/New folder/images/sliding content/12.webp" 
               style={{ position: 'absolute', top: '2312px', left: '86px', width: '673px', height: '357px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/13.webp" 
               style={{ position: 'absolute', top: '2126px', left: '804px', width: '323px', height: '574px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/14.webp" 
               style={{ position: 'absolute', top: '2130px', left: '1168px', width: '282px', height: '283px' }}
               caption=""
             />
                         <HoverImage 
               src="/New folder/images/sliding content/15.webp" 
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
                     <ZoomReveal imageSrc="/New folder/images/zoom reveal.webp" />
        </div>
    </div>
  )
}

export default Landing


