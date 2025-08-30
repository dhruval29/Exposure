import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import './base-styles.css';
import './scroll-sections.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function SonyCamera() {
  const { scene } = useGLTF('/sony9.glb');
  const { camera } = useThree();
  const groupRef = useRef();
  const [lcdScreen, setLcdScreen] = useState(null);
  const [videoTexture, setVideoTexture] = useState(null);

  // GSAP animation setup - starts with LCD filling window, then animates
  useLayoutEffect(() => {
    if (!groupRef.current || !camera) return;

    const matchMedia = gsap.matchMedia();
    const scrollTriggers = []; // Track all ScrollTrigger instances

    matchMedia.add({
      isDesktop: "(min-width: 800px)",
      isMobile: "(max-width: 799px)"
    }, (context) => {
      const { isMobile, isDesktop } = context.conditions;

      // Camera animations start after hero section is fully pulled up
      const positionTrigger = gsap.to(camera.position, {
        z: 12,
        y: 1,
        scrollTrigger: {
          trigger: ".one",
          start: "top top", // Changed from "18% top" to start immediately
          end: "+=300vh", // Back to original 300vh
          scrub: 2, // Increased from 0.5 for smooth animation
          ease: "none",
          immediateRender: false, // Prevent initial render issues
          invalidateOnRefresh: true, // Refresh on window resize
          fastScrollEnd: true, // Better fast scroll handling
        }
      });

      const rotationTrigger = gsap.to(groupRef.current.rotation, {
        y: 1.25 * Math.PI,
        scrollTrigger: {
          trigger: ".one",
          start: "top top", // Changed from "18% top" to start immediately
          end: "+=300vh", // Back to original 300vh
          scrub: 2, // Increased from 0.5 for smooth animation
          ease: "none",
          immediateRender: false,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        }
      });

      const positionTrigger2 = gsap.to(groupRef.current.position, {
        x: -0.3,
        y: -1.0,
        scrollTrigger: {
          trigger: ".one",
          start: "top top", // Changed from "18% top" to start immediately
          end: "+=300vh", // Back to original 300vh
          scrub: 2, // Increased from 0.5 for smooth animation
          ease: "none",
          immediateRender: false,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        }
      });

      const scaleTrigger = gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1, 
        z: 1,
        scrollTrigger: {
          trigger: ".one",
          start: "top top", // Changed from "18% top" to start immediately
          end: "+=300vh", // Back to original 300vh
          scrub: 2.5, // Increased from 0.5 for smooth animation
          ease: "none",
          immediateRender: false,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        }
      });

      // Store ScrollTrigger instances for cleanup
      scrollTriggers.push(
        positionTrigger.scrollTrigger,
        rotationTrigger.scrollTrigger,
        positionTrigger2.scrollTrigger,
        scaleTrigger.scrollTrigger
      );
    });

    return () => {
      // Clean up all ScrollTrigger instances
      scrollTriggers.forEach(trigger => {
        if (trigger && trigger.kill) {
          trigger.kill();
        }
      });
      matchMedia.kill();
    };
  }, [camera]);

  // Find LCD screen (once on load) - no scaling calculations
  useEffect(() => {
    if (!scene) return;

    // Find LCD screen plane - simple approach
    let lcd = null;
    
    scene.traverse((child) => {
      if (child.isMesh && child.name === 'Plane') {
        lcd = child; // Just use the first plane we find
      }
    });

    setLcdScreen(lcd);
  }, [scene]);

  // Video texture setup - back to LCD screen
  useEffect(() => {
    const video = document.createElement('video');
    video.src = '/VIDEO.mp4';
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    
    const handleVideoLoad = () => {
      video.play().then(() => {
        const texture = new THREE.VideoTexture(video);
        texture.flipY = false;
        setVideoTexture(texture);
      }).catch((error) => {
        console.warn('Video autoplay failed:', error);
        // Fallback: still create texture even if autoplay fails
        const texture = new THREE.VideoTexture(video);
        texture.flipY = false;
        setVideoTexture(texture);
      });
    };

    const handleVideoError = (error) => {
      console.warn('Video loading failed:', error);
    };

    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('error', handleVideoError);

    return () => {
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('error', handleVideoError);
    };
  }, []);

  // Copy/paste video directly onto LCD plane
  useEffect(() => {
    if (lcdScreen && videoTexture) {
      lcdScreen.material = new THREE.MeshBasicMaterial({
        map: videoTexture
      });
    }
  }, [lcdScreen, videoTexture]);

  if (!scene) return null;

  return (
    <group 
      ref={groupRef}
      position={[0.85, -1.3, 0]} // Moved camera 0.05 to the right on X-axis at start
      rotation={[0, 1 * Math.PI, 0]} // Rotate so LCD faces forward
      scale={[1.25, 1.25, 1]} // Scale camera bigger at start - even more prominent LCD
    >
      <primitive object={scene} />
    </group>
  );
}

