import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/Gallery.css';
import { supabase } from '../lib/supabaseClient';
import SimpleNav from './SimpleNav';

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


  const [images, setImages] = useState(() => {
    const boot = typeof window !== 'undefined' ? window.__BOOTSTRAP_FEATURED__ : null;
    return boot ? [{ src: boot.src, thumb: boot.thumb, title: boot.title }] : [];
  });
  const hasManyImages = images.length > 16;
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

  // Preload full-size images (mobile) after initial load to reduce modal latency
  const preloadedSetRef = useRef(new Set());
  useEffect(() => {
    if (loading || showLoader) return;
    const limit = 12;
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
    <>
      <SimpleNav />
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
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', background: '#ede9e4', transformOrigin: 'top center' }}
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
                        src={image.thumb || image.src}
                        alt={image.title}
                        width="200"
                        height="300"
                        loading={index < 2 ? 'eager' : 'lazy'}
                        fetchpriority={index < 2 ? 'high' : 'auto'}
                        decoding="async"
                        sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw"
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
            {/* Note: metadata panel omitted on mobile to avoid clutter */}
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
    </>
  );
};

export default FeaturedMobile;
