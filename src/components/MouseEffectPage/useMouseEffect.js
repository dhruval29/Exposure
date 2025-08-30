import { useEffect, useRef, useState } from 'react';

export const useMouseEffect = (options = {}) => {
  const { containerRef = null, sizeScale = 1, intensity = 1, radiusScale = 1, minScale = 0.1, imageUrls = null } = options;
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mouse tracking state
  const mouseRef = useRef({ x: 0, y: 0, nX: 0, nY: 0 });
  const timeRef = useRef(0);
  const forceScaleRef = useRef(0);
  const centerRadiusRef = useRef(0);
  const intensityRef = useRef(intensity);
  const sizeScaleRef = useRef(sizeScale);
  const radiusScaleRef = useRef(radiusScale);
  const minScaleRef = useRef(minScale);

  // Settings
  const settingsRef = useRef({
    imgSize: 0,
    maxDistance: 0,
    gap: 0,
    step: 0,
    cols: 0,
    rows: 0
  });

  // Image data
  const imageData = [
    { id: 'sports-outdoor1', ratio: 600 / 651 },
    { id: 'sports-outdoor2', ratio: 600 / 522 },
    { id: 'sports-outdoor3', ratio: 600 / 420 },
    { id: 'home-tech1', ratio: 600 / 612 },
    { id: 'home-tech2', ratio: 600 / 417 },
    { id: 'fashion1', ratio: 600 / 559 },
    { id: 'fashion2', ratio: 600 / 488 },
    { id: 'fashion3', ratio: 600 / 583 },
    { id: 'eat-drinks1', ratio: 600 / 544 },
    { id: 'eat-drinks2', ratio: 600 / 663 },
    { id: 'eac1', ratio: 600 / 428 },
    { id: 'eac2', ratio: 600 / 428 }
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
      settingsRef.current.imgSize = vh * 0.075 * sizeScaleRef.current;
      settingsRef.current.maxDistance = vh * 0.32 * radiusScaleRef.current; // decoupled from size
    } else {
      settingsRef.current.imgSize = vh * 0.05 * sizeScaleRef.current;
      settingsRef.current.maxDistance = vh * 0.24 * radiusScaleRef.current; // decoupled from size
    }
    settingsRef.current.gap = vh * 0.06 * sizeScaleRef.current;
    settingsRef.current.step = settingsRef.current.imgSize + settingsRef.current.gap;
    settingsRef.current.cols = Math.ceil(vw / settingsRef.current.step) + 4; // extra coverage to avoid edges
    settingsRef.current.rows = Math.ceil(vh / settingsRef.current.step) + 4;
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
      // If custom image URLs are provided, use them; otherwise fall back to CDN set
      const sourceList = (Array.isArray(imageUrls) && imageUrls.length > 0)
        ? imageUrls.map((item) => {
            if (typeof item === 'string') return { url: item };
            if (item && typeof item === 'object' && item.url) return { url: item.url, ratio: item.ratio };
            return null;
          }).filter(Boolean)
        : imageData.flatMap(data =>
            Array(6).fill(null).map((_, index) => ({
              url: `https://cdn.telescope.fyi/landing/hero/${data.id}/${index}.jpg`,
              ratio: data.ratio
            }))
          );

      // Shuffle the images
      const shuffled = sourceList.sort(() => Math.random() - 0.5);

      const promises = shuffled.map(data => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const resolvedRatio = data.ratio || (img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1);
            resolve({ ...data, ratio: resolvedRatio, img });
          };
          img.onerror = () => {
            // Create a colored rectangle as fallback
            const fallbackCanvas = document.createElement('canvas');
            fallbackCanvas.width = 200;
            fallbackCanvas.height = 200;
            const fallbackCtx = fallbackCanvas.getContext('2d');
            
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            fallbackCtx.fillStyle = color;
            fallbackCtx.fillRect(0, 0, 200, 200);
            
            fallbackCtx.fillStyle = 'rgba(255,255,255,0.3)';
            fallbackCtx.fillRect(50, 50, 100, 100);
            
            const fallbackImg = new Image();
            fallbackImg.onload = () => resolve({ ...data, ratio: data.ratio || 1, img: fallbackImg });
            fallbackImg.src = fallbackCanvas.toDataURL();
          };
          img.src = data.url;
        });
      });
      
      const loadedImages = await Promise.all(promises);
      setImages(loadedImages);
      setIsLoading(false);
      console.log('Images loaded:', loadedImages.length);
    } catch (error) {
      console.error('Error loading images:', error);
      setIsLoading(false);
    }
  };

  // Mouse move handler
  const handleMouseMove = (e) => {
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
    mouseRef.current.nX = (mouseRef.current.x / vw) * 2 - 1;
    mouseRef.current.nY = -(mouseRef.current.y / vh) * 2 + 1;
  };

  // Main animation loop
  const animate = () => {
    if (!isActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const settings = settingsRef.current;
    
    timeRef.current += 0.016; // 60fps timing
    
    // Reset time periodically to prevent it from getting too large
    if (timeRef.current > 1000) {
      timeRef.current = 0;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate center point
    let centerX, centerY;
    if (isTouch()) {
      const vw = getViewportWidth();
      const vh = getViewportHeight();
      centerX = vw * 0.5 + centerRadiusRef.current * 0.75 * Math.cos(timeRef.current * 0.75);
      centerY = vh * 0.5 + centerRadiusRef.current * Math.sin(timeRef.current * 0.75);
    } else {
      centerX = mouseRef.current.x;
      centerY = mouseRef.current.y;
    }
    
    // Draw images in grid pattern
    for (let row = 0; row < settings.rows; row++) {
      for (let col = 0; col < settings.cols; col++) {
        const imageIndex = (col + row * settings.cols) % images.length;
        const image = images[imageIndex];
        
        if (!image || !image.img) continue;
        
        // Calculate position with smooth continuous scrolling
        const baseX = col * settings.step;
        const baseY = row * settings.step;
        
        const scrollX = timeRef.current * 50;
        const scrollY = timeRef.current * 30;
        
        const x = baseX - scrollX;
        const y = baseY - scrollY;
        
        // Wrap positions smoothly
        let wrappedX = x;
        let wrappedY = y;
        
        const vw = getViewportWidth();
        const vh = getViewportHeight();
        while (wrappedX < -settings.step) {
          wrappedX += vw + settings.step;
        }
        while (wrappedX > vw) {
          wrappedX -= vw + settings.step;
        }
        while (wrappedY < -settings.step) {
          wrappedY += vh + settings.step;
        }
        while (wrappedY > vh) {
          wrappedY -= vh + settings.step;
        }
        
        // Only draw if image is visible on screen
        if (wrappedX + settings.imgSize > 0 && wrappedX < getViewportWidth() && 
            wrappedY + settings.imgSize > 0 && wrappedY < getViewportHeight()) {
          
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
          const dx = wrappedX + (settings.imgSize - drawWidth) / 2 + settings.imgSize * 0.5 - centerX;
          const dy = wrappedY + (settings.imgSize - drawHeight) / 2 + settings.imgSize * 0.5 - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, Math.min(1, 1 - distance / settings.maxDistance));
          const scale = Math.max(minScaleRef.current, proximity * 4) * forceScaleRef.current * intensityRef.current;
          const finalWidth = drawWidth * scale;
          const finalHeight = drawHeight * scale;
          
          if (finalWidth > 0.5 && finalHeight > 0.5) {
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
    
    // Calculate center radius
    centerRadiusRef.current = Math.min(getViewportWidth() * 0.75, getViewportHeight() * 0.75);
    
    // Initialize mouse position to center
    mouseRef.current.x = getViewportWidth() * 0.5;
    mouseRef.current.y = getViewportHeight() *  0.5;
    
    // Event listeners
    const targetEl = containerRef && containerRef.current ? containerRef.current : window;
    targetEl.addEventListener('mousemove', handleMouseMove, { passive: true });
    if (targetEl === window) {
      window.addEventListener('resize', resizeCanvas);
    } else if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(resizeCanvas);
      ro.observe(containerRef.current);
      // store on ref to disconnect on cleanup
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
