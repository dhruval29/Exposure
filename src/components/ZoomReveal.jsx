import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import NavigationMenu from './NavigationMenu';

gsap.registerPlugin(ScrollTrigger);

const EXTRA_SCROLL_PAD = 1.2; // Extra scroll distance after zoom before nav shows

const ZoomReveal = ({
  imageSrc = '/1221.png',
  leftText = 'Take a closer',
  rightText = 'look at Life'
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const [showNav, setShowNav] = useState(false);
  const [trackerInfo, setTrackerInfo] = useState({
    leftTextX: 0,
    rightTextX: 0,
    imageWidth: 0,
    imageHeight: 0,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  });

  useEffect(() => {
    const container = containerRef.current;
    const img = imageRef.current;
    const left = leftTextRef.current;
    const right = rightTextRef.current;

    if (!container || !img || !left || !right) return;

    gsap.set([left, right], { x: 0 });

    // Ensure text is visible immediately and above everything
    gsap.set([left, right], { zIndex: 5000, opacity: 1 });

    // Add tracking for real-time position monitoring
    const updateTracker = () => {
      if (left && right && img) {
        const leftRect = left.getBoundingClientRect();
        const rightRect = right.getBoundingClientRect();
        const imageRect = img.getBoundingClientRect();
        
        setTrackerInfo({
          leftTextX: Math.round(leftRect.left + leftRect.width / 2),
          rightTextX: Math.round(rightRect.left + rightRect.width / 2),
          imageWidth: Math.round(imageRect.width),
          imageHeight: Math.round(imageRect.height),
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight
        });
      }
    };

    // Update tracker every 100ms during animation
    const trackerInterval = setInterval(updateTracker, 100);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        end: '+=120%',
        scrub: 1,
        markers: false
      }
    });

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
      duration: 2.5,
      ease: 'power2.inOut'
    }, 'zoomStart')
    .to(left, {
      x: -window.innerWidth * 0.05 + 15, // Changed from 0.1 to 0.05 (5%) to reduce jump by 50%
      duration: 5.5, // Much longer duration for very slow movement
      ease: 'power1.out', // Changed to power1.out for more gradual movement
      delay: 0.3 // Small delay to let image start scaling first
    }, 'zoomStart')
    .to(right, {
      x: window.innerWidth * 0.05 - 15, // Changed from 0.1 to 0.05 (5%) to reduce jump by 50%
      duration: 5.5, // Much longer duration for very slow movement
      ease: 'power1.out', // Changed to power1.out for more gradual movement
      delay: 0.3 // Small delay to let image start scaling first
    }, 'zoomStart')
    // Add extra scroll-only padding after zoom completes (no visual change)
    .to({}, { duration: EXTRA_SCROLL_PAD })
    .add(() => {
      // Show nav immediately (scroll-controlled elsewhere if needed)
      setShowNav(true);
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      clearInterval(trackerInterval); // Clear interval on cleanup
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000, // Ensure it's above background elements
        isolation: 'isolate' // Create new stacking context
      }}
    >
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: 'white', // Additional background layer
        zIndex: 1001
      }}>
        {/* Background overlay to ensure complete coverage */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'white',
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
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
            zIndex: 500
          }}
        />

        <div
          ref={leftTextRef}
          style={{
            position: 'absolute',
            right: 'calc(50% + 0.01px + 15.5px)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'black',
            fontSize: 66.7,
            fontFamily: 'Helvetica',
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
            left: 'calc(50% + 0.01px + 4.5px)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'black',
            fontSize: 66.7,
            fontFamily: 'Helvetica',
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
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            opacity: 1
          }}
        >
          <NavigationMenu isExiting={false} />
        </div>
      )}

      {/* Text Box Tracker - Always Visible */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '12px',
          zIndex: 9999,
          minWidth: '300px',
          border: '1px solid #333'
        }}
      >
        <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#00ff00' }}>
          📍 TEXT BOX TRACKER
        </div>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#ff6b6b' }}>Left Text X:</span> {trackerInfo.leftTextX}px
        </div>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#4ecdc4' }}>Right Text X:</span> {trackerInfo.rightTextX}px
        </div>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#45b7d1' }}>Image Width:</span> {trackerInfo.imageWidth}px
        </div>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#96ceb4' }}>Image Height:</span> {trackerInfo.imageHeight}px
        </div>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#feca57' }}>Screen:</span> {trackerInfo.screenWidth} × {trackerInfo.screenHeight}
        </div>
        <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
          Distance from center: {Math.abs(trackerInfo.leftTextX - trackerInfo.screenWidth / 2)}px
        </div>
      </div>
    </div>
  );
};

export default ZoomReveal;


