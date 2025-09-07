import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import StaggeredMenu from './StaggeredMenu';
import '../styles/Gallery.css';

const PicturesGallery = () => {
  const [loading, setLoading] = useState(true);
  const rightSideImageRef = useRef(null);
  const loadingPageRef = useRef(null);

  const menuItems = [
    { label: 'Our Journey', ariaLabel: 'Go to our journey page', link: '/our-journey' },
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Team', ariaLabel: 'Meet our team', link: '/team' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/exposure.explorers_nitg/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/exposure-explorers/' },
    { label: 'YouTube', link: 'https://www.youtube.com/@Exposure-Explorers' }
  ];

  const images = [
    { src: '/assets/images/Pictures/1735169740148-2.jpg', title: 'Exposure 1' },
    { src: '/assets/images/Pictures/1735169741900 (2).jpg', title: 'Exposure 2' },
    { src: '/assets/images/Pictures/1735169742227.jpg', title: 'Exposure 3' },
    { src: '/assets/images/Pictures/66b90841dac09204196c2799eb092dfc82cb4d49.png', title: 'Exposure 4' },
    { src: '/assets/images/Pictures/80cd277005dfbb076b97f3443adc9855fec1e19c.png', title: 'Exposure 5' },
    { src: '/assets/images/Pictures/a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png', title: 'Exposure 6' },
    { src: '/assets/images/Pictures/e6598e5c25c54119d943da26c46ea508e5daf7cf.png', title: 'Exposure 7' },
    { src: '/assets/images/Pictures/e7643725a3b70e0bc912211e0911b18522585aa2.png', title: 'Exposure 8' },
    { src: '/assets/images/Pictures/f5e2cfa883ff3d24c1567c79d5a6e57231b2ef45.png', title: 'Exposure 9' },
    { src: '/assets/images/Pictures/fea9ef66f94ec76e2005159a55ddfbe0fc03f4b9.png', title: 'Exposure 10' },
    { src: '/assets/images/Pictures/IMG_20241014_155217-5.jpg', title: 'Exposure 11' },
    { src: '/assets/images/Pictures/IMG_20241229_134141.jpg', title: 'Exposure 12' },
    { src: '/assets/images/Pictures/IMG_20250106_201327.jpg', title: 'Exposure 13' },
    { src: '/assets/images/Pictures/IMG_20250108_151138.jpg', title: 'Exposure 14' },
    { src: '/assets/images/Pictures/IMG_20250114_093607.jpg', title: 'Exposure 15' },
    { src: '/assets/images/Pictures/IMG_20250114_191924.jpg', title: 'Exposure 16' }
  ];

  const previewImages = [
    { src: '/assets/images/Pictures/1735169740148-2.jpg', title: 'Exposure 1' },
    { src: '/assets/images/Pictures/1735169741900 (2).jpg', title: 'Exposure 2' },
    { src: '/assets/images/Pictures/1735169742227.jpg', title: 'Exposure 3' },
    { src: '/assets/images/Pictures/66b90841dac09204196c2799eb092dfc82cb4d49.png', title: 'Exposure 4' },
    { src: '/assets/images/Pictures/80cd277005dfbb076b97f3443adc9855fec1e19c.png', title: 'Exposure 5' },
    { src: '/assets/images/Pictures/a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png', title: 'Exposure 6' },
    { src: '/assets/images/Pictures/e6598e5c25c54119d943da26c46ea508e5daf7cf.png', title: 'Exposure 7' },
    { src: '/assets/images/Pictures/e7643725a3b70e0bc912211e0911b18522585aa2.png', title: 'Exposure 8' },
    { src: '/assets/images/Pictures/f5e2cfa883ff3d24c1567c79d5a6e57231b2ef45.png', title: 'Exposure 9' },
    { src: '/assets/images/Pictures/fea9ef66f94ec76e2005159a55ddfbe0fc03f4b9.png', title: 'Exposure 10' },
    { src: '/assets/images/Pictures/IMG_20241014_155217-5.jpg', title: 'Exposure 11' },
    { src: '/assets/images/Pictures/IMG_20241229_134141.jpg', title: 'Exposure 12' },
    { src: '/assets/images/Pictures/IMG_20250106_201327.jpg', title: 'Exposure 13' },
    { src: '/assets/images/Pictures/IMG_20250108_151138.jpg', title: 'Exposure 14' },
    { src: '/assets/images/Pictures/IMG_20250114_093607.jpg', title: 'Exposure 15' },
    { src: '/assets/images/Pictures/IMG_20250114_191924.jpg', title: 'Exposure 16' }
  ];

  useEffect(() => {
    // Reset loading state when component mounts
    setLoading(true);
    
    // Hide loading page after 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      setLoading(false); // Ensure loading is false when component unmounts
    };
  }, []);

  const handleImageHover = (imageIndex) => {
    if (rightSideImageRef.current && imageIndex >= 1 && imageIndex <= previewImages.length) {
      // Add fade out effect
      rightSideImageRef.current.style.opacity = '0';
      rightSideImageRef.current.style.transform = 'scale(0.95)';
      
      // Wait for fade out, then change image and fade in
      setTimeout(() => {
        if (rightSideImageRef.current) {
          rightSideImageRef.current.src = previewImages[imageIndex - 1].src;
          rightSideImageRef.current.alt = previewImages[imageIndex - 1].title;
          
          // Force reflow to ensure the new image loads
          rightSideImageRef.current.offsetHeight;
          
          // Fade in
          rightSideImageRef.current.style.opacity = '1';
          rightSideImageRef.current.style.transform = 'scale(1)';
        }
      }, 300);
    }
  };

  return (
    <div className="gallery-container">
      {/* Loading Page */}
      {loading && (
        <div className="c-loading-page" ref={loadingPageRef}>
          <div className="c-loading-page__content">
            <p className="c-loading-page__text">
              {'Gallery'.split('').map((char, index) => (
                <span key={index} className="char" style={{ animationDelay: `${index * 100}ms` }}>
                  {char}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* StaggeredMenu */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={false}
        menuButtonColor="#000"
        openMenuButtonColor="#000"
        changeMenuColorOnOpen={true}
        colors={['#B19EEF', '#5227FF']}
        logoUrl="/src/assets/logos/reactbits-gh-white.svg"
        accentColor="#ff6b6b"
        onMenuOpen={() => {}}
        onMenuClose={() => {}}
      />

      {/* Main Content */}
      <main className="main">
        <div className="p-home">
          <section className="p-home-grid-mode">
            {/* Left Section Container */}
            <div className="p-home-left-section">
              {/* Grid Contents */}
              <div className="p-home-grid-mode__contents">
                {images.map((image, index) => (
                  <a 
                    href="#" 
                    key={index}
                    className="p-home-grid-mode__item" 
                    data-image-index={index + 1}
                    onMouseEnter={() => handleImageHover(index + 1)}
                  >
                    <p className="p-home-grid-mode__item-num">{index + 1}</p>
                    <div className="p-home-grid-mode__item-image">
                      <img
                        src={image.src}
                        alt={image.title}
                        width="200"
                        height="300"
                        loading="lazy"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side Component */}
            <div className="p-home-right-component">
              <div className="p-home-right-component__image-container">
                <img
                  ref={rightSideImageRef}
                  src={previewImages[0]?.src}
                  alt="Default image"
                  id="rightSideImage"
                />
              </div>
              <div className="p-home-right-component__text">
                <span>2024</span>
                <span className="line"></span>
                <span>2025</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PicturesGallery;
