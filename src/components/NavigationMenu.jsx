import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';


const NavigationMenu = ({ isExiting }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const textRefs = useRef([]);
  const borderRefs = useRef([]);
  const arrowRefs = useRef([]);
  const backgroundImageRefs = useRef([]);
  const animationTimeline = useRef(null);
  const isMenuVisible = useRef(false);

  const menuItems = [
    { id: 'our-journey', label: 'Our Journey', image: '/Building.png' },
    { id: 'gallery', label: 'Gallery', image: '/forest.png' },
    { id: 'team', label: 'Team', image: '/e6598e5c25c54119d943da26c46ea508e5daf7cf.png' },
    { id: 'latest-releases', label: 'Latest Releases', image: '/f5e2cfa883ff3d24c1567c79d5a6e57231b2ef45.png' }
  ];

  useEffect(() => {
    // Wait for refs to be properly set
    const checkRefs = () => {
      if (textRefs.current && borderRefs.current && 
          textRefs.current.length > 0 && borderRefs.current.length > 0) {
        try {
          setupScrollTrigger();
        } catch (error) {
          // Silent error handling
        }
      } else {
        setTimeout(checkRefs, 100);
      }
    };
    
    checkRefs();
  }, []);

  // Animate in when component mounts and refs are ready
  useEffect(() => {
    const waitForRefsAndAnimate = () => {
      if (textRefs.current && borderRefs.current && 
          textRefs.current.length > 0 && borderRefs.current.length > 0) {
        animateMenuIn();
      } else {
        setTimeout(waitForRefsAndAnimate, 100);
      }
    };
    
    waitForRefsAndAnimate();
  }, []);

  // Watch for exit signal and play exit animation (force even if visible flag missed)
  useEffect(() => {
    if (isExiting) {
      animateMenuOut();
    }
  }, [isExiting]);





  const setupScrollTrigger = () => {
    // This function is now handled by the useEffect that watches isVisible prop
    // Just ensure refs are available
    if (textRefs.current && borderRefs.current) {
      // Refs are ready, component can animate when isVisible becomes true
    }
  };

  const animateMenuOut = () => {
    if (!textRefs.current || !borderRefs.current) return;
    try {
      const tl = gsap.timeline();
      // Arrows and background images fade out quickly
      tl.to(arrowRefs.current.filter(Boolean), {
        opacity: 0,
        xPercent: -20,
        yPercent: -30,
        duration: 0.45,
        ease: "power2.inOut"
      }, 0)
      .to(backgroundImageRefs.current.filter(Boolean), {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut"
      }, 0)
      // Borders collapse
      .to(borderRefs.current.filter(Boolean), {
        scaleX: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out"
      }, 0.05)
      // Text slides/fades back
      .to(textRefs.current.filter(Boolean), {
        opacity: 0,
        x: -50,
        rotationX: -90,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      }, 0.05);
      isMenuVisible.current = false;
    } catch (error) {
      // Silent error handling
    }
  };

  const animateMenuIn = () => {
    if (!textRefs.current || !borderRefs.current || 
        textRefs.current.length === 0 || borderRefs.current.length === 0) {
      return;
    }
    
    if (isMenuVisible.current) {
      return;
    }
    
    try {
      isMenuVisible.current = true;
      const tl = gsap.timeline();
      
      // First, set initial state for text
      gsap.set(textRefs.current.filter(Boolean), {
        opacity: 0,
        x: -50,
        rotationX: -90
      });
      
      // First, set initial state for borders
      gsap.set(borderRefs.current.filter(Boolean), {
        scaleX: 0
      });
      
      // Animate text and borders simultaneously
      tl.to(textRefs.current.filter(Boolean), 
        {
          opacity: 1,
          x: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }
      )
      // Animate borders drawing from left to right - starting with text
      .to(borderRefs.current.filter(Boolean),
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 0.6,
          stagger: 0.2, // Match text stagger timing
          ease: "power2.out"
        },
        0 // Start at the same time as text animation
      );
    } catch (error) {
      // Silent error handling
    }
  };

  const handleClick = (itemId) => {
    switch (itemId) {
      case 'gallery':
        // Open the standalone gallery HTML page
        window.location.href = '/gallery-simple.html';
        break;
      case 'team':
        navigate('/team');
        break;
      case 'our-journey':
        navigate('/');
        break;
      case 'latest-releases':
        navigate('/effects');
        break;
      default:
        break;
    }
  };

  const handleHover = (index, isHovering) => {
    gsap.to(textRefs.current[index], {
      x: isHovering ? 12 : 0,
      duration: 0.6,
      ease: "power2.out",
      delay: isHovering ? 0.05 : 0
    });
    
    gsap.to(borderRefs.current[index], {
      scaleY: isHovering ? 2 : 1,
      duration: 0.5, // Increased from 0.3s to 0.5s
      ease: "power2.out"
    });

    if (isHovering) {
      // Professional animation based on CSS patterns - smooth entrance with delay
      gsap.to(arrowRefs.current[index], {
        opacity: 1,
        transform: 'translateY(-50%) translate(0, 0)',
        duration: 0.6,
        ease: "power2.out",
        delay: 0.12
      });

      // Fade in background image
      gsap.to(backgroundImageRefs.current[index], {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.06
      });
    } else {
      // Return to initial professional position
      gsap.to(arrowRefs.current[index], {
        opacity: 0,
        transform: 'translateY(-50%) translate(-20%, 20%)',
        duration: 0.5,
        ease: "power2.inOut"
      });

      // Fade out background image
      gsap.to(backgroundImageRefs.current[index], {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <>
      {/* Background Images - Behind menu, above zoom background */}
      {menuItems.map((item, index) => (
        <div
          key={`bg-${item.id}`}
          ref={el => backgroundImageRefs.current[index] = el}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            zIndex: 1999, // Behind nav menu (2001) but above zoom background
            pointerEvents: 'none',
            backgroundImage: `url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ))}

      {/* Navigation Menu */}
      <div 
        ref={menuRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          width: '600px',
          zIndex: 2001, // Higher than the wrapper div
          pointerEvents: 'auto' // Re-enable pointer events
        }}
      >
                 
      {menuItems.map((item, index) => (
        <div
          key={item.id}
          onClick={() => handleClick(item.id)}
          onMouseEnter={() => handleHover(index, true)}
          onMouseLeave={() => handleHover(index, false)}
          style={{
            position: 'relative',
            height: '80px',
            cursor: "url('/W/cursor final.png') 0 0, pointer",
            overflow: 'visible',
            width: '100%'
          }}
        >
                                                                 {/* Text - Completely independent */}
             <div
               ref={el => textRefs.current[index] = el}
               style={{
                 position: 'absolute',
                 left: '0px',
                 top: '50%',
                 transform: 'translateY(-50%)',
                 color: 'white',
                 fontSize: '48px',
                 fontFamily: 'Helvetica, sans-serif',
                 fontWeight: '400',
                 letterSpacing: '1px',
                 opacity: 0, // Back to hidden for animation
                 pointerEvents: 'none' // Prevent any interaction interference
               }}
             >
               {item.label}
             </div>
          
          {/* Arrow SVG - Completely independent */}
          <div
            ref={el => arrowRefs.current[index] = el}
            style={{
              position: 'absolute',
              right: '0px',
              top: '50%',
              transform: 'translateY(-50%) translate(-20%, 20%)', // Professional initial position from CSS
              opacity: 0,
              pointerEvents: 'none' // Prevent any interaction interference
            }}
          >
            <img 
              src="/src/assets/new arrow.svg" 
              alt="Arrow" 
              style={{
                width: '132.51px', // Increased by 50% more (88.34 * 1.5 = total 225% of original)
                height: '132.51px', // Increased by 50% more (88.34 * 1.5 = total 225% of original)
                display: 'block',
                strokeWidth: '4px' // Increased thickness from 3px to 4px (1px increase)
              }}
            />
          </div>
          
                     {/* Border line - Completely independent */}
           <div
             ref={el => borderRefs.current[index] = el}
             style={{
               position: 'absolute',
               bottom: '0',
               left: '0',
               width: '100%',
               height: '1px',
               backgroundColor: 'white',
               transformOrigin: 'left center',
               transform: 'scaleX(0)', // Back to hidden for animation
               pointerEvents: 'none' // Prevent any interaction interference
             }}
           />
        </div>
      ))}
      </div>
    </>
  );
};

export default NavigationMenu;
