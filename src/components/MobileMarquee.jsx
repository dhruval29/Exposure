import React, { useEffect, useRef, useState } from 'react';

const MobileMarquee = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [fontSizePx, setFontSizePx] = useState(64);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const h = containerRef.current.clientHeight;
      // Mobile-specific font sizing - further reduced for 40vh height
      const scaleFactor = 0.45; // Further reduced for mobile 40vh height
      const minFont = 18;
      const computedFont = Math.max(minFont, Math.floor(h * scaleFactor));
      setFontSizePx(computedFont);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

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

    // Expo easing functions for smoother motion (same as desktop)
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    const easeInExpo = (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
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
      // Eased blending based on how far we are from target
      const norm = Math.min(1, Math.abs(delta) / (segmentWidth * 0.25));
      // Use expo easing for smoother motion - easeOutExpo for approach, easeInExpo for departure
      const eased = norm < 0.5 ? easeOutExpo(norm * 2) : easeInExpo((norm - 0.5) * 2);
      const blend = 0.08 + 0.12 * eased; // adaptive smoothing
      current = (current + delta * blend + segmentWidth) % segmentWidth;
      track.style.transform = `translate3d(${-current}px, 0, 0)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [fontSizePx]);

  const line = ' capture live create ';

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        background: '#000000', 
        overflow: 'hidden', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: `${Math.max(8, Math.round(fontSizePx * 0.15))}px 0` 
      }}
    >
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          left: 0,
          whiteSpace: 'nowrap',
          willChange: 'transform',
          display: 'flex',
          alignItems: 'center',
          zIndex: 1
        }}
        aria-hidden="true"
      >
        <div style={{ display: 'inline-flex' }}>
          <span style={{ 
            fontFamily: "'PP Editorial New', serif", 
            fontWeight: 200, 
            fontStyle: 'italic', 
            letterSpacing: '0.02em', 
            color: '#ffffff', 
            fontSize: `${fontSizePx}px`, 
            lineHeight: 1.1, 
            paddingRight: '3vw' 
          }}>{line}</span>
          <span style={{ 
            fontFamily: "'PP Editorial New', serif", 
            fontWeight: 200, 
            fontStyle: 'italic', 
            letterSpacing: '0.02em', 
            color: '#ffffff', 
            fontSize: `${fontSizePx}px`, 
            lineHeight: 1.1, 
            paddingRight: '3vw' 
          }}>{line}</span>
          <span style={{ 
            fontFamily: "'PP Editorial New', serif", 
            fontWeight: 200, 
            fontStyle: 'italic', 
            letterSpacing: '0.02em', 
            color: '#ffffff', 
            fontSize: `${fontSizePx}px`, 
            lineHeight: 1.1, 
            paddingRight: '3vw' 
          }}>{line}</span>
          <span style={{ 
            fontFamily: "'PP Editorial New', serif", 
            fontWeight: 200, 
            fontStyle: 'italic', 
            letterSpacing: '0.02em', 
            color: '#ffffff', 
            fontSize: `${fontSizePx}px`, 
            lineHeight: 1.1, 
            paddingRight: '3vw' 
          }}>{line}</span>
        </div>
        <div style={{ display: 'inline-flex' }} aria-hidden="true">
          <span style={{ 
            fontFamily: "'PP Editorial New', serif", 
            fontWeight: 200, 
            fontStyle: 'italic', 
            letterSpacing: '0.02em', 
            color: '#ffffff', 
            fontSize: `${fontSizePx}px`, 
            lineHeight: 1.1, 
            paddingRight: '3vw' 
          }}>{line}</span>
          <span style={{ 
            fontFamily: "'PP Editorial New', serif", 
            fontWeight: 200, 
            fontStyle: 'italic', 
            letterSpacing: '0.02em', 
            color: '#ffffff', 
            fontSize: `${fontSizePx}px`, 
            lineHeight: 1.1, 
            paddingRight: '3vw' 
          }}>{line}</span>
          <span style={{ 
            fontFamily: "'PP Editorial New', serif", 
            fontWeight: 200, 
            fontStyle: 'italic', 
            letterSpacing: '0.02em', 
            color: '#ffffff', 
            fontSize: `${fontSizePx}px`, 
            lineHeight: 1.1, 
            paddingRight: '3vw' 
          }}>{line}</span>
          <span style={{ 
            fontFamily: "'PP Editorial New', serif", 
            fontWeight: 200, 
            fontStyle: 'italic', 
            letterSpacing: '0.02em', 
            color: '#ffffff', 
            fontSize: `${fontSizePx}px`, 
            lineHeight: 1.1, 
            paddingRight: '3vw' 
          }}>{line}</span>
        </div>
      </div>
    </div>
  );
};

export default MobileMarquee;
