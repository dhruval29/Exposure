import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import StaggeredMenu from './StaggeredMenu';
import '../styles/Gallery.css';

const Gallery = () => {
  const [loading, setLoading] = useState(true);
  const rightSideImageRef = useRef(null);
  const loadingPageRef = useRef(null);

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Team', ariaLabel: 'View our team', link: '/#team' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/#frame50' }
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  const images = [
    { src: '/assets/images/gallery/66b90841dac09204196c2799eb092dfc82cb4d49.png', title: 'Photo 1' },
    { src: '/assets/images/gallery/a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png', title: 'Photo 2' },
    { src: '/assets/images/gallery/e6598e5c25c54119d943da26c46ea508e5daf7cf.png', title: 'Photo 3' },
    { src: '/assets/images/gallery/e7643725a3b70e0bc912211e0911b18522585aa2.png', title: 'Photo 4' },
    { src: '/assets/images/gallery/fea9ef66f94ec76e2005159a55ddfbe0fc03f4b9.png', title: 'Photo 5' },
    { src: '/assets/images/gallery/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png', title: 'Photo 6' },
    { src: '/assets/images/gallery/80cd277005dfbb076b97f3443adc9855fec1e19c.png', title: 'Photo 7' },
    { src: '/assets/images/gallery/f5e2cfa883ff3d24c1567c79d5a6e57231b2ef45.png', title: 'Photo 8' },
    { src: '/assets/images/gallery/66b90841dac09204196c2799eb092dfc82cb4d49.png', title: 'Photo 9' },
    { src: '/assets/images/gallery/a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png', title: 'Photo 10' },
    { src: '/assets/images/gallery/e6598e5c25c54119d943da26c46ea508e5daf7cf.png', title: 'Photo 11' },
    { src: '/assets/images/gallery/e7643725a3b70e0bc912211e0911b18522585aa2.png', title: 'Photo 12' },
    { src: '/assets/images/gallery/fea9ef66f94ec76e2005159a55ddfbe0fc03f4b9.png', title: 'Photo 13' },
    { src: '/assets/images/gallery/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png', title: 'Photo 14' },
    { src: '/assets/images/gallery/80cd277005dfbb076b97f3443adc9855fec1e19c.png', title: 'Photo 15' },
    { src: '/assets/images/gallery/f5e2cfa883ff3d24c1567c79d5a6e57231b2ef45.png', title: 'Photo 16' }
  ];

  useEffect(() => {
    // Letter-by-letter animation for loading title
    const loadingTitleEl = document.querySelector('.c-loading-page__text');
    if (loadingTitleEl) {
      const original = loadingTitleEl.textContent;
      const parts = [];
      const baseDelay = 100; // ms
      const step = 45; // ms per character
      for (let i = 0; i < original.length; i++) {
        const ch = original[i];
        if (ch === ' ') {
          parts.push(' ');
        } else {
          parts.push(`<span class="char" style="animation-delay:${baseDelay + i * step}ms">${ch}</span>`);
        }
      }
      loadingTitleEl.innerHTML = parts.join('');
      loadingTitleEl.style.visibility = 'visible';
    }

    // Hide loading page after 1 second
    const timer = setTimeout(() => {
      setLoading(false);
      if (loadingPageRef.current) {
        loadingPageRef.current.style.opacity = '0';
        setTimeout(() => {
          if (loadingPageRef.current) {
            loadingPageRef.current.style.display = 'none';
          }
        }, 600);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleImageHover = (imageIndex) => {
    if (rightSideImageRef.current && imageIndex >= 1 && imageIndex <= images.length) {
      // Add fade out effect
      rightSideImageRef.current.style.opacity = '0';
      rightSideImageRef.current.style.transform = 'scale(0.95)';
      
      // Wait for fade out, then change image and fade in
      setTimeout(() => {
        if (rightSideImageRef.current) {
          rightSideImageRef.current.src = images[imageIndex - 1].src;
          rightSideImageRef.current.alt = images[imageIndex - 1].title;
          
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
        <div className="loading-screen" ref={loadingPageRef}>
          <div className="loading-content">
            <p className="loading-text">Gallery</p>
          </div>
        </div>
      )}

      {/* StaggeredMenu */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
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
      <main className="main-content">
        <div className="gallery-grid">
          {images.map((image, index) => (
            <div
              key={index}
              className="gallery-item"
              data-image-index={index + 1}
              onMouseEnter={() => handleImageHover(index + 1)}
            >
              <div className="gallery-item-number">{index + 1}</div>
              <div className="gallery-item-image">
                <img
                  src={image.src}
                  alt={image.title}
                  width="200"
                  height="300"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Side Component */}
        <div className="gallery-preview">
          <div className="gallery-preview-image-container">
            <img
              ref={rightSideImageRef}
              src={images[0]?.src}
              alt="Default image"
              id="rightSideImage"
            />
          </div>
          <div className="gallery-preview-text">
            <span>2024</span>
            <span className="line"></span>
            <span>2025</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gallery;
