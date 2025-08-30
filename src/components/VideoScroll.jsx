import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './video-scroll.css';
import ImageStack from './ImageStack';
import ZoomReveal from './ZoomReveal';

gsap.registerPlugin(ScrollTrigger);

const videos = [
  '/videos/12500680_1920_1080_24fps.mp4',
  '/videos/14094851_1920_1080_20fps.mp4',
  '/videos/1550080-uhd_3840_2160_30fps.mp4',
  '/videos/1580455-hd_1920_1080_30fps.mp4',
  '/videos/2231485-uhd_3840_2160_24fps.mp4',
  '/videos/12374612-uhd_3840_2160_60fps.mp4'
];

const VideoScroll = () => {
  const containerRef = useRef(null);
  const videosRef = useRef([]);
  const wrapperRef = useRef(null);
  const slidingPageRef = useRef(null);
  const imageStackSectionRef = useRef(null);
  const zoomWrapperRef = useRef(null);
  const zoomSectionRef = useRef(null);
  const zoomImageRef = useRef(null);
  const zoomTextLeftRef = useRef(null);
  const zoomTextRightRef = useRef(null);
  const captureLettersRef = useRef([]);
  const exploreLettersRef = useRef([]);
  const liveLettersRef = useRef([]);
  const [showNavigation, setShowNavigation] = useState(false);
  const [isExitingNavigation, setIsExitingNavigation] = useState(false);
  const [slidingPagePosition, setSlidingPagePosition] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const prevProgress = useRef(0);
  const hasShownNavigation = useRef(false);
  const lastProgressUpdate = useRef(Date.now());

  useEffect(() => {
    try {
      const container = containerRef.current;
      const videoElements = videosRef.current;
      const slidingPage = slidingPageRef.current;

      if (!container || !slidingPage) {
        console.warn('Required refs not available yet');
        return;
      }

      const zoomSection = zoomSectionRef.current;
      const zoomImage = zoomImageRef.current;
      const zoomTextLeft = zoomTextLeftRef.current;
      const zoomTextRight = zoomTextRightRef.current;
      const hasZoomTargets = !!(zoomSection && zoomImage && zoomTextLeft && zoomTextRight);

      // Set initial states
      gsap.set(slidingPage, { y: "100%", visibility: "visible" });
      gsap.set([zoomTextLeft, zoomTextRight], { x: 0 });

      // Initial video positions
      const initialPositions = [
        { x: 0, y: 0 },
        { x: window.innerWidth - 450, y: 0 },
        { x: 50, y: window.innerHeight/4 },
        { x: window.innerWidth - 500, y: window.innerHeight/2 - 150 },
        { x: 150, y: window.innerHeight - 300 },
        { x: window.innerWidth/2 + 100, y: window.innerHeight - 250 }
      ];

      videoElements.forEach((video, index) => {
        gsap.set(video, {
          x: initialPositions[index].x,
          y: initialPositions[index].y
        });
      });

      // Main video animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=2000%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          markers: false,
          onUpdate: (self) => {
            const currentProgress = self.progress;
            const isScrollingForward = currentProgress > prevProgress.current;
            const isScrollingBackward = currentProgress < prevProgress.current;
            
            // Calculate scroll speed
            const now = Date.now();
            const timeDiff = now - lastProgressUpdate.current;
            if (timeDiff > 0) {
              const progressDiff = Math.abs(currentProgress - prevProgress.current);
              const speed = (progressDiff / timeDiff) * 1000; // Progress per second
              setScrollSpeed(speed);
            }
            lastProgressUpdate.current = now;
            
            // Debug: Log progress every 10% to see when we reach navigation trigger
            if (Math.floor(currentProgress * 10) !== Math.floor(prevProgress.current * 10)) {
              console.log(`📊 Progress: ${(currentProgress * 100).toFixed(1)}% - Navigation trigger at 80%`);
            }
            
            // Show navigation when zoom animation completes (around 80% progress - more sensitive)
            if (currentProgress > 0.80 && !hasShownNavigation.current) {
              console.log('🚀 Navigation should appear! Progress:', currentProgress, 'Current section: Zoom complete');
              setShowNavigation(true);
              hasShownNavigation.current = true;
            }
            
            // Hide navigation when scrolling backward and zoom starts reversing (more sensitive)
            if (isScrollingBackward && currentProgress < 0.80 && hasShownNavigation.current && !isExitingNavigation) {
              console.log('⬅️ Navigation should hide! Progress:', currentProgress, 'Scrolling backward');
              setIsExitingNavigation(true);
              // Add delay to allow exit animation to play
              setTimeout(() => {
                setShowNavigation(false);
                hasShownNavigation.current = false;
                setIsExitingNavigation(false);
              }, 800); // Match the exit animation duration
            }
            

            
            // Additional backup for very early scroll back (more sensitive)
            if (currentProgress < 0.65 && showNavigation && !isExitingNavigation) {
              setIsExitingNavigation(true);
              // Add delay to allow exit animation to play
              setTimeout(() => {
                setShowNavigation(false);
                hasShownNavigation.current = false;
                setIsExitingNavigation(false);
              }, 800); // Match the exit animation duration
            }
            
            // TEXT ANIMATIONS - Now handled in the main timeline for proper timing (no more conflicting ScrollTriggers!)
            
            // Update previous progress for next frame
            prevProgress.current = currentProgress;
    }
  }
});



      const videoWidth = 373;
      const videoHeight = 202;
      const centerX = window.innerWidth / 2 - videoWidth/2;
      const centerY = window.innerHeight / 2 - videoHeight/2;
      const titleElement = container.querySelector('.video-title');
      
      gsap.set(titleElement, {
        fontSize: '72px',
        lineHeight: '82px'
      });

      // Converge videos to center - Much faster
      videoElements.forEach((video, index) => {
        const offset = 20;
        const finalX = centerX + (index === 2 ? 0 : (Math.random() * 2 - 1) * offset);
        const finalY = centerY + (index === 2 ? 0 : (Math.random() * 2 - 1) * offset);
        
        tl.to(video, {
          x: finalX,
          y: finalY,
          duration: 0.15, // Reduced from 0.2s to 0.15s
          ease: "power2.inOut"
        }, "<");
      });

      tl.to({}, { duration: 0.05 }); // Reduced from 0.1s to 0.05s

      // Scale text and expand videos - Much faster to give time to sliding page
      tl.to(titleElement, {
        fontSize: '75.6px',
        lineHeight: '86.1px',
        duration: 0.7, // Reduced from 1.0s to 0.7s
        ease: "power1.inOut"
      });

      videoElements.forEach((video) => {
        tl.to(video, {
          width: "100vw",
          height: "100vh",
          x: 0,
          y: 0,
          duration: 1.0, // Reduced from 1.5s to 1.0s
          ease: "power1.inOut"
        }, "<");
      });

      tl.to({}, { duration: 0.2 }); // Reduced from 0.3s to 0.2s

      // TEXT ANIMATIONS - HAPPEN BEFORE SLIDING PAGE MOVES UP!
      // Capture text animation (starts immediately after videos converge)
      if (captureLettersRef.current && captureLettersRef.current.length > 0) {
        // Set initial state for capture letters
        gsap.set(captureLettersRef.current, {
          yPercent: 25,  // Start 25% below
          opacity: 1, // Changed from 0 to 1 - always visible
          rotation: gsap.utils.random(-15, 15),
          scale: 0.5,
          visibility: "visible"
        });
        
        // Create scroll-triggered animation for capture text
        gsap.to(captureLettersRef.current, {
          yPercent: 0,
          rotation: 0,
          scale: 1,
          stagger: 0.05,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container, // Use main container as trigger
            start: () => `top+=${Math.abs(slidingPagePosition * window.innerHeight / 100)}px`, // Trigger based on sliding page position
            end: () => `top+=${Math.abs((slidingPagePosition - 100) * window.innerHeight / 100)}px`, // End when sliding page moves 100vh
            scrub: 1,
            markers: false,
            onUpdate: (self) => {
              // Only animate when sliding page Y is around -268vh (Capture section)
              if (slidingPagePosition <= -248 && slidingPagePosition >= -288) {
                self.progress = Math.abs((slidingPagePosition + 268) / 40); // Normalize to 0-1 range
              } else {
                self.progress = 0;
              }
            }
          }
        });
        
        // Animate letters to their individual final positions with scroll trigger
        captureLettersRef.current.forEach((letter, index) => {
          gsap.to(letter, {
            left: `${(index - 3) * 20}px`,
            top: `${Math.sin(index * 0.5) * 15}px`,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container, // Use main container as trigger
              start: () => `top+=${Math.abs(slidingPagePosition * window.innerHeight / 100)}px`, // Trigger based on sliding page position
              end: () => `top+=${Math.abs((slidingPagePosition - 100) * window.innerHeight / 100)}px`, // End when sliding page moves 100vh
              scrub: 1,
              markers: false,
              onUpdate: (self) => {
                // Only animate when sliding page Y is around -268vh (Capture section)
                if (slidingPagePosition <= -248 && slidingPagePosition >= -288) {
                  self.progress = Math.abs((slidingPagePosition + 268) / 40); // Normalize to 0-1 range
                } else {
                  self.progress = 0;
                }
              }
            }
          });
        });
      }

      // Brief pause
      tl.to({}, { duration: 0.1 }); // Reduced from 0.2s to 0.1s

      // Explore text animation (right after Capture)
      if (exploreLettersRef.current && exploreLettersRef.current.length > 0) {
        // Set initial state for explore letters
        gsap.set(exploreLettersRef.current, {
          yPercent: 25,  // Start 25% below
          opacity: 1, // Changed from 0 to 1 - always visible
          rotation: gsap.utils.random(-15, 15),
          scale: 0.5,
          visibility: "visible"
        });
        
        // Create scroll-triggered animation for explore text
        gsap.to(exploreLettersRef.current, {
          yPercent: 0,
          rotation: 0,
          scale: 1,
          stagger: 0.05,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container, // Use main container as trigger
            start: () => `top+=${Math.abs(slidingPagePosition * window.innerHeight / 100)}px`, // Trigger based on sliding page position
            end: () => `top+=${Math.abs((slidingPagePosition - 100) * window.innerHeight / 100)}px`, // End when sliding page moves 100vh
            scrub: 1,
            markers: false,
            onUpdate: (self) => {
              // Only animate when sliding page Y is around -267.5vh (Explore section)
              if (slidingPagePosition <= -247.5 && slidingPagePosition >= -287.5) {
                self.progress = Math.abs((slidingPagePosition + 267.5) / 40); // Normalize to 0-1 range
              } else {
                self.progress = 0;
              }
            }
          }
        });
        
        // Animate letters to their individual final positions with scroll trigger
        exploreLettersRef.current.forEach((letter, index) => {
          gsap.to(letter, {
            left: `${(index - 3) * 18}px`,
            top: `${Math.cos(index * 0.6) * 20}px`,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container, // Use main container as trigger
              start: () => `top+=${Math.abs(slidingPagePosition * window.innerHeight / 100)}px`, // Trigger based on sliding page position
              end: () => `top+=${Math.abs((slidingPagePosition - 100) * window.innerHeight / 100)}px`, // End when sliding page moves 100vh
              scrub: 1,
              markers: false,
              onUpdate: (self) => {
                // Only animate when sliding page Y is around -267.5vh (Explore section)
                if (slidingPagePosition <= -247.5 && slidingPagePosition >= -287.5) {
                  self.progress = Math.abs((slidingPagePosition + 267.5) / 40); // Normalize to 0-1 range
                } else {
                  self.progress = 0;
                }
              }
            }
          });
        });
      }

      // Brief pause
      tl.to({}, { duration: 0.1 }); // Reduced from 0.2s to 0.1s

      // Live text animation (right after Explore)
      if (liveLettersRef.current && liveLettersRef.current.length > 0) {
        // Set initial state for live letters
        gsap.set(liveLettersRef.current, {
          yPercent: 25,  // Start 25% below
          opacity: 1, // Changed from 0 to 1 - always visible
          rotation: gsap.utils.random(-15, 15),
          scale: 0.5,
          visibility: "visible"
        });
        
        // Create scroll-triggered animation for live text
        gsap.to(liveLettersRef.current, {
          yPercent: 0,
          rotation: 0,
          scale: 1,
          stagger: 0.05,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container, // Use main container as trigger
            start: () => `top+=${Math.abs(slidingPagePosition * window.innerHeight / 100)}px`, // Trigger based on sliding page position
            end: () => `top+=${Math.abs((slidingPagePosition - 100) * window.innerHeight / 100)}px`, // End when sliding page moves 100vh
            scrub: 1,
            markers: false,
            onUpdate: (self) => {
              // Only animate when sliding page Y is around -335.6vh (Live section)
              if (slidingPagePosition <= -315.6 && slidingPagePosition >= -355.6) {
                self.progress = Math.abs((slidingPagePosition + 335.6) / 40); // Normalize to 0-1 range
              } else {
                self.progress = 0;
              }
            }
          }
        });
        
        // Animate letters to their individual final positions with scroll trigger
        liveLettersRef.current.forEach((letter, index) => {
          gsap.to(letter, {
            left: `${(index - 1.5) * 25}px`,
            top: `${Math.sin(index * 1.2) * 25}px`,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container, // Use main container as trigger
              start: () => `top+=${Math.abs(slidingPagePosition * window.innerHeight / 100)}px`, // Trigger based on sliding page position
              end: () => `top+=${Math.abs((slidingPagePosition - 100) * window.innerHeight / 100)}px`, // End when sliding page moves 100vh
              scrub: 1,
              markers: false,
              onUpdate: (self) => {
                // Only animate when sliding page Y is around -335.6vh (Live section)
                if (slidingPagePosition <= -315.6 && slidingPagePosition >= -355.6) {
                  self.progress = Math.abs((slidingPagePosition + 335.6) / 40); // Normalize to 0-1 range
                } else {
                  self.progress = 0;
                }
              }
            }
          });
        });
      }

      // Brief pause before sliding page
      tl.to({}, { duration: 0.15 }); // Reduced from 0.3s to 0.15s

      // Slide up the sliding page - AFTER text animations complete
      // Increased duration to compensate for much faster video scaling
      tl.to(slidingPage, {
        y: "-100%",
        duration: 7.0, // Increased from 5.5s to 7.0s to compensate for much faster video scaling
        ease: "power1.inOut"
      });

      // Brief pause before zoom (only if legacy zoom section exists)
      if (hasZoomTargets) {
        tl.to({}, { duration: 2.0 });

        // Legacy ZOOM ANIMATION (kept guarded; new ZoomReveal handles zoom)
        tl.to(zoomImageRef.current, {
          width: "100vw",
          height: "100vh",
          x: 0,
          y: 0,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          duration: 3,
          ease: "power2.inOut",
        }, "zoomStart")
        .to(zoomSectionRef.current, {
          backgroundColor: "transparent",
          duration: 0.5,
          ease: "power2.inOut"
        }, "+=2.5")
        .to(zoomTextLeftRef.current, {
          x: -window.innerWidth * 0.8 + 15,
          duration: 3,
          ease: "power2.out"
        }, "zoomStart")
        .to(zoomTextRightRef.current, {
          x: window.innerWidth * 0.8 - 15,
          duration: 3,
          ease: "power2.out"
        }, "zoomStart");


      }

            // TIMELINE-INTEGRATED TEXT ANIMATIONS - No more conflicting ScrollTriggers!
      
      // Debug: Check if refs are populated
      console.log('🔍 Debug - Capture letters ref:', captureLettersRef.current);
      console.log('🔍 Debug - Explore letters ref:', exploreLettersRef.current);
      console.log('🔍 Debug - Live letters ref:', liveLettersRef.current);
      
      // Setup text animations integrated into main timeline
      const setupTextAnimations = (lettersRef, textName) => {
        if (lettersRef.current && lettersRef.current.length > 0) {
          console.log(`🎯 Setting up ${textName} text animations, letters found:`, lettersRef.current.length);
          
          // Set initial state for all letters
          lettersRef.current.forEach((letter, index) => {
            gsap.set(letter, {
              yPercent: 25,  // Start 25% below
              opacity: 1, // Changed from 0 to 1 - always visible
              rotation: gsap.utils.random(-15, 15),
              scale: 0.5,
              visibility: "visible"
            });
          });

          // Add magnetic cursor effect
          lettersRef.current.forEach((letter) => {
            letter.addEventListener('mousemove', (e) => {
              const rect = letter.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
              
              if (distance < 150) {
                const strength = (150 - distance) / 150;
                const moveX = (e.clientX - centerX) * strength * 0.3;
                const moveY = (e.clientY - centerY) * strength * 0.3;
                const scale = 1 + strength * 0.2;
                
                gsap.to(letter, {
                  x: moveX,
                  y: moveY,
                  scale: scale,
                  duration: 0.3,
                  ease: "power2.out"
                });
              }
            });

            letter.addEventListener('mouseleave', () => {
              gsap.to(letter, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
              });
            });
          });
        }
      };

      // Setup animations for all text sections
      setupTextAnimations(captureLettersRef, "Capture");
      setupTextAnimations(exploreLettersRef, "Explore");
      setupTextAnimations(liveLettersRef, "Live");

      

              return () => {
          if (tl) tl.kill();
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    } catch (error) {
      console.error('VideoScroll useEffect error:', error);
    }
  }, []);

  // Real-time sliding page position tracker
  useEffect(() => {
    const updatePosition = () => {
      if (slidingPageRef.current) {
        const transform = getComputedStyle(slidingPageRef.current).transform;
        if (transform && transform !== 'none') {
          const matrix = transform.match(/matrix.*\((.+)\)/);
          if (matrix) {
            const values = matrix[1].split(', ');
            const translateY = parseFloat(values[5]) || 0;
            const positionVh = (translateY / window.innerHeight) * 100;
            setSlidingPagePosition(positionVh);
          }
        }
      }
    };

    // Update position every frame for smooth tracking
    const interval = setInterval(updatePosition, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  // Position ZoomReveal wrapper immediately after the ImageStack section (no hardcoded vh)
  useEffect(() => {
    const placeZoomAfterStack = () => {
      const stackEl = imageStackSectionRef.current;
      const zoomEl = zoomWrapperRef.current;
      if (!stackEl || !zoomEl) return;
      
      // Get the exact position where ImageStack ends
      const stackBottom = stackEl.offsetTop + stackEl.offsetHeight;
      
      // Position zoom wrapper to start exactly where ImageStack ends
      zoomEl.style.top = `${stackBottom}px`;
      
      // Ensure the wrapper covers the full viewport height from this point
      zoomEl.style.height = '100vh';
      
      // Add a small overlap to prevent any gaps
      zoomEl.style.marginTop = '-1px';
    };
    
    placeZoomAfterStack();
    window.addEventListener('resize', placeZoomAfterStack);
    return () => window.removeEventListener('resize', placeZoomAfterStack);
  }, []);

  return (
          <div ref={containerRef} className="video-scroll-container">
        <div ref={slidingPageRef} className="sliding-page">
        <div className="sliding-page-content">
          <div className="sliding-page-text" style={{ cursor: "url('/W/Vector.png') 0 0, text" }}>
            We use the power of storytelling to<br/>
            fire the imagination, stir the soul,<br/>
            and ultimately inspire people.
          </div>
          <div className="sliding-page-images">
            <img src="/forest.png" alt="Forest" className="sliding-page-image forest" />
            <img src="/Building.png" alt="Building" className="sliding-page-image building" />
          </div>
        </div>
        <div className="image-stack-section" ref={imageStackSectionRef}>
          <ImageStack />
        </div>
        {/* New Zoom Reveal Section - positioned right after ImageStack (100vh text + 100vh stack = 200vh) */}
        <div ref={zoomWrapperRef} style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 400,
          background: 'white', // Ensure solid background
          overflow: 'hidden' // Prevent any content from showing outside bounds
        }}>
          <ZoomReveal imageSrc="/1221.png" />
        </div>
        

        
      </div>
      
      {/* Comprehensive Scroll Tracker - ALWAYS VISIBLE */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '15px',
        zIndex: 9999,
        fontSize: '11px',
        fontFamily: 'monospace',
        minWidth: '280px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '5px' }}>
          📊 SCROLL TRACKER
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Progress:</span> {(prevProgress.current * 100).toFixed(2)}%
        </div>
        
        {/* Visual Progress Bar */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(prevProgress.current * 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00FF00, #FFD700, #FF6B6B)',
              borderRadius: '3px',
              transition: 'width 0.1s ease'
            }} />
          </div>
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Sliding Page Y:</span> 
          <span style={{ color: '#87CEEB', fontWeight: 'bold' }}>
            {slidingPagePosition.toFixed(1)}vh
          </span>
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Scroll Direction:</span> 
          <span style={{ 
            color: prevProgress.current > (prevProgress.current || 0) ? '#00FF00' : 
                   prevProgress.current < (prevProgress.current || 0) ? '#FF6B6B' : '#FFFFFF'
          }}>
            {prevProgress.current > (prevProgress.current || 0) ? '⬇️ DOWN' : 
             prevProgress.current < (prevProgress.current || 0) ? '⬆️ UP' : '➡️ IDLE'}
          </span>
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Navigation:</span> 
          <span style={{ color: showNavigation ? '#00FF00' : '#FF6B6B' }}>
            {showNavigation ? '🟢 ON' : '🔴 OFF'}
          </span>
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Exiting:</span> 
          <span style={{ color: isExitingNavigation ? '#FFA500' : '#87CEEB' }}>
            {isExitingNavigation ? '🟠 EXITING' : '🔵 STABLE'}
          </span>
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Has Shown:</span> 
          <span style={{ color: hasShownNavigation.current ? '#00FF00' : '#FF6B6B' }}>
            {hasShownNavigation.current ? '✅ YES' : '❌ NO'}
          </span>
        </div>
        

        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Window Height:</span> {window.innerHeight}px
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Document Height:</span> {document.documentElement.scrollHeight}px
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Scroll Top:</span> {window.pageYOffset || document.documentElement.scrollTop}px
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Scroll Speed:</span> 
          <span style={{ 
            color: scrollSpeed > 2 ? '#FF6B6B' : 
                   scrollSpeed > 0.5 ? '#FFD700' : '#00FF00'
          }}>
            {scrollSpeed.toFixed(2)}/s
          </span>
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Current Section:</span>
          <span style={{ color: '#87CEEB', fontWeight: 'bold' }}>
            {prevProgress.current < 0.80 ? '🎬 Videos Converging' : 
             '🔍 Zoom Complete - Nav Ready'}
          </span>
        </div>
        
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#FFD700' }}>Zoom Section:</span> 
          <span style={{ color: '#87CEEB' }}>
            {prevProgress.current > 0.7 && prevProgress.current < 0.8 ? '🎯 ACTIVE' : '⏸️ INACTIVE'}
          </span>
        </div>
      </div>
      
      <div ref={wrapperRef} className="videos-wrapper">
        {videos.map((videoSrc, index) => (
          <video
            key={index}
            ref={el => videosRef.current[index] = el}
            className="scroll-video"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
          />
        ))}
        <h1 className="video-title">
          Exposure<br />Explorers
        </h1>
      </div>
    </div>
  );
};

export default VideoScroll;