export default function GSAPCameraSection() {
  const canvasRef = useRef();

  useEffect(() => {
    // Force enable scrolling
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';

    // Add scroll event listener for better scroll handling
    const handleScroll = () => {
      // Force ScrollTrigger refresh on scroll with throttling
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Refresh ScrollTrigger instances after a delay
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Font loading and global styles */}
      <style>{`
        @font-face {
          font-family: 'PPEditorialNew';
          src: url('/fonts/PPEditorialNew-Regular-BF644b214ff145f.otf') format('opentype');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'PPEditorialNew';
          src: url('/fonts/PPEditorialNew-Italic-BF644b214fb0c0a.otf') format('opentype');
          font-weight: 400;
          font-style: italic;
        }
        @font-face {
          font-family: 'PPEditorialNew';
          src: url('/fonts/PPEditorialNew-Ultrabold-BF644b21500840c.otf') format('opentype');
          font-weight: 800;
          font-style: normal;
        }
        @font-face {
          font-family: 'Geist';
          src: url('/fonts/Geist-Regular.ttf') format('truetype');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'Geist';
          src: url('/fonts/Geist-Light.ttf') format('truetype');
          font-weight: 300;
          font-style: normal;
        }
        @font-face {
          font-family: 'Geist';
          src: url('/fonts/Geist-Thin.ttf') format('truetype');
          font-weight: 100;
          font-style: normal;
        }
      `}</style>

      {/* UNIVERSAL SCROLL - Camera overlay with invisible scroll area */}
      
      {/* Fixed Canvas overlay - visual only */}
      <div 
        ref={canvasRef}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100vh', 
          zIndex: 1,
          pointerEvents: 'none', // Canvas doesn't block scroll
          background: '#121212'
        }}
      >
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 30 }}
          gl={{ 
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: true
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Enhanced Lighting Setup - Boosted Top Lighting */}
          {/* Ambient light - increased for better top lighting */}
          <ambientLight intensity={2.5} color="#ffffff" />
          
          {/* Main directional lights - boosted top lights */}
          <directionalLight position={[10, 10, 5]} intensity={3.2} color="#ffffff" />
          <directionalLight position={[-8, 8, 5]} intensity={2.4} color="#f0f0ff" />
          
          {/* Additional strong top light */}
          <directionalLight position={[0, 12, 3]} intensity={2.8} color="#ffffff" />
          
          {/* Additional directional lights for better coverage - Enhanced backlights */}
          <directionalLight position={[0, -10, 5]} intensity={2.0} color="#fff8f0" />
          <directionalLight position={[15, 0, 8]} intensity={1.8} color="#ffffff" />
          
          {/* Enhanced backlights and rimlights */}
          <pointLight position={[0, 0, 15]} intensity={2.5} color="#ffffff" /> {/* Strong backlight */}
          <pointLight position={[8, 8, 8]} intensity={1.8} color="#f0f8ff" /> {/* Right rimlight */}
          <pointLight position={[-8, 8, 8]} intensity={1.8} color="#fff8f0" /> {/* Left rimlight */}
          <pointLight position={[0, -8, 12]} intensity={1.5} color="#ffffff" /> {/* Bottom backlight */}
          
          {/* Additional rimlights for better edge definition */}
          <pointLight position={[12, -4, 10]} intensity={1.2} color="#e0f0ff" />
          <pointLight position={[-12, -4, 10]} intensity={1.2} color="#ffe0f0" />
          
          {/* Boosted spotlights - much brighter */}
          <spotLight 
            position={[0, 15, 0]} 
            angle={0.4} 
            penumbra={0.8} 
            intensity={3.5} // Boosted top spotlight
            color="#ffffff"
          />
          {/* Much stronger rimlight spots from sides */}
          <spotLight 
            position={[12, 8, 10]} 
            angle={0.3} 
            penumbra={0.6} 
            intensity={4.0} // Much brighter rimlight
            color="#f0f8ff"
          />
          <spotLight 
            position={[-12, 8, 10]} 
            angle={0.3} 
            penumbra={0.6} 
            intensity={4.0} // Much brighter rimlight
            color="#fff8f0"
          />
          
          {/* Enhanced backlight spots for edge definition */}
          <spotLight 
            position={[8, -6, 15]} 
            angle={0.25} 
            penumbra={0.7} 
            intensity={2.8} // Boosted backlight
            color="#ffffff"
          />
          <spotLight 
            position={[-8, -6, 15]} 
            angle={0.25} 
            penumbra={0.7} 
            intensity={2.8} // Boosted backlight
            color="#f8f8ff"
          />
          
          <SonyCamera />
          
          <OrbitControls enabled={false} />
        </Canvas>
      </div>

      {/* Camera scroll area - this is what allows scrolling past the animation */}
      <div style={{ 
        height: '300vh', // Back to original 300vh
        width: '100%',
        background: 'transparent',
        position: 'relative',
        zIndex: 2,
        pointerEvents: 'auto' // This allows scrolling
      }} className="one">
        <div style={{ height: '300vh', width: '100%' }} />
      </div>
      
      {/* Smooth pull transition to next section */}
      <div style={{
        position: 'absolute',
        bottom: '-100vh', // Back to original -100vh
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(to bottom, transparent, #121212)',
        zIndex: 3,
        pointerEvents: 'none'
      }} />
    </>
  );
}

// Preload the model
useGLTF.preload('/sony9.glb');
