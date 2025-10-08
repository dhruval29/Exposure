import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import './TutorialCursor.css';

const TutorialCursor = ({ 
  targetElement, 
  onAnimationComplete, 
  isVisible = false,
  tooltipText = "Click to navigate"
}) => {
  const cursorRef = useRef(null);
  const tooltipRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !targetElement) return;

    // Just show tooltip directly without cursor animation
    setShowTooltip(true);
    
    // Hide tooltip and complete after delay
    setTimeout(() => {
      setShowTooltip(false);
      onAnimationComplete?.();
    }, 2000);

  }, [isVisible, targetElement, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="tutorial-cursor-container">
      {/* Tooltip only - no cursor animation */}
      <div 
        ref={tooltipRef}
        className="tutorial-tooltip"
        style={{
          position: 'fixed',
          left: targetElement ? `${targetElement.getBoundingClientRect().left + targetElement.getBoundingClientRect().width / 2}px` : '50%',
          top: targetElement ? `${targetElement.getBoundingClientRect().top - 60}px` : '50%',
          transform: 'translateX(-50%)',
          opacity: showTooltip ? 1 : 0,
          scale: showTooltip ? 1 : 0.8,
          zIndex: 10001,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease, scale 0.3s ease'
        }}
      >
        <div className="tooltip-content">
          <span className="tooltip-text">{tooltipText}</span>
          <div className="tooltip-arrow"></div>
        </div>
      </div>
    </div>
  );
};

export default TutorialCursor;
