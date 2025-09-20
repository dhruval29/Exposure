import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import StaggeredMenuFinal from './StaggeredMenuFinal';
import '../styles/Gallery.css';
import { supabase } from '../lib/supabaseClient';

const Featured = () => {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const loaderRef = useRef(null);
  const loaderPanelRef = useRef(null);
  const loaderTextRef = useRef(null);
  const rightSideImageRef = useRef(null);
  const loadingPageRef = useRef(null);

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Our Journey', ariaLabel: 'Go to our journey page', link: '/our-journey' },
    { label: 'Featured', ariaLabel: 'View featured content', link: '/pictures' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/exposure.explorers_nitg/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/exposure-explorers/' },
    { label: 'YouTube', link: 'https://www.youtube.com/@Exposure-Explorers' }
  ];

  const [images, setImages] = useState([]);
  const hasManyImages = images.length > 16;
  const [previewImages, setPreviewImages] = useState([]);

  // Fallback images for testing
  const fallbackImages = [
    { src: '/public/assets/images/placeholder1.jpg', title: 'Image 1' },
    { src: '/public/assets/images/placeholder2.jpg', title: 'Image 2' },
    { src: '/public/assets/images/placeholder3.jpg', title: 'Image 3' },
    { src: '/public/assets/images/placeholder4.jpg', title: 'Image 4' },
    { src: 'https://picsum.photos/400/400?random=1', title: 'Random 1' },
    { src: 'https://picsum.photos/400/400?random=2', title: 'Random 2' },
    { src: 'https://picsum.photos/400/400?random=3', title: 'Random 3' },
    { src: 'https://picsum.photos/400/400?random=4', title: 'Random 4' },
    { src: 'https://picsum.photos/400/400?random=5', title: 'Random 5' },
    { src: 'https://picsum.photos/400/400?random=6', title: 'Random 6' },
    { src: 'https://picsum.photos/400/400?random=7', title: 'Random 7' },
    { src: 'https://picsum.photos/400/400?random=8', title: 'Random 8' }
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const timer = setTimeout(() => isMounted && setLoading(false), 1200);

    (async () => {
      try {
        const { data, error } = await supabase
          .from('public_gallery')
          .select('*')
          .limit(50);

        if (!error && Array.isArray(data) && data.length > 0) {
          const list = data.map((it, idx) => ({ src: it.url, title: it.title || `Image ${idx + 1}` }));
          if (isMounted) {
            setImages(list);
            setPreviewImages(list);
          }
        } else {
          // Use fallback images if Supabase fails or returns no data
          console.log('Using fallback images - Supabase error:', error);
          if (isMounted) {
            setImages(fallbackImages);
            setPreviewImages(fallbackImages);
          }
        }
      } catch (err) {
        console.error('Error loading images:', err);
        // Use fallback images on error
        if (isMounted) {
          setImages(fallbackImages);
          setPreviewImages(fallbackImages);
        }
      }
    })();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Shutter loader animation (white panel shrinks from top, revealing from bottom)
  useEffect(() => {
    if (!showLoader) return;
    const wrapper = loaderRef.current;
    const panel = loaderPanelRef.current;
    const text = loaderTextRef.current;
    if (!wrapper || !panel || !text) return;

    gsap.set(panel, { height: '100vh' });
    gsap.set(text, { autoAlpha: 1, y: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.to(text, { autoAlpha: 1, duration: 0.2 })
      .add('reveal')
      .to(panel, { height: 0, duration: 2.0, ease: 'power4.inOut' }, 'reveal')
      .to(text, { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 'reveal+=0.3')
      .set(wrapper, { pointerEvents: 'none', display: 'none' })
      .add(() => setShowLoader(false));

    return () => { tl.kill(); };
  }, [showLoader]);

  const handleImageHover = (imageIndex) => {
    if (rightSideImageRef.current && imageIndex >= 1 && imageIndex <= previewImages.length) {
      rightSideImageRef.current.style.opacity = '0';
      rightSideImageRef.current.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (rightSideImageRef.current) {
          rightSideImageRef.current.src = previewImages[imageIndex - 1].src;
          rightSideImageRef.current.alt = previewImages[imageIndex - 1].title;
          rightSideImageRef.current.offsetHeight;
          rightSideImageRef.current.style.opacity = '1';
          rightSideImageRef.current.style.transform = 'scale(1)';
        }
      }, 300);
    }
  };

  return (
    <div
      className="gallery-container"
      style={{
        overflowY: 'auto',
        minHeight: '100vh'
      }}
    >
      {/* Shutter Loader Overlay */}
      {showLoader && (
        <div
          ref={loaderRef}
          style={{ position: 'fixed', inset: 0, zIndex: 100000, overflow: 'hidden', pointerEvents: 'auto' }}
        >
          <div
            ref={loaderPanelRef}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', background: 'white', transformOrigin: 'top center' }}
          />
          <div
            ref={loaderTextRef}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'black', fontSize: 'clamp(24px, 6vw, 64px)', fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.02em' }}
          >
            Featured
          </div>
        </div>
      )}
      {/* Loading Page */}
      {!showLoader && loading && (
        <div className="c-loading-page" ref={loadingPageRef}>
          <div className="c-loading-page__content">
            <p className="c-loading-page__text">
              {'Featured'.split('').map((char, index) => (
                <span key={index} className="char" style={{ animationDelay: `${index * 100}ms` }}>
                  {char}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* Mobile Navigation Brand Text */}
      <div className="mobileNavBrand">
        <div className="brandLine1">EXPOSURE</div>
        <div className="brandLine2">EXPLORERS</div>
      </div>
      
      <StaggeredMenuFinal
        position="right"
        items={menuItems}
        displaySocials={true}
        displayItemNumbering={false}
        menuButtonColor="#000"
        openMenuButtonColor="#000"
        changeMenuColorOnOpen={true}
        colors={["#fde68a", "#fecaca"]}
        logoUrl="/assets/icons/new-arrow.svg"
        accentColor="#6b7280"
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />

      {/* Main Content */}
      <main
        className="main"
        style={{
          minHeight: '100vh'
        }}
      >
        <div className="p-home">
          <section className="p-home-grid-mode">
            {/* Left Section Container */}
            <div
              className="p-home-left-section"
              style={{
                height: 'auto',
                overflow: 'visible'
              }}
            >
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
                    <div 
                      className="p-home-grid-mode__item-image"
                      onLoad={(e) => {
                        const img = e.target.querySelector('img');
                        if (img && img.naturalWidth === img.naturalHeight) {
                          e.target.classList.add('square-image');
                        }
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        width="200"
                        height="300"
                        loading="lazy"
                        onLoad={(e) => {
                          if (e.target.naturalWidth === e.target.naturalHeight) {
                            e.target.parentElement.classList.add('square-image');
                          }
                        }}
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side Component */}
            <div className="p-home-right-component">
              <div className="p-home-right-component__image-container">
                {previewImages.length > 0 ? (
                  <img
                    ref={rightSideImageRef}
                    src={previewImages[0].src}
                    alt={previewImages[0].title || 'Preview image'}
                    id="rightSideImage"
                  />
                ) : (
                  <div style={{ opacity: 0.6 }}>No images yet</div>
                )}
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

export default Featured;
