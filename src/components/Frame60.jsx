import React, { useEffect, useRef, useState } from 'react';

const Frame60 = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [fontSizePx, setFontSizePx] = useState(64);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const h = containerRef.current.clientHeight;
      // Make text height smaller; reduced scale factor
      setFontSizePx(Math.max(24, Math.floor(h * 0.6)));
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

    // Smooth, buttery motion: lerp between current and target
    const speed = 0.28; // slower scroll coupling
    const autoPxPerSec = 6.5; // slower baseline drift
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

    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 1, 3) / 2);
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
      const eased = easeInOutCubic(norm);
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
    <div ref={containerRef} style={{ width: '100%', height: '100%', background: 'white', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', padding: '1.5vh 0', borderTop: '1px solid rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(0,0,0,0.15)' }}>
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          left: 0,
          whiteSpace: 'nowrap',
          willChange: 'transform',
          display: 'flex'
        }}
        aria-hidden="true"
      >
        <div style={{ display: 'inline-flex' }}>
          <span style={{ fontFamily: "'PP Editorial New', serif", fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.02em', color: '#000', fontSize: `${fontSizePx}px`, lineHeight: 1, paddingRight: '2vw' }}>{line}</span>
          <span style={{ fontFamily: "'PP Editorial New', serif", fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.02em', color: '#000', fontSize: `${fontSizePx}px`, lineHeight: 1, paddingRight: '2vw' }}>{line}</span>
          <span style={{ fontFamily: "'PP Editorial New', serif", fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.02em', color: '#000', fontSize: `${fontSizePx}px`, lineHeight: 1, paddingRight: '2vw' }}>{line}</span>
          <span style={{ fontFamily: "'PP Editorial New', serif", fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.02em', color: '#000', fontSize: `${fontSizePx}px`, lineHeight: 1, paddingRight: '2vw' }}>{line}</span>
        </div>
        <div style={{ display: 'inline-flex' }} aria-hidden="true">
          <span style={{ fontFamily: "'PP Editorial New', serif", fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.02em', color: '#000', fontSize: `${fontSizePx}px`, lineHeight: 1, paddingRight: '2vw' }}>{line}</span>
          <span style={{ fontFamily: "'PP Editorial New', serif", fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.02em', color: '#000', fontSize: `${fontSizePx}px`, lineHeight: 1, paddingRight: '2vw' }}>{line}</span>
          <span style={{ fontFamily: "'PP Editorial New', serif", fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.02em', color: '#000', fontSize: `${fontSizePx}px`, lineHeight: 1, paddingRight: '2vw' }}>{line}</span>
          <span style={{ fontFamily: "'PP Editorial New', serif", fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.02em', color: '#000', fontSize: `${fontSizePx}px`, lineHeight: 1, paddingRight: '2vw' }}>{line}</span>
        </div>
      </div>
    </div>
  );
};

export default Frame60;
