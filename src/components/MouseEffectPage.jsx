import React, { useEffect, useRef, useState } from 'react';
import ImageStack from './ImageStack';
import NavigationMenu from './NavigationMenu';
import { useMouseEffect } from './MouseEffectPage/useMouseEffect';
import './mouse-effect-page.css';

const MouseEffectPage = () => {
  const containerRef = useRef(null);
  const slidingPageRef = useRef(null);
  const captureLettersRef = useRef([]);
  const exploreLettersRef = useRef([]);
  const liveLettersRef = useRef([]);
  const [showNavigation, setShowNavigation] = useState(false);
  const [isExitingNavigation, setIsExitingNavigation] = useState(false);

  // Use the mouse effect hook
  const { canvasRef, isLoading, isActive } = useMouseEffect();

  useEffect(() => {
    // Mouse effect logic is now handled by the custom hook
    console.log('MouseEffectPage mounted, mouse effect active:', isActive);
  }, [isActive]);

  return (
    <div ref={containerRef} className="mouse-effect-container">
      {/* Mouse Effect Canvas - This will be the background layer */}
      <div className="mouse-effect-canvas-container">
        <canvas 
          ref={canvasRef}
          className="mouse-effect-canvas"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 1,
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
          }}
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="mouse-effect-loading" style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            color: '#1a1915',
            fontSize: '18px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            Loading mouse effect...
          </div>
        )}
      </div>

      {/* Sliding Page - Imported from VideoScroll */}
      <div ref={slidingPageRef} className="sliding-page">
        <div className="sliding-page-content">
          <div className="sliding-page-text" style={{ cursor: "url('/W/Vector.png') 0 0, text" }}>
            We use the power of storytelling to<br/>
            fire the imagination, stir the soul,<br/>
            and ultimately inspire people.
          </div>
          <div className="sliding-page-images">
            <img src="/pictures/IMG_20250101_101901.jpg" alt="Nature Scene" className="sliding-page-image forest" />
            <img src="/pictures/IMG_20241227_144906.jpg" alt="Urban Scene" className="sliding-page-image building" />
          </div>
        </div>
        
        <div className="image-stack-section">
          <ImageStack />
        </div>
        
        {/* Capture Polygon */}
        <div 
          className="capture-polygon"
          style={{
            position: 'absolute',
            top: '200vh',
            left: 0,
            width: '100%',
            height: '100vh',
            clipPath: 'polygon(0 32%, 100% 0, 100% 100%, 0 68%)',
            background: '#F2858E',
            outline: '1.06px #F2858E solid',
            outlineOffset: '-0.53px',
            zIndex: 100
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'black', 
            fontSize: '172.84px', 
            fontFamily: 'Nippo', 
            fontWeight: '500', 
            lineHeight: '212.09px', 
            letterSpacing: '6.91px', 
            wordWrap: 'break-word',
            textAlign: 'center',
            zIndex: 101,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {'Capture'.split('').map((letter, index) => (
              <span
                key={index}
                ref={el => {
                  if (el) {
                    if (!captureLettersRef.current) captureLettersRef.current = [];
                    captureLettersRef.current[index] = el;
                  }
                }}
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  color: 'black',
                  left: `${(index - 3) * 20}px`,
                  top: `${Math.sin(index * 0.5) * 15}px`
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
        </div>
        
        {/* Explore Polygon */}
        <div 
          className="explore-polygon"
          style={{
            position: 'absolute',
            top: '267.5vh',
            left: 0,
            width: '100%',
            height: '100vh',
            clipPath: 'polygon(100% 32.2%, 100% 68.3%, 0 99.9%, 0 0.15%)',
            background: '#6C6A6A',
            outline: '1.06px #F2858E solid',
            outlineOffset: '-0.53px',
            zIndex: 200
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'black', 
            fontSize: '172.84px', 
            fontFamily: 'Nippo', 
            fontWeight: '500', 
            lineHeight: '212.09px', 
            letterSpacing: '6.91px', 
            wordWrap: 'break-word',
            textAlign: 'center',
            zIndex: 201,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {'Explore'.split('').map((letter, index) => (
              <span
                key={index}
                ref={el => {
                  if (el) {
                    if (!exploreLettersRef.current) exploreLettersRef.current = [];
                    exploreLettersRef.current[index] = el;
                  }
                }}
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  color: 'black',
                  left: `${(index - 3) * 18}px`,
                  top: `${Math.cos(index * 0.6) * 20}px`
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
        </div>
        
        {/* Live Polygon */}
        <div 
          className="live-polygon"
          style={{
            position: 'absolute',
            top: '335.6vh',
            left: 0,
            width: '100%',
            height: '100vh',
            clipPath: 'polygon(0 32%, 100% 0, 100% 100%, 0 68%)',
            background: '#F2858E',
            outline: '1.06px #F2858E solid',
            outlineOffset: '-0.53px',
            zIndex: 300
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'black', 
            fontSize: '172.84px', 
            fontFamily: 'Nippo', 
            fontWeight: '500', 
            lineHeight: '212.09px', 
            letterSpacing: '6.91px', 
            wordWrap: 'break-word',
            textAlign: 'center',
            zIndex: 301,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {'Live'.split('').map((letter, index) => (
              <span
                key={index}
                ref={el => {
                  if (el) {
                    if (!liveLettersRef.current) liveLettersRef.current = [];
                    liveLettersRef.current[index] = el;
                  }
                }}
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  color: 'black',
                  left: `${(index - 1.5) * 25}px`,
                  top: `${Math.sin(index * 1.2) * 25}px`
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
        </div>
        
        {/* Zoom Section */}
        <div 
          style={{
            position: 'absolute',
            top: '435.6vh',
            left: 0,
            width: '100%',
            height: '100vh',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 400
          }}
        >
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100vh'
          }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100vh'
            }}>
              <img 
                src="/pictures/IMG_20250114_093607.jpg"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 1,
                  transformOrigin: 'center center',
                  pointerEvents: 'none',
                  zIndex: 500,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                alt="Zoom Image"
              />
              
              <div 
                style={{
                  position: 'absolute',
                  right: 'calc(50% + 0.01px + 15.5px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'black', 
                  fontSize: 66.70, 
                  fontFamily: 'Helvetica', 
                  fontWeight: '400', 
                  wordWrap: 'break-word',
                  zIndex: 60,
                  textAlign: 'right'
                }}
              >
                Take a closer
              </div>
              
              <div 
                style={{
                  position: 'absolute',
                  left: 'calc(50% + 0.01px + 4.5px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'black', 
                  fontSize: 66.70, 
                  fontFamily: 'Helvetica', 
                  fontWeight: '400', 
                  wordWrap: 'break-word',
                  zIndex: 60,
                  textAlign: 'left'
                }}
              >
                look at Life
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        {showNavigation && (
          <div style={{ 
            position: 'absolute',
            top: '435.6vh',
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            opacity: 0,
            animation: 'fadeIn 0.8s ease-out forwards'
          }}>
            <NavigationMenu isExiting={isExitingNavigation} />
          </div>
        )}
        

      </div>
      
      {/* Debug Info */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 10000
      }}>
        <div>Mouse Effect: {isActive ? '🟢 Active' : '🔴 Inactive'}</div>
        <div>Loading: {isLoading ? '⏳ Loading...' : '✅ Loaded'}</div>
      </div>
    </div>
  );
};

export default MouseEffectPage;
