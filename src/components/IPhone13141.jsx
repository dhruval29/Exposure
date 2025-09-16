import React, { useState, useEffect } from 'react';

const IPhone13141 = () => {
  const [screenSize, setScreenSize] = useState('desktop');

  // Enhanced screen size detection
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setScreenSize('small-mobile');
      } else if (width <= 768) {
        setScreenSize('mobile');
      } else if (width <= 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Responsive scaling based on screen size
  const getResponsiveScale = () => {
    switch (screenSize) {
      case 'small-mobile': return 0.8;  // 20% smaller for very small screens
      case 'mobile': return 1.0;        // Normal mobile size
      case 'tablet': return 1.1;        // 10% larger for tablets
      case 'desktop': return 1.0;       // Desktop size
      default: return 1.0;
    }
  };

  const scale = getResponsiveScale();

  return (
    <div style={{
      width: '100%',
      position: 'relative',
      backgroundColor: '#fff',
      height: '2768px',
      overflow: 'hidden',
      textAlign: 'left',
      fontSize: '36px',
      color: '#000',
      fontFamily: 'PP Editorial New'
    }}>
      
      {/* Animated gradient overlay fading downward (mirrors desktop) */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '1300px',
          background: 'linear-gradient(to bottom, #b7bae5 0%, #b7bae5 60%, rgba(183, 186, 229, 0.8) 80%, rgba(183, 186, 229, 0.4) 90%, rgba(183, 186, 229, 0.1) 95%, transparent 100%)',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'gradientFade 6s ease-in-out infinite',
          opacity: 0.7
        }}
        aria-hidden="true"
      />
      <div style={{
        position: 'absolute',
        top: '0.8%', // 22px / 2768px
        left: '4.9%', // 19px / 390px (mobile width)
        letterSpacing: '-0.02em',
        lineHeight: '122.71%',
        display: 'inline-block',
        width: '89%', // 347px / 390px (mobile width)
        height: '8%' // 222px / 2768px
      }}>
        We use the power of storytelling to fire the imagination, stir the soul, and ultimately inspire people.
      </div>
      
      <img 
        src="/assets/mobile/images/sliding-page/1.webp"
        style={{
          position: 'absolute',
          top: '10%', // 276px / 2768px
          left: '4.9%', // 19px / 390px (mobile width)
          width: '89%', // 347px / 390px (mobile width)
          height: '7.4%', // 205px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 1" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/2.webp"
        style={{
          position: 'absolute',
          top: '18.4%', // 510px / 2768px
          left: '62.8%', // 245px / 390px (mobile width)
          width: '31.5%', // 123px / 390px (mobile width)
          height: '10.9%', // 303px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 2" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/3.webp"
        style={{
          position: 'absolute',
          top: '26.4%', // 731px / 2768px
          left: '5.4%', // 21px / 390px (mobile width)
          width: '51.8%', // 202px / 390px (mobile width)
          height: '13.4%', // 371px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 3" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/4.webp"
        style={{
          position: 'absolute',
          top: '35.4%', // 979px / 2768px
          left: '62.8%', // 245px / 390px (mobile width)
          width: '31.5%', // 123px / 390px (mobile width)
          height: '4.4%', // 123px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 4" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/5.webp"
        style={{
          position: 'absolute',
          top: '30.2%', // 835px / 2768px
          left: '62.8%', // 245px / 390px (mobile width)
          width: '31.5%', // 123px / 390px (mobile width)
          height: '4.4%', // 123px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 5" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/6.webp"
        style={{
          position: 'absolute',
          top: '41%', // 1134px / 2768px
          left: '5.4%', // 21px / 390px (mobile width)
          width: '89%', // 347px / 390px (mobile width)
          height: '6.4%', // 177px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 6" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/7.webp"
        style={{
          position: 'absolute',
          top: '48.5%', // 1343px / 2768px
          left: '5.4%', // 21px / 390px (mobile width)
          width: '42.1%', // 164px / 390px (mobile width)
          height: '10.5%', // 290px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 7" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/8.webp"
        style={{
          position: 'absolute',
          top: '48.5%', // 1343px / 2768px
          left: '52.6%', // 205px / 390px (mobile width)
          width: '41.8%', // 163px / 390px (mobile width)
          height: '10.5%', // 290px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 8" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/9.webp"
        style={{
          position: 'absolute',
          top: '59.8%', // 1655px / 2768px
          left: '5.4%', // 21px / 390px (mobile width)
          width: '89%', // 347px / 390px (mobile width)
          height: '7.3%', // 202px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 9" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/10.webp"
        style={{
          position: 'absolute',
          top: '18.2%', // 503px / 2768px
          left: '5.4%', // 21px / 390px (mobile width)
          width: '51.5%', // 201px / 390px (mobile width)
          height: '7.3%', // 201px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 10" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/11.png"
        style={{
          position: 'absolute',
          top: '67.9%', // 1879px / 2768px
          left: '5.4%', // 21px / 390px (mobile width)
          width: '42.3%', // 165px / 390px (mobile width)
          height: '10.5%', // 292px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 11" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/12.png"
        style={{
          position: 'absolute',
          top: '67.9%', // 1879px / 2768px
          left: '52.6%', // 205px / 390px (mobile width)
          width: '44.4%', // 173px / 390px (mobile width)
          height: '6.2%', // 173px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 12" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/13.png"
        style={{
          position: 'absolute',
          top: '75.1%', // 2079px / 2768px
          left: '52.6%', // 205px / 390px (mobile width)
          width: '44.4%', // 173px / 390px (mobile width)
          height: '11.1%', // 307px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 13" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/14.png"
        style={{
          position: 'absolute',
          top: '79.5%', // 2200px / 2768px
          left: '5.4%', // 21px / 390px (mobile width)
          width: '42.3%', // 165px / 390px (mobile width)
          height: '10.6%', // 293px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 14" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/15.png"
        style={{
          position: 'absolute',
          top: '87.2%', // 2413px / 2768px
          left: '52.6%', // 205px / 390px (mobile width)
          width: '44.4%', // 173px / 390px (mobile width)
          height: '3.5%', // 97px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 15" 
      />
      
      <img 
        src="/assets/mobile/images/sliding-page/16.png"
        style={{
          position: 'absolute',
          top: '91.7%', // 2537px / 2768px
          left: '7.2%', // 28px / 390px (mobile width)
          width: '90.5%', // 353px / 390px (mobile width)
          height: '7.2%', // 199px / 2768px
          objectFit: 'cover'
        }}
        alt="Image 16" 
      />
      {/* Keyframes for animated gradient overlay */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gradientFade { 0% { opacity: 0.6; } 50% { opacity: 0.9; } 100% { opacity: 0.6; } }
        `
      }} />
    </div>
  );
};

export default IPhone13141;
