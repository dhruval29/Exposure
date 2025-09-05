import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import StaggeredMenu from './StaggeredMenu';
import '../styles/Gallery.css';

const NewGallery = () => {
  const [loading, setLoading] = useState(true);
  const rightSideImageRef = useRef(null);
  const loadingPageRef = useRef(null);

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  const images = [
    { src: 'https://picsum.photos/400/400?random=1', title: 'Photo 1' },
    { src: 'https://picsum.photos/400/400?random=2', title: 'Photo 2' },
    { src: 'https://picsum.photos/400/400?random=3', title: 'Photo 3' },
    { src: 'https://picsum.photos/400/400?random=4', title: 'Photo 4' },
    { src: 'https://picsum.photos/400/400?random=5', title: 'Photo 5' },
    { src: 'https://picsum.photos/400/400?random=6', title: 'Photo 6' },
    { src: 'https://picsum.photos/400/400?random=7', title: 'Photo 7' },
    { src: 'https://picsum.photos/400/400?random=8', title: 'Photo 8' },
    { src: 'https://picsum.photos/400/400?random=9', title: 'Photo 9' },
    { src: 'https://picsum.photos/400/400?random=10', title: 'Photo 10' },
    { src: 'https://picsum.photos/400/400?random=11', title: 'Photo 11' },
    { src: 'https://picsum.photos/400/400?random=12', title: 'Photo 12' },
    { src: 'https://picsum.photos/400/400?random=13', title: 'Photo 13' },
    { src: 'https://picsum.photos/400/400?random=14', title: 'Photo 14' },
    { src: 'https://picsum.photos/400/400?random=15', title: 'Photo 15' },
    { src: 'https://picsum.photos/400/400?random=16', title: 'Photo 16' }
  ];

  const previewImages = [
    { src: 'https://picsum.photos/600/800?random=1', title: 'Photo 1' },
    { src: 'https://picsum.photos/600/800?random=2', title: 'Photo 2' },
    { src: 'https://picsum.photos/600/800?random=3', title: 'Photo 3' },
    { src: 'https://picsum.photos/600/800?random=4', title: 'Photo 4' },
    { src: 'https://picsum.photos/600/800?random=5', title: 'Photo 5' },
    { src: 'https://picsum.photos/600/800?random=6', title: 'Photo 6' },
    { src: 'https://picsum.photos/600/800?random=7', title: 'Photo 7' },
    { src: 'https://picsum.photos/600/800?random=8', title: 'Photo 8' },
    { src: 'https://picsum.photos/600/800?random=9', title: 'Photo 9' },
    { src: 'https://picsum.photos/600/800?random=10', title: 'Photo 10' },
    { src: 'https://picsum.photos/600/800?random=11', title: 'Photo 11' },
    { src: 'https://picsum.photos/600/800?random=12', title: 'Photo 12' },
    { src: 'https://picsum.photos/600/800?random=13', title: 'Photo 13' },
    { src: 'https://picsum.photos/600/800?random=14', title: 'Photo 14' },
    { src: 'https://picsum.photos/600/800?random=15', title: 'Photo 15' },
    { src: 'https://picsum.photos/600/800?random=16', title: 'Photo 16' }
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
    }, 1000);

    return () => clearTimeout(timer);
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
        <div className="loading-screen" ref={loadingPageRef}>
          <div className="loading-content">
            <p className="loading-text">New Gallery</p>
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

export default NewGallery;
