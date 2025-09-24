import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import StaggeredMenuFinal from './StaggeredMenuFinal';
import '../styles/Gallery.css';
import { supabase } from '../lib/supabaseClient';

const Featured = () => {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const loaderRef = useRef(null);
  const loaderPanelRef = useRef(null);
  const loaderTextRef = useRef(null);
  const rightSideImageRef = useRef(null);
  const loadingPageRef = useRef(null);
  const modalRef = useRef(null);

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Our Journey', ariaLabel: 'Go to our journey page', link: '/our-journey' },
    { label: 'Team', ariaLabel: 'View team page', link: '/team' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/exposure.explorers_nitg/' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/company/exposure-explorers/' },
    { label: 'YouTube', link: 'https://www.youtube.com/@Exposure-Explorers' }
  ];

  const [images, setImages] = useState(() => {
    const boot = typeof window !== 'undefined' ? window.__BOOTSTRAP_FEATURED__ : null;
    return boot ? [{ src: boot.src, thumb: boot.thumb, title: boot.title }] : [];
  });
  const hasManyImages = images.length > 16;
  const [previewImages, setPreviewImages] = useState([]);
  const loadMoreRef = useRef(null);
  const isLoadingMoreRef = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const getTransformedUrl = (url, width, quality = 70, format = 'webp') => {
    try {
      if (!url) return url;
      if (supabaseUrl && String(url).startsWith(supabaseUrl)) {
        const u = new URL(url);
        u.searchParams.set('width', String(width));
        u.searchParams.set('quality', String(quality));
        u.searchParams.set('format', format);
        return u.toString();
      }
      return url;
    } catch {
      return url;
    }
  };

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

    const fetchPage = async (pageIndex) => {
      if (!isMounted) return;
      const start = pageIndex * pageSize;
      const end = start + pageSize - 1;
      try {
        const { data, error } = await supabase
          .from('featured_gallery')
          .select('*')
          .range(start, end);

        if (!error && Array.isArray(data)) {
          const list = data.map((it, idx) => ({
            src: it.url,
            thumb: it.thumbnail_url ? it.thumbnail_url : getTransformedUrl(it.url, 400),
            title: it.title || `Image ${start + idx + 1}`
          }));
          if (isMounted) {
            setImages((prev) => (pageIndex === 0 ? list : [...prev, ...list]));
            const listForPreview = list.map(({ src, title }) => ({ src, title }));
            setPreviewImages((prev) => (pageIndex === 0 ? listForPreview : [...prev, ...listForPreview]));
            setHasMore(data.length === pageSize);
            setLoading(false);
            // Do not force-hide loader; let the shutter animation control dismissal for consistency with Home
          }
        } else if (isMounted) {
          setHasMore(false);
          setLoading(false);
          // Do not force-hide loader; let the shutter animation control dismissal for consistency with Home
        }
      } catch (err) {
        if (isMounted) {
          setHasMore(false);
          setLoading(false);
          // Do not force-hide loader; let the shutter animation control dismissal for consistency with Home
        }
      }
    };

    // If bootstrap seeded the first image, still fetch page 0 but avoid duplicate
    fetchPage(0);
    setPage(0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !isLoadingMoreRef.current) {
        isLoadingMoreRef.current = true;
        const nextPage = page + 1;
        const start = nextPage * pageSize;
        const end = start + pageSize - 1;
        supabase
          .from('featured_gallery')
          .select('*')
          .range(start, end)
          .then(({ data, error }) => {
            if (!error && Array.isArray(data) && data.length > 0) {
              const list = data.map((it, idx) => ({
                src: it.url,
                thumb: it.thumbnail_url ? it.thumbnail_url : getTransformedUrl(it.url, 400),
                title: it.title || `Image ${start + idx + 1}`
              }));
              setImages((prev) => [...prev, ...list]);
              const listForPreview = list.map(({ src, title }) => ({ src, title }));
              setPreviewImages((prev) => [...prev, ...listForPreview]);
              setHasMore(data.length === pageSize);
              setPage(nextPage);
            } else {
              setHasMore(false);
            }
          })
          .finally(() => {
            isLoadingMoreRef.current = false;
          });
      }
    }, { rootMargin: '200px 0px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, page]);

  // Preload full-size images in the background once initial page load completes
  const preloadedSetRef = useRef(new Set());
  useEffect(() => {
    if (loading || showLoader) return;
    if (document.readyState !== 'complete') {
      const onLoad = () => {
        // small delay to let main thread settle
        setTimeout(() => {
          const limit = 16; // cap background preloads
          images.slice(0, limit).forEach((img) => {
            const url = img.src;
            if (!url || preloadedSetRef.current.has(url)) return;
            preloadedSetRef.current.add(url);
            const i = new Image();
            i.decoding = 'async';
            i.loading = 'eager';
            i.src = url;
          });
        }, 300);
      };
      window.addEventListener('load', onLoad, { once: true });
      return () => window.removeEventListener('load', onLoad);
    }
    // If already loaded
    const limit = 16;
    images.slice(0, limit).forEach((img) => {
      const url = img.src;
      if (!url || preloadedSetRef.current.has(url)) return;
      preloadedSetRef.current.add(url);
      const i = new Image();
      i.decoding = 'async';
      i.loading = 'eager';
      i.src = url;
    });
  }, [images, loading, showLoader]);

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
      
      // Calculate scrollbar width and prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.body.classList.add('modal-open');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
      document.documentElement.style.removeProperty('--scrollbar-width');
    };
  }, [showModal, selectedImage]);

  const handleImageHover = (imageIndex) => {
    if (rightSideImageRef.current && imageIndex >= 1 && imageIndex <= images.length) {
      rightSideImageRef.current.style.opacity = '0';
      rightSideImageRef.current.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (rightSideImageRef.current) {
          const imgObj = images[imageIndex - 1];
          rightSideImageRef.current.src = imgObj.thumb || imgObj.src;
          rightSideImageRef.current.alt = imgObj.title;
          rightSideImageRef.current.offsetHeight;
          rightSideImageRef.current.style.opacity = '1';
          rightSideImageRef.current.style.transform = 'scale(1)';
        }
      }, 300);
    }
  };

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

      {/* Navigation Brand Text */}
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
        onMenuOpen={() => {}}
        onMenuClose={() => {}}
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
                  <div 
                    key={index}
                    className="p-home-grid-mode__item" 
                    data-image-index={index + 1}
                    onMouseEnter={() => handleImageHover(index + 1)}
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
                        src={image.thumb || image.src}
                        alt={image.title}
                        width="200"
                        height="300"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchpriority={index === 0 ? 'high' : 'auto'}
                        decoding="async"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        onLoad={(e) => {
                          if (e.target.naturalWidth === e.target.naturalHeight) {
                            e.target.parentElement.classList.add('square-image');
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div ref={loadMoreRef} style={{ height: '1px' }} />
              </div>
            </div>

            {/* Right Side Component */}
            <div className="p-home-right-component">
              <div className="p-home-right-component__image-container">
                {images.length > 0 ? (
                  <img
                    ref={rightSideImageRef}
                    src={images[0].thumb || images[0].src}
                    alt={images[0].title || 'Preview image'}
                    id="rightSideImage"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
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
            {/* Left metadata panel (desktop) */}
            {(() => {
              const img = images[selectedImage.index] || {};
              const lines = [];
              if (img.camera_make || img.camera_model) lines.push(`${img.camera_make || ''} ${img.camera_model || ''}`.trim());
              if (img.lens_model) lines.push(img.lens_model);
              const specs = [
                img.focal_length_mm ? `${img.focal_length_mm}mm` : null,
                img.aperture_fnumber ? `f/${img.aperture_fnumber}` : null,
                img.shutter_speed || null,
                img.iso ? `ISO ${img.iso}` : null,
              ].filter(Boolean).join(' • ');
              if (specs) lines.push(specs);
              return lines.length ? (
                <div className="image-metadata-left">
                  {lines.join('\n')}
                </div>
              ) : null;
            })()}
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

export default Featured;
