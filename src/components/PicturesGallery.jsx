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

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => {
        const list = (data.images || []).map((it, idx) => ({ src: it.url, title: `Image ${idx + 1}` }))
        setImages(list);
        setPreviewImages(list);
      })
      .catch(() => {})
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
