import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

const MobileMarquee = React.memo(() => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [fontSizePx, setFontSizePx] = useState(64);

  // Memoize the measurement function to prevent unnecessary re-renders
  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const h = containerRef.current.clientHeight;
    // Mobile-specific font sizing - further reduced for 40vh height
    const scaleFactor = 0.45; // Further reduced for mobile 40vh height
    const minFont = 18;
    const computedFont = Math.max(minFont, Math.floor(h * scaleFactor));
    setFontSizePx(prev => prev !== computedFont ? computedFont : prev);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let segmentWidth = 0;
    const recalc = () => {
      segmentWidth = Math.max(1, track.scrollWidth / 2);
    };
    recalc();

    // Smooth, buttery motion: lerp between current and target (same as desktop)
    const speed = 0.28; // same scroll coupling as desktop
    const autoPxPerSec = 6.5; // same baseline drift as desktop
    let target = 0;
    let current = 0;
    let rafId = 0;
    let lastTs = performance.now();

    const onResize = () => recalc();
    window.addEventListener('resize', onResize);

    const onScroll = () => {
      target = ((window.scrollY * speed) % segmentWidth + segmentWidth) % segmentWidth;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Simplified easing for better performance (similar to GSAP power2.out)
    const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
    const animate = (ts) => {
      const dt = Math.min(0.05, Math.max(0, (ts - lastTs) / 1000));
      lastTs = ts;
      // Add subtle auto drift
      target = (target + autoPxPerSec * dt) % segmentWidth;
      // Shortest wrap-around distance for circular lerp
      let delta = target - current;
      if (Math.abs(delta) > segmentWidth / 2) {
        delta -= Math.sign(delta) * segmentWidth;
      }
      // Simplified blending with fixed smoothing factor for consistent performance
      const blend = 0.12; // Fixed blend factor for smoother motion
      current = (current + delta * blend + segmentWidth) % segmentWidth;
      // Use transform3d with force3D for GPU acceleration (like GSAP)
      track.style.transform = `translate3d(${-current}px, 0, 0)`;
      track.style.force3D = true;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [fontSizePx]);

  // Memoize the line text to prevent unnecessary re-renders
  const line = useMemo(() => ' capture live create ', []);

  // Memoize the text style to prevent object recreation on every render
  const textStyle = useMemo(() => ({ 
    fontFamily: "'PP Editorial New', serif", 
    fontWeight: 200, 
    fontStyle: 'italic', 
    letterSpacing: '0.02em', 
    color: '#ffffff', 
    fontSize: `${fontSizePx}px`, 
    lineHeight: 1.1, 
    paddingRight: '3vw',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    willChange: 'transform'
  }), [fontSizePx]);

  // Memoize the container style with frosted glass effect
  const containerStyle = useMemo(() => ({ 
    width: '100%', 
    height: '100%', 
    background: 'rgba(0, 0, 0, 0.3)', 
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    overflow: 'hidden', 
    position: 'relative', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: `${Math.max(8, Math.round(fontSizePx * 0.15))}px 0`,
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    perspective: '1000px'
  }), [fontSizePx]);

  // Memoize the track style
  const trackStyle = useMemo(() => ({
    position: 'relative',
    left: 0,
    whiteSpace: 'nowrap',
    willChange: 'transform',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1,
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
    perspective: '1000px'
  }), []);

  return (
    <div 
      ref={containerRef} 
      style={containerStyle}
    >
      <div
        ref={trackRef}
        style={trackStyle}
        aria-hidden="true"
      >
        <div style={{ display: 'inline-flex' }}>
          <span style={textStyle}>{line}</span>
          <span style={textStyle}>{line}</span>
          <span style={textStyle}>{line}</span>
          <span style={textStyle}>{line}</span>
        </div>
        <div style={{ display: 'inline-flex' }} aria-hidden="true">
          <span style={textStyle}>{line}</span>
          <span style={textStyle}>{line}</span>
          <span style={textStyle}>{line}</span>
          <span style={textStyle}>{line}</span>
        </div>
      </div>
    </div>
  );
});

export default MobileMarquee;
