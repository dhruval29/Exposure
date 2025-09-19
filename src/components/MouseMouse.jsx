import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import styles from './MouseMouse.module.css';


const MouseMouse = ({ visible = true, zIndex = 3000 }) => {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSuppressed, setIsSuppressed] = useState(false);

  // Performance-optimized mouse tracking
  const mouseRef = useRef({ x: 0, y: 0, nX: 0, nY: 0 });
  const animationRef = useRef(null);
  const imagesRef = useRef([]);
  const settingsRef = useRef({});
  const timeRef = useRef(0);
  const centerRadiusRef = useRef(0);
  const suppressionTargetRef = useRef(1); // 1 = normal size, ~0.1 = minimized
  const suppressionCurrentRef = useRef(1);

  // Touch detection - enhanced mobile detection
  const isTouch = useCallback(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  const isMobileDevice = useCallback(() => {
    // Enhanced mobile detection
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth <= 768
    );
  }, []);

  // Optimized mouse move handler with throttling
  const onMouseMove = useCallback((e) => {
    const mouse = mouseRef.current;
    mouse.x = Math.max(0, Math.min(e.clientX, window.innerWidth));
    mouse.y = Math.max(0, Math.min(e.clientY, window.innerHeight));
    mouse.nX = (mouse.x / window.innerWidth) * 2 - 1;
    mouse.nY = -(mouse.y / window.innerHeight) * 2 + 1;
  }, []);

  // Responsive settings calculation
  const updateSettings = useCallback(() => {
    const settings = settingsRef.current;
    
    if (window.innerWidth >= 1920) {
      settings.imgSize = window.innerHeight * 0.08;
      settings.maxDistance = window.innerHeight * 0.35;
    } else if (window.innerWidth >= 1440) {
      settings.imgSize = window.innerHeight * 0.075;
      settings.maxDistance = window.innerHeight * 0.3;
    } else if (window.innerWidth >= 1024) {
      settings.imgSize = window.innerHeight * 0.07;
      settings.maxDistance = window.innerHeight * 0.25;
    } else {
      settings.imgSize = window.innerHeight * 0.05;
      settings.maxDistance = window.innerHeight * 0.2;
    }
    
    settings.gap = window.innerHeight * 0.04;
    settings.step = settings.imgSize + settings.gap;
    settings.cols = Math.ceil(window.innerWidth / settings.step) + 2;
    settings.rows = Math.ceil(window.innerHeight / settings.step) + 2;
  }, []);

  // Canvas resize with performance optimization
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    updateSettings();
    centerRadiusRef.current = Math.min(window.innerWidth * 0.75, window.innerHeight * 0.75);
  }, [updateSettings]);

  // Image data (using sliding content images) - memoized for performance
  const imageData = useMemo(() => [
    { id: 'img1', path: '/assets/images/ui/1.webp' },
    { id: 'img2', path: '/assets/images/ui/2.webp' },
    { id: 'img3', path: '/assets/images/ui/3.webp' },
    { id: 'img4', path: '/assets/images/ui/4.webp' },
    { id: 'img5', path: '/assets/images/ui/5.webp' },
    { id: 'img6', path: '/assets/images/ui/6.webp' },
    { id: 'img7', path: '/assets/images/ui/7.webp' },
    { id: 'img8', path: '/assets/images/ui/8.webp' },
    { id: 'img9', path: '/assets/images/ui/9.webp' },
    { id: 'img10', path: '/assets/images/ui/10.webp' },
    { id: 'img11', path: '/assets/images/ui/11.webp' },
    { id: 'img12', path: '/assets/images/ui/12.webp' },
    { id: 'img13', path: '/assets/images/ui/13.webp' },
    { id: 'img14', path: '/assets/images/ui/14.webp' },
    { id: 'img15', path: '/assets/images/ui/15.webp' }
  ], []);

  // Load images with error handling and fallbacks
  const loadImages = useCallback(async () => {
    const imageUrls = imageData.flatMap(data => 
      Array(6).fill(null).map(() => ({ url: data.path }))
    );
    
    const shuffled = imageUrls.sort(() => Math.random() - 0.5);
    
    const promises = shuffled.map(data => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const ratio = img.width / img.height;
          resolve({ ...data, img, ratio });
        };
        img.onerror = () => {
          const fallbackCanvas = document.createElement('canvas');
          fallbackCanvas.width = 200;
          fallbackCanvas.height = 200;
          const fallbackCtx = fallbackCanvas.getContext('2d');
          
          const gradient = fallbackCtx.createLinearGradient(0, 0, 200, 200);
          const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, color + '80');
          
          fallbackCtx.fillStyle = gradient;
          fallbackCtx.fillRect(0, 0, 200, 200);
          
          const fallbackImg = new Image();
          fallbackImg.onload = () => resolve({ ...data, img: fallbackImg, ratio: 1 });
          fallbackImg.src = fallbackCanvas.toDataURL();
        };
        img.src = data.url;
      });
    });
    
    imagesRef.current = await Promise.all(promises);
    setIsLoaded(true);
  }, [imageData]);

  // Main animation loop with performance optimizations
  const animate = useCallback(() => {
    if (!isActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const settings = settingsRef.current;
    const images = imagesRef.current;
    const mouse = mouseRef.current;
    
    timeRef.current += 0.016;
    if (timeRef.current > 1000) {
      timeRef.current = 0;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ease suppression scale towards target with smoother transition
    suppressionCurrentRef.current = suppressionCurrentRef.current + (suppressionTargetRef.current - suppressionCurrentRef.current) * 0.08;
    
    let centerX, centerY;
    if (isTouch()) {
      centerX = window.innerWidth * 0.5 + centerRadiusRef.current * 0.75 * Math.cos(timeRef.current * 0.75);
      centerY = window.innerHeight * 0.5 + centerRadiusRef.current * Math.sin(timeRef.current * 0.75);
    } else {
      centerX = mouse.x;
      centerY = mouse.y;
    }
    
    const totalCols = Math.ceil(window.innerWidth / settings.step) + 2;
    const totalRows = Math.ceil(window.innerHeight / settings.step) + 2;
    
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < totalCols; col++) {
        const imageIndex = (col + row * totalCols) % images.length;
        const image = images[imageIndex];
        if (!image || !image.img) continue;
        
        const baseX = col * settings.step;
        const baseY = row * settings.step;
        
        const scrollX = timeRef.current * 37.5;
        const scrollY = timeRef.current * 22.5;
        
        const x = baseX - scrollX;
        const y = baseY - scrollY;
        
        let wrappedX = x;
        let wrappedY = y;
        
        while (wrappedX < -settings.step) {
          wrappedX += window.innerWidth + settings.step;
        }
        while (wrappedX > window.innerWidth) {
          wrappedX -= window.innerWidth + settings.step;
        }
        while (wrappedY < -settings.step) {
          wrappedY += window.innerHeight + settings.step;
        }
        while (wrappedY > window.innerHeight) {
          wrappedY -= window.innerHeight + settings.step;
        }
        
        if (wrappedX + settings.imgSize > 0 && wrappedX < window.innerWidth && 
            wrappedY + settings.imgSize > 0 && wrappedY < window.innerHeight) {
          
          let drawWidth, drawHeight;
          if (image.ratio > 1) {
            drawWidth = settings.imgSize;
            drawHeight = drawWidth / image.ratio;
          } else {
            drawHeight = settings.imgSize;
            drawWidth = drawHeight * image.ratio;
          }
          
          const dx = wrappedX + (settings.imgSize - drawWidth) / 2 + settings.imgSize * 0.5 - centerX;
          const dy = wrappedY + (settings.imgSize - drawHeight) / 2 + settings.imgSize * 0.5 - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < settings.maxDistance) {
            const distanceScale = Math.max(0, 4 - (distance / settings.maxDistance) * 4);
            const suppressionScale = suppressionCurrentRef.current; // smoothly animates 1 -> ~0.12
            const combinedScale = distanceScale * suppressionScale;
            const finalWidth = drawWidth * combinedScale;
            const finalHeight = drawHeight * combinedScale;
            
            if (finalWidth > 0 && finalHeight > 0) {
              ctx.drawImage(
                image.img,
                wrappedX + (settings.imgSize - finalWidth) / 2,
                wrappedY + (settings.imgSize - finalHeight) / 2,
                finalWidth,
                finalHeight
              );
            }
          }
        }
      }
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isActive, isTouch]);

  const startAnimation = useCallback(() => {
    setIsActive(true);
  }, []);

  const stopAnimation = useCallback(() => {
    setIsActive(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const gentlyClearTrail = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, []);

  const handleTextEnter = useCallback(() => {
    setIsSuppressed(true);
    suppressionTargetRef.current = 0.4; // subtle scaling down to 40%
  }, []);

  const handleTextLeave = useCallback(() => {
    setIsSuppressed(false);
    suppressionTargetRef.current = 1;
  }, []);

  // Initialize component
  useEffect(() => {
    // Don't initialize on mobile devices
    if (isMobileDevice()) {
      setIsLoaded(true); // Set loaded to prevent loading screen
      return;
    }

    const init = async () => {
      await loadImages();
      resizeCanvas();
      
      mouseRef.current.x = window.innerWidth * 0.5;
      mouseRef.current.y = window.innerHeight * 0.5;
      
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('resize', resizeCanvas, { passive: true });
      
      if (!isTouch()) {
        startAnimation();
      }
    };

    init();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      stopAnimation();
    };
  }, [loadImages, resizeCanvas, onMouseMove, isTouch, startAnimation, stopAnimation, isMobileDevice]);

  // Drive the animation loop once assets are ready
  useEffect(() => {
    if (isActive && isLoaded) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isActive, isLoaded, animate]);

  // Visibility is now controlled externally via `visible` prop
  useEffect(() => {
    if (!visible) {
      stopAnimation();
    } else if (isLoaded && !isTouch()) {
      startAnimation();
    }
  }, [visible, isLoaded, isTouch, startAnimation, stopAnimation]);

  // On mobile devices: mount a minimal, no-op container (no canvas/effects)
  if (isMobileDevice()) {
    return (
      <main 
        role="presentation"
        aria-hidden="true"
        className={styles.homeContainer}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: zIndex,
          pointerEvents: 'none',
          display: visible ? 'block' : 'none',
          background: 'transparent',
          animation: 'none'
        }}
      />
    );
  }

  return (
    <main 
      role="main"
      aria-label="Mouse trail effect"
      tabIndex={0}
      className={styles.homeContainer}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: zIndex,
        pointerEvents: 'none',
        display: visible ? 'block' : 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{ display: visible ? 'block' : 'none', width: '100vw', height: '100vh' }}
      />
      {/* Expanded hover hotzone with inner text */}
      <div
        className={styles.textHotzone}
        onMouseEnter={handleTextEnter}
        onMouseLeave={handleTextLeave}
      >
        <div className={styles.textContent}>
          <p className={styles.textLine}>{'EXPOSURE '}</p>
          <p className={styles.textLine}>EXPLORERS</p>
        </div>
      </div>

      {/* Navigation bar suppression zone */}
      <div
        className={styles.navHotzone}
        onMouseEnter={handleTextEnter}
        onMouseLeave={handleTextLeave}
      />
      {!isLoaded && (
        <div className={styles.loadingOverlay}>
          Loading...
        </div>
      )}
    </main>
  );
};

export default MouseMouse;
