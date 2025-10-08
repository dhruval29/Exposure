import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import './PicturesTutorial.css';

const PicturesTutorial = ({ 
  targetElement, 
  onAnimationComplete, 
  isVisible = false,
  tooltipText = "Click for enhanced view"
}) => {
  const tooltipRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!isVisible || !targetElement) return;

    // Show tooltip directly
    setShowTooltip(true);
    
    // Hide tooltip and complete after delay
    setTimeout(() => {
      setShowTooltip(false);
      onAnimationComplete?.();
    }, 3000); // Show for 3 seconds

  }, [isVisible, targetElement, onAnimationComplete]);

  if (!isVisible || !showTooltip) return null;

  return (
    <div className="pictures-tutorial-container">
      {/* Tooltip pointing to the first image */}
      <div 
        ref={tooltipRef}
        className="pictures-tutorial-tooltip"
        style={{
          position: 'fixed',
          left: targetElement ? `${targetElement.getBoundingClientRect().left + targetElement.getBoundingClientRect().width / 2}px` : '50%',
          top: targetElement ? `${targetElement.getBoundingClientRect().top - 80}px` : '50%',
          transform: 'translateX(-50%)',
          zIndex: 10001,
          pointerEvents: 'none'
        }}
      >
        <div className="pictures-tooltip-content">
          <span className="pictures-tooltip-text">{tooltipText}</span>
          <div className="pictures-tooltip-arrow"></div>
        </div>
      </div>
    </div>
  );
};

export default PicturesTutorial;
