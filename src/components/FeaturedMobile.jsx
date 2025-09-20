import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import StaggeredMenuFinal from './StaggeredMenuFinal';
import '../styles/Gallery.css';
import { supabase } from '../lib/supabaseClient';

const FeaturedMobile = () => {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const loaderRef = useRef(null);
  const loaderPanelRef = useRef(null);
  const loaderTextRef = useRef(null);
  const loadingPageRef = useRef(null);
  const modalRef = useRef(null);

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Our Journey', ariaLabel: 'Go to our journey page', link: '/our-journey' },
    { label: 'Featured', ariaLabel: 'View featured content', link: '/pictures' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const [images, setImages] = useState([]);
  const hasManyImages = images.length > 16;

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
          }
        } else {
          // Use fallback images if Supabase fails or returns no data
          console.log('Using fallback images - Supabase error:', error);
          if (isMounted) {
            setImages(fallbackImages);
          }
        }
      } catch (err) {
        console.error('Error loading images:', err);
        // Use fallback images on error
        if (isMounted) {
          setImages(fallbackImages);
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

  // Modal animation with non-uniform fade-in
  useEffect(() => {
    if (!modalRef.current) return;
    
    if (showModal) {
      const modal = modalRef.current;
      const image = modal.querySelector('.image-modal-image');
      const title = modal.querySelector('.image-modal-title');
      const navigation = modal.querySelector('.image-modal-navigation');
      
      // Reset initial states
      gsap.set(modal, { opacity: 0 });
      gsap.set(image, { opacity: 0, scale: 0.9, y: 20 });
      gsap.set(title, { opacity: 0, y: 20 });
      gsap.set(navigation, { opacity: 0, y: 20, scale: 0.9 });
      
      // Create non-uniform timeline
      const tl = gsap.timeline();
      
      // Background fade-in with slight delay
      tl.to(modal, { 
        opacity: 1, 
        duration: 0.4, 
        ease: 'power2.out' 
      })
      // Image appears with smooth fade and scale
      .to(image, { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.5, 
        ease: 'power2.out' 
      }, '-=0.2')
      // Title slides up with slight delay
      .to(title, { 
        opacity: 1, 
        y: 0, 
        duration: 0.4, 
        ease: 'power2.out' 
      }, '-=0.3')
      // Navigation bar slides up and scales in
      .to(navigation, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.5, 
        ease: 'power2.out' 
      }, '-=0.2');
    }
  }, [showModal]);

  // Keyboard support for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!showModal) return;
      
      switch (event.key) {
        case 'Escape':
          handleCloseModal();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlePreviousImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNextImage();
          break;
        default:
          break;
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showModal, selectedImage]);

  const handleImageClick = (image, index) => {
    setSelectedImage({ ...image, index });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (!modalRef.current) {
      setShowModal(false);
      setSelectedImage(null);
      return;
    }

    const modal = modalRef.current;
    const image = modal.querySelector('.image-modal-image');
    const title = modal.querySelector('.image-modal-title');
    const navigation = modal.querySelector('.image-modal-navigation');
    
    if (!image || !title || !navigation) {
      setShowModal(false);
      setSelectedImage(null);
      return;
    }

    // Create reverse animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setShowModal(false);
        setSelectedImage(null);
      }
    });

    // Reverse the appearance animation
    tl.to(navigation, { 
      opacity: 0, 
      y: 20, 
      scale: 0.9, 
      duration: 0.3, 
      ease: 'power2.in' 
    })
    .to(title, { 
      opacity: 0, 
      y: 20, 
      duration: 0.2, 
      ease: 'power2.in' 
    }, '-=0.1')
    .to(image, { 
      opacity: 0, 
      scale: 0.9, 
      y: 20, 
      duration: 0.3, 
      ease: 'power2.in' 
    }, '-=0.1')
    .to(modal, { 
      opacity: 0, 
      duration: 0.2, 
      ease: 'power2.in' 
    }, '-=0.1');
  };

  const handleModalClick = (e) => {
    if (e.target === modalRef.current) {
      handleCloseModal();
    }
  };

  const handlePreviousImage = () => {
    if (selectedImage && selectedImage.index > 0) {
      const prevIndex = selectedImage.index - 1;
      animateImageTransition(() => {
        setSelectedImage({ ...images[prevIndex], index: prevIndex });
      });
    }
  };

  const handleNextImage = () => {
    if (selectedImage && selectedImage.index < images.length - 1) {
      const nextIndex = selectedImage.index + 1;
      animateImageTransition(() => {
        setSelectedImage({ ...images[nextIndex], index: nextIndex });
      });
    }
  };

  const animateImageTransition = (callback) => {
    if (!modalRef.current) return;
    
    const image = modalRef.current.querySelector('.image-modal-image');
    const title = modalRef.current.querySelector('.image-modal-title');
    
    if (!image || !title) return;
    
    // Create transition animation
    const tl = gsap.timeline({
      onComplete: callback
    });
    
    // Fade out current image and title
    tl.to(image, { 
      opacity: 0, 
      duration: 0.2, 
      ease: 'power2.in' 
    })
    .to(title, { 
      opacity: 0, 
      duration: 0.15, 
      ease: 'power2.in' 
    }, '-=0.1')
    // Update image source immediately after fade out
    .add(() => {
      // The callback will update the image source
      callback();
    })
    // Fade in new image and title
    .to(image, { 
      opacity: 1, 
      duration: 0.3, 
      ease: 'power2.in' 
    })
    .to(title, { 
      opacity: 1, 
      duration: 0.2, 
      ease: 'power2.in' 
    }, '-=0.1');
  };

  return (
    <div
      className="gallery-container gallery-mobile"
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

      {/* Main Content - Mobile Grid Only */}
      <main
        className="main"
        style={{
          minHeight: '100vh'
        }}
      >
        <div className="p-home">
          <section className="p-home-grid-mode p-home-grid-mode-mobile">
            {/* Mobile Grid Container */}
            <div
              className="p-home-left-section p-home-left-section-mobile"
              style={{
                height: 'auto',
                overflow: 'visible',
                width: '100%'
              }}
            >
              {/* Grid Contents */}
              <div className="p-home-grid-mode__contents p-home-grid-mode__contents-mobile">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className="p-home-grid-mode__item" 
                    data-image-index={index + 1}
                    onClick={() => handleImageClick(image, index)}
                    style={{ cursor: 'pointer' }}
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
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Modal Overlay */}
      {showModal && selectedImage && (
        <div 
          ref={modalRef}
          className="image-modal-overlay"
          onClick={handleModalClick}
        >
          <div className="image-modal-content">
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="image-modal-image"
            />
            <div className="image-modal-title">
              {selectedImage.title}
            </div>
            
            {/* Navigation Snack Bar */}
            <div className="image-modal-navigation">
              <button 
                className="nav-button nav-prev"
                onClick={handlePreviousImage}
                disabled={selectedImage.index === 0}
                aria-label="Previous image"
              >
                <img 
                  src="/new-arrow.svg" 
                  alt="Previous" 
                  style={{
                    width: '60px',
                    height: '60px',
                    transform: 'rotate(180deg)',
                    filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(1)'
                  }}
                />
              </button>
              <button 
                className="nav-button nav-close"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                ×
              </button>
              <button 
                className="nav-button nav-next"
                onClick={handleNextImage}
                disabled={selectedImage.index === images.length - 1}
                aria-label="Next image"
              >
                <img 
                  src="/new-arrow.svg" 
                  alt="Next" 
                  style={{
                    width: '60px',
                    height: '60px',
                    filter: 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(1)'
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedMobile;
