import { useRef, useState, useEffect } from 'react';

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
          img.onload = () => resolve({ ...data, img, loaded: true });
          img.onerror = () => resolve({ ...data, img: null, loaded: false });
          img.src = data.path;
        });
      });
      
      const loadedImages = await Promise.all(promises);
      setImages(loadedImages.filter(img => img.loaded));
      setIsLoading(false);
    } catch (error) {
      // Error loading images - silently fail
      setIsLoading(false);
    }
  };

  // Mouse move handler
  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    
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

  // Animation loop
  const animate = () => {
    if (!canvasRef.current || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const vw = getViewportWidth();
    const vh = getViewportHeight();
    
    ctx.clearRect(0, 0, vw, vh);
    
    const centerX = mouseRef.current.x;
    const centerY = mouseRef.current.y;
    
    // Draw images in grid pattern - optimized
    for (let i = 0; i < settingsRef.current.cols; i++) {
      for (let j = 0; j < settingsRef.current.rows; j++) {
        const x = i * settingsRef.current.step;
        const y = j * settingsRef.current.step;
        
        const dx = centerX - x;
        const dy = centerY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < settingsRef.current.maxDistance) {
          const scale = Math.max(0.1, 1 - (distance / settingsRef.current.maxDistance));
          const imgIndex = (i + j) % images.length;
          const img = images[imgIndex];
          
          if (img && img.img) {
            const size = settingsRef.current.imgSize * scale;
            const offsetX = x - size / 2;
            const offsetY = y - size / 2;
            
            ctx.save();
            ctx.globalAlpha = scale * 0.8;
            ctx.drawImage(img.img, offsetX, offsetY, size, size / img.ratio);
            ctx.restore();
          }
        }
      }
    }
    
    timeRef.current += 0.016;
    animationRef.current = requestAnimationFrame(animate);
  };

  // Start animation
  const startAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsActive(true);
    animate();
  };

  // Stop animation
  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsActive(false);
  };

  // Initialize
  useEffect(() => {
    resizeCanvas();
    loadImages();

    // Set initial mouse position to center
    mouseRef.current.x = getViewportWidth() * 0.5;
    mouseRef.current.y = getViewportHeight() * 0.5;
    
    // Event listeners
    const cleanupTarget = containerRef && containerRef.current ? containerRef.current : window;
    cleanupTarget.addEventListener('mousemove', handleMouseMove);
    
    if (cleanupTarget === window) {
      window.addEventListener('resize', resizeCanvas);
    }

    return () => {
      const cleanupTarget = containerRef && containerRef.current ? containerRef.current : window;
      cleanupTarget.removeEventListener('mousemove', handleMouseMove);
      if (cleanupTarget === window) {
        window.removeEventListener('resize', resizeCanvas);
      } else if (animationRef.current && animationRef.current._ro) {
        animationRef.current._ro.disconnect();
      }
      stopAnimation();
    };
  }, []);

  // Start animation when images are loaded
  useEffect(() => {
    if (!isLoading && !isTouch()) {
      startAnimation();
    } else {
      stopAnimation();
    }
    
    return () => stopAnimation();
  }, [isLoading]);

  return {
    canvasRef,
    isActive,
    isLoading,
    startAnimation,
    stopAnimation
  };
};

export default useLightweightMouseEffect;
