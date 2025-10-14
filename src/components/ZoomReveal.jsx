import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import NavigationMenu from './NavigationMenu';

gsap.registerPlugin(ScrollTrigger);

const EXTRA_SCROLL_PAD = 0.3; // Extra scroll distance after zoom before nav shows (desktop/tablet)
const MOBILE_EXTRA_SCROLL_PAD = 0.05; // Nearly instant nav on mobile after zoom

const ZoomReveal = ({
  imageSrc = '/assets/mobile/images/zoom-reveal/zoom-reveal.webp',
  leftText = 'Take a closer',
  rightText = 'look at Life'
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const [showNav, setShowNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    const container = containerRef.current;
    const img = imageRef.current;
    const left = leftTextRef.current;
    const right = rightTextRef.current;

    if (!container || !img || !left || !right) return;

    gsap.set([left, right], { x: 0 });

    // Reset any stale transforms and assert percent-based centering
    gsap.set(img, { clearProps: 'transform' });
    gsap.set(img, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      overwrite: 'auto'
    });

    // Ensure text is visible immediately and above everything
    gsap.set([left, right], { zIndex: 5000, opacity: 1 });

    // Store ScrollTrigger instance to kill it later
    let scrollTriggerInstance = null;
    let animationComplete = false;

    // Detect iOS devices - specifically target smaller iPhones (iPhone 13 and below)
    // Larger models like iPhone 13 Pro Max (926px), 14 Plus work fine
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSmallIOS = isIOS && window.innerHeight <= 844 && window.innerWidth <= 430; // iPhone 13, 12, 11, X, SE, etc.
    
    // Build ScrollTrigger config - only apply iOS fixes to small iOS devices
    const scrollTriggerConfig = {
      trigger: container,
      start: 'top center',
      end: window.innerWidth > 1920 ? '+=180%' : window.innerWidth > 1440 ? '+=150%' : '+=120%', // More scroll distance for larger monitors
      scrub: isSmallIOS ? 0.5 : 1, // Faster scrub on small iOS devices to reduce momentum issues
      markers: false,
      onUpdate: (self) => {
          // Once we reach the end, prevent reversing
          if (self.progress >= 0.99 && !animationComplete) {
            animationComplete = true;
            // Kill the ScrollTrigger to prevent reverse animation
            if (scrollTriggerInstance) {
              // Disable ScrollTrigger but keep the final state
              scrollTriggerInstance.disable();
              // Set final positions explicitly
              gsap.set(img, {
                width: '100vw',
                height: '100vh',
                position: 'absolute',
                top: '50%',
                left: '50%',
                x: 0,
                y: 0,
                xPercent: -50,
                yPercent: -50,
                zIndex: 1000,
                overwrite: 'auto'
              });
              gsap.set(left, { x: -window.innerWidth * (window.innerWidth > 1920 ? 1.5 : 1.2) });
              gsap.set(right, { x: window.innerWidth * (window.innerWidth > 1920 ? 1.5 : 1.2) });
            }
          }
        },
        onCreate: function() {
          scrollTriggerInstance = this;
        }
    };
    
    // Add iOS-specific fixes ONLY for small iOS devices
    if (isSmallIOS) {
      scrollTriggerConfig.pin = true; // Pin the container during animation
      scrollTriggerConfig.pinSpacing = true; // Keep spacing for smooth scroll
      scrollTriggerConfig.anticipatePin = 1; // Helps with iOS performance
      scrollTriggerConfig.invalidateOnRefresh = true; // Handle viewport changes (iOS address bar)
      scrollTriggerConfig.fastScrollEnd = true; // Detect fast scroll end on iOS
      scrollTriggerConfig.toggleActions = 'play none none none'; // Prevent reverse animation
    }
    
    const tl = gsap.timeline({
      scrollTrigger: scrollTriggerConfig
    });

    tl.to(img, {
      width: '100vw',
      height: '100vh',
      position: 'absolute',
      top: '50%',
      left: '50%',
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      overwrite: 'auto',
      force3D: false,
      zIndex: 1000,
      duration: 2.5,
      ease: 'power2.inOut'
    }, 'zoomStart')
    .to(left, {
      x: -10, // First move to 10px from center
      duration: 0.3,
      ease: 'power2.out'
    }, 'zoomStart')
    .to(left, {
      x: -window.innerWidth * (window.innerWidth > 1920 ? 1.5 : 1.2), // Move further off-screen on larger monitors
      duration: 2.2,
      ease: 'power2.inOut'
    }, 'zoomStart+=0.3')
    .to(right, {
      x: 10, // First move to 10px from center
      duration: 0.3,
      ease: 'power2.out'
    }, 'zoomStart')
    .to(right, {
      x: window.innerWidth * (window.innerWidth > 1920 ? 1.5 : 1.2), // Move further off-screen on larger monitors
      duration: 2.2,
      ease: 'power2.inOut'
    }, 'zoomStart+=0.3')
    // Add extra scroll-only padding after zoom completes (no visual change)
    .to({}, { duration: isMobile ? MOBILE_EXTRA_SCROLL_PAD : EXTRA_SCROLL_PAD })
    .add(() => {
      // Show nav immediately (scroll-controlled elsewhere if needed)
      setShowNav(true);
      // Ensure ScrollTrigger is disabled when nav shows
      if (scrollTriggerInstance && !animationComplete) {
        animationComplete = true;
        scrollTriggerInstance.disable();
        // Lock final positions
        gsap.set(img, {
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: '50%',
          left: '50%',
          x: 0,
          y: 0,
          xPercent: -50,
          yPercent: -50,
          zIndex: 1000,
          overwrite: 'auto'
        });
        gsap.set(left, { x: -window.innerWidth * (window.innerWidth > 1920 ? 1.5 : 1.2) });
        gsap.set(right, { x: window.innerWidth * (window.innerWidth > 1920 ? 1.5 : 1.2) });
      }
    });

    return () => {
      tl.kill();
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#ede9e4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000, // Ensure it's above background elements
        isolation: 'isolate', // Create new stacking context
        overflow: 'hidden' // Prevent any text bleeding outside container
      }}
    >
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: '#ede9e4', // Additional background layer
        zIndex: 1001
      }}>
        {/* Background overlay to ensure complete coverage */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#ede9e4',
          zIndex: 1002
        }} />
        
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Zoom Reveal"
          style={{
            width: '0.1px',
            height: '0.05px',
            objectFit: 'cover',
            pointerEvents: 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transformOrigin: 'center center',
            zIndex: 500
          }}
        />

        <div
          ref={leftTextRef}
          style={{
            position: 'absolute',
            right: isMobile ? 'calc(50% + 0.01px + 5px)' : 'calc(50% + 0.01px + 15.5px)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'black',
            fontSize: isMobile ? 'clamp(80px, 10vw, 120px)' : 'clamp(48px, 4vw, 80px)', // Increased mobile size
            fontFamily: "'Inter', 'Roboto', 'Source Sans Pro', 'Open Sans', 'Nunito Sans', Helvetica, Arial, sans-serif",
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
            left: isMobile ? 'calc(50% + 0.01px + 2px)' : 'calc(50% + 0.01px + 4.5px)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'black',
            fontSize: isMobile ? 'clamp(80px, 10vw, 120px)' : 'clamp(48px, 4vw, 80px)', // Increased mobile size
            fontFamily: "'Inter', 'Roboto', 'Source Sans Pro', 'Open Sans', 'Nunito Sans', Helvetica, Arial, sans-serif",
            fontWeight: '400',
            wordWrap: 'break-word',
            zIndex: 60,
            textAlign: 'left'
          }}
        >
          {rightText}
        </div>
      </div>

      {showNav && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(237, 233, 228, 0.1)',
            opacity: 1
          }}
        >
          <NavigationMenu isExiting={false} />
        </div>
      )}
    </div>
  );
};

export default ZoomReveal;


