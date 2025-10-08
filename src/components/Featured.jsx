import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/Gallery.css';
import { supabase } from '../lib/supabaseClient';
import SimpleNav from './SimpleNav';
import useRouteTransitionReady from '../hooks/useRouteTransitionReady';

const Featured = () => {
  const [loading, setLoading] = useState(true);
  const [isVisibleUnderCover, setIsVisibleUnderCover] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const rightSideImageRef = useRef(null);
  const modalRef = useRef(null);

  // Helper to align title/metadata relative to the displayed image with a fixed gap
  const alignModalSideText = React.useCallback(() => {
    try {
      if (!modalRef.current) return;
      const modal = modalRef.current;
      const image = modal.querySelector('.image-modal-image');
      const title = modal.querySelector('.image-modal-title');
      const metaEl = modal.querySelector('.image-metadata-left');
      if (!image || !title) return;

      const rect = image.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gapPx = 32;

      const useSidePlacement = viewportWidth >= 1025;

      if (useSidePlacement) {
        // Attempt to place title to the right of image
        title.style.position = 'fixed';
        title.style.top = `${Math.round(viewportHeight / 2)}px`;
        title.style.left = `${Math.round(rect.right + gapPx)}px`;
        title.style.transform = 'translateY(-50%)';
        title.style.marginTop = '0';
        title.style.textAlign = 'left';

        // If there isn't enough space on the right, place below
        const titleRect = title.getBoundingClientRect();
        const insufficientRightSpace = titleRect.right > viewportWidth - 16;
        const minimalRightSpace = viewportWidth - rect.right; // px space to the right of image
        if (insufficientRightSpace || minimalRightSpace < 120) {
          title.style.position = 'static';
          title.style.transform = 'none';
          title.style.marginTop = '16px';
          title.style.textAlign = 'center';
        }

        if (metaEl) {
          // Place metadata to the left if room; otherwise stack
          metaEl.style.position = 'fixed';
          metaEl.style.top = `${Math.round(viewportHeight / 2)}px`;
          metaEl.style.transform = 'translateY(-50%)';
          metaEl.style.textAlign = 'right';
          const metaWidth = metaEl.getBoundingClientRect().width || 0;
          const desiredLeft = rect.left - gapPx - metaWidth;
          if (desiredLeft < 16) {
            metaEl.style.position = 'static';
            metaEl.style.transform = 'none';
            metaEl.style.textAlign = 'center';
            metaEl.style.marginTop = '8px';
          } else {
            metaEl.style.left = `${Math.round(desiredLeft)}px`;
            metaEl.style.marginTop = '0';
          }
        }
      } else {
        // Mobile/tablet: stack below the image
        title.style.position = 'static';
        title.style.transform = 'none';
        title.style.marginTop = '12px';
        title.style.textAlign = 'center';
        if (metaEl) {
          metaEl.style.position = 'static';
          metaEl.style.transform = 'none';
          metaEl.style.textAlign = 'center';
          metaEl.style.marginTop = '6px';
        }
      }
    } catch {}
  }, []);


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

  // Mobile detection for tuning prefetch limits
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      try {
        const width = window.innerWidth;
        setIsMobile(width <= 768);
      } catch {
        setIsMobile(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          const list = data.map((it, idx) => {
            const originalUrl = it.large_url || it.public_url || it.url;
            const thumbUrl = it.thumbnail_url || it.small_url || getTransformedUrl(originalUrl, 400);
            return {
              src: originalUrl,
              thumb: thumbUrl,
              title: it.title || `Image ${start + idx + 1}`,
              // pass through metadata for modal display
              camera_make: it.camera_make,
              camera_model: it.camera_model,
              lens_model: it.lens_model,
              focal_length_mm: it.focal_length_mm,
              aperture_fnumber: it.aperture_fnumber,
              shutter_speed: it.shutter_speed,
              iso: it.iso,
              taken_at: it.taken_at
            };
          });
          if (isMounted) {
            setImages((prev) => (pageIndex === 0 ? list : [...prev, ...list]));
            const listForPreview = list.map(({ src, title }) => ({ src, title }));
            setPreviewImages((prev) => (pageIndex === 0 ? listForPreview : [...prev, ...listForPreview]));
            setHasMore(data.length === pageSize);
            setLoading(false);
          }
        } else if (isMounted) {
          setHasMore(false);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setHasMore(false);
          setLoading(false);
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

  // Make content visible under the shutter before it exits to avoid flash
  useEffect(() => {
    // If not in a transition, show as soon as we have something to render
    if (!window.__routeTransitionActive) {
      if (images && images.length > 0) setIsVisibleUnderCover(true);
    }

    const onContentReady = (ev) => {
      try {
        const path = ev?.detail?.path || ev?.detail;
        if (path && path !== '/pictures') return;
      } catch {}
      setIsVisibleUnderCover(true);
    };
    window.addEventListener('route-content-ready', onContentReady);
    return () => window.removeEventListener('route-content-ready', onContentReady);
  }, [images]);

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
              const list = data.map((it, idx) => {
                const originalUrl = it.large_url || it.public_url || it.url;
                const thumbUrl = it.thumbnail_url || it.small_url || getTransformedUrl(originalUrl, 400);
                return {
                  src: originalUrl,
                  thumb: thumbUrl,
                  title: it.title || `Image ${start + idx + 1}`,
                  camera_make: it.camera_make,
                  camera_model: it.camera_model,
                  lens_model: it.lens_model,
                  focal_length_mm: it.focal_length_mm,
                  aperture_fnumber: it.aperture_fnumber,
                  shutter_speed: it.shutter_speed,
                  iso: it.iso,
                  taken_at: it.taken_at
                };
              });
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
    if (loading) return;
    const limit = isMobile ? 12 : 20; // ensure a good chunk is ready before reveal
    let resolved = 0;
    const target = Math.min(limit, images.length);

    const maybeSignalReady = () => {
      if (resolved >= target) {
        try {
          window.__routeContentReadyForPath = '/pictures';
          window.dispatchEvent(new CustomEvent('route-content-ready', { detail: { path: '/pictures' } }));
        } catch {}
      }
    };

    images.slice(0, target).forEach((img) => {
      const url = img.thumb || img.src;
      if (!url) {
        resolved += 1;
        maybeSignalReady();
        return;
      }
      if (preloadedSetRef.current.has(url)) {
        resolved += 1;
        maybeSignalReady();
        return;
      }
      preloadedSetRef.current.add(url);
      const i = new Image();
      i.decoding = 'async';
      i.loading = 'eager';
      i.onload = () => { resolved += 1; maybeSignalReady(); };
      i.onerror = () => { resolved += 1; maybeSignalReady(); };
      i.src = url;
    });
  }, [images, loading, isMobile]);

  // Removed component-specific preloader

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

      // Align initially and on resize
      alignModalSideText();
      const onResize = () => alignModalSideText();
      window.addEventListener('resize', onResize);

      // Cleanup listener when modal closes
      return () => {
        window.removeEventListener('resize', onResize);
      };
    }
  }, [showModal]);

  // Re-align when the selected image changes while modal is open (e.g., next/prev)
  useEffect(() => {
    if (!showModal) return;
    // Run after React paints the new image src
    const id = setTimeout(() => alignModalSideText(), 0);
    return () => clearTimeout(id);
  }, [showModal, selectedImage, alignModalSideText]);

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
          // Always use full-size image on the right-side preview
          rightSideImageRef.current.src = imgObj.src;
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

  const handleRightImageClick = () => {
    try {
      if (!rightSideImageRef.current || images.length === 0) return;
      const currentSrc = rightSideImageRef.current.getAttribute('src');
      const index = Math.max(0, images.findIndex((it) => it.src === currentSrc));
      const useIndex = index === -1 ? 0 : index;
      const image = images[useIndex];
      handleImageClick(image, useIndex);
    } catch {}
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

  const isRouteReady = useRouteTransitionReady();

  return (
    <>
      <SimpleNav />
      <div
        className="gallery-container"
        style={{
          overflowY: 'auto',
          minHeight: '100vh',
          opacity: isVisibleUnderCover || isRouteReady ? 1 : 0,
          transition: 'opacity 300ms ease'
      }}
    >
      {/* Removed component-specific loader and loading page */}

      

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
                    src={images[0].src}
                    alt={images[0].title || 'Preview image'}
                    id="rightSideImage"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                    onClick={handleRightImageClick}
                    style={{ cursor: 'pointer' }}
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
              onLoad={(e) => {
                const img = e.currentTarget;
                const { naturalWidth: nw, naturalHeight: nh } = img;
                img.classList.remove('landscape', 'portrait', 'square');
                if (nw && nh) {
                  if (Math.abs(nw - nh) < 2) {
                    img.classList.add('square');
                  } else if (nw > nh) {
                    img.classList.add('landscape');
                  } else {
                    img.classList.add('portrait');
                  }
                }
                // Align title/metadata after the image settles
                requestAnimationFrame(() => alignModalSideText());
              }}
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
    </>
  );
};

export default Featured;
