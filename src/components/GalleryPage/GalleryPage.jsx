import React, { useState, useEffect } from 'react';
import './GalleryPage.css';

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Gallery images data
  const galleryImages = [
    {
      id: 1,
      src: '/pictures/4ca5bc212bb689a1f9a15d95833b43b8ebb3b9ab.png',
      alt: 'Gallery Image 1',
      category: 'nature',
      title: 'Natural Landscape'
    },
    {
      id: 2,
      src: '/pictures/66b90841dac09204196c2799eb092dfc82cb4d49.png',
      alt: 'Gallery Image 2',
      category: 'urban',
      title: 'Urban Scene'
    },
    {
      id: 3,
      src: '/pictures/forest.png',
      alt: 'Forest Scene',
      category: 'nature',
      title: 'Forest View'
    },
    {
      id: 4,
      src: '/pictures/e6598e5c25c54119d943da26c46ea508e5daf7cf.png',
      alt: 'Gallery Image 4',
      category: 'abstract',
      title: 'Abstract Art'
    },
    {
      id: 5,
      src: '/pictures/fea9ef66f94ec76e2005159a55ddfbe0fc03f4b9.png',
      alt: 'Gallery Image 5',
      category: 'nature',
      title: 'Natural Beauty'
    },
    {
      id: 6,
      src: '/pictures/e7643725a3b70e0bc912211e0911b18522585aa2.png',
      alt: 'Gallery Image 6',
      category: 'urban',
      title: 'City Life'
    },
    {
      id: 7,
      src: '/pictures/a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png',
      alt: 'Gallery Image 7',
      category: 'abstract',
      title: 'Modern Design'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Images' },
    { id: 'nature', name: 'Nature' },
    { id: 'urban', name: 'Urban' },
    { id: 'abstract', name: 'Abstract' }
  ];

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  const openLightbox = (image) => {
    setSelectedImage(image);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex + 1 >= filteredImages.length ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex - 1 < 0 ? filteredImages.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedImage, filteredImages]);

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1 className="gallery-title">Image Gallery</h1>
        <p className="gallery-subtitle">Explore our collection of stunning images</p>
      </div>

      <div className="gallery-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${filter === category.id ? 'active' : ''}`}
            onClick={() => setFilter(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="gallery-item"
            onClick={() => openLightbox(image)}
          >
            <div className="image-container">
              <img
                src={image.src}
                alt={image.alt}
                className="gallery-image"
                loading="lazy"
              />
              <div className="image-overlay">
                <div className="image-info">
                  <h3 className="image-title">{image.title}</h3>
                  <p className="image-category">{image.category}</p>
                </div>
                <div className="view-icon">👁</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLightboxOpen && selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              ×
            </button>
            
            <div className="lightbox-image-container">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="lightbox-image"
              />
            </div>
            
            <div className="lightbox-info">
              <h2 className="lightbox-title">{selectedImage.title}</h2>
              <p className="lightbox-category">{selectedImage.category}</p>
            </div>
            
            <button 
              className="lightbox-nav prev" 
              onClick={() => navigateImage('prev')}
            >
              ‹
            </button>
            <button 
              className="lightbox-nav next" 
              onClick={() => navigateImage('next')}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
