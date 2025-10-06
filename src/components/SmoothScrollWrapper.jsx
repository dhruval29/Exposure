import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmoothScrollWrapper = ({ children, className = '', style = {} }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    // Create smooth scroll effect similar to ZoomReveal and Fly
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMobile ? 1.5 : 2.5, // Slightly faster scrub on mobile
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1,
        onUpdate: (self) => {
          // Optional: Add any scroll-based updates here
        }
      }
    });

    // Add very subtle parallax effect to the content - minimal to avoid positioning issues
    tl.to(content, {
      y: -10, // Reduced from -30 to -10 for minimal interference
      ease: 'none',
      duration: 1
    });

    // Add smooth opacity transitions for better visual flow
    tl.fromTo(content, 
      { 
        opacity: 0.95 // Reduced from 0.9 to 0.95 for minimal change
      },
      { 
        opacity: 1,
        duration: 0.3, // Reduced from 0.4 to 0.3
        ease: 'power2.out'
      }, 0
    );

    // Remove scale effect to avoid any positioning interference
    // tl.fromTo(content,
    //   {
    //     scale: 1.02
    //   },
    //   {
    //     scale: 1,
    //     duration: 0.6,
    //     ease: 'power2.out'
    //   }, 0
    // );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [isMobile]);

  // Enhanced scroll behavior for the entire page
  useEffect(() => {
    // Set smooth scroll behavior to auto to let GSAP handle it
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Create a global smooth scroll effect similar to ZoomReveal
    const handleScroll = () => {
      // Add any global scroll effects here if needed
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'visible', // Changed from 'hidden' to 'visible' to not interfere with absolute positioning
        isolation: 'auto', // Allow absolute positioned children to escape this container
        ...style
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: '100%',
          height: '100%',
          willChange: 'transform, opacity',
          position: 'relative', // Ensure proper positioning context
          zIndex: 'auto' // Don't create a stacking context that affects absolute positioning
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SmoothScrollWrapper;