import React, { useState, useEffect } from 'react';
import './GalleryPage.css';

const GalleryPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [showLoading, setShowLoading] = useState(true);

  const images = [
    { src: '/public/IMAGES/4ca5bc212bb689a1f9a15d95833b43b8ebb3b9ab.png', title: 'Photo 1' },
    { src: '/public/IMAGES/66b90841dac09204196c2799eb092dfc82cb4d49.png', title: 'Photo 2' },
    { src: '/public/IMAGES/a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png', title: 'Photo 3' },
    { src: '/public/IMAGES/e6598e5c25c54119d943da26c46ea508e5daf7cf.png', title: 'Photo 4' },
    { src: '/public/IMAGES/e7643725a3b70e0bc912211e0911b18522585aa2.png', title: 'Photo 5' },
    { src: '/public/IMAGES/IMG_20241227_143322.jpg', title: 'Photo 6' },
    { src: '/public/IMAGES/fea9ef66f94ec76e2005159a55ddfbe0fc03f4b9.png', title: 'Photo 7' },
    { src: '/public/IMAGES/IMG_20241227_144906.jpg', title: 'Photo 8' },
    { src: '/public/IMAGES/IMG_20241227_143955.jpg', title: 'Photo 9' },
    { src: '/public/IMAGES/IMG_20241227_145117.jpg', title: 'Photo 10' },
    { src: '/public/IMAGES/4ca5bc212bb689a1f9a15d95833b43b8ebb3b9ab.png', title: 'Photo 11' },
    { src: '/public/IMAGES/66b90841dac09204196c2799eb092dfc82cb4d49.png', title: 'Photo 12' },
    { src: '/public/IMAGES/a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png', title: 'Photo 13' },
    { src: '/public/IMAGES/e6598e5c25c54119d943da26c46ea508e5daf7cf.png', title: 'Photo 14' },
    { src: '/public/IMAGES/e7643725a3b70e0bc912211e0911b18522585aa2.png', title: 'Photo 15' },
    { src: '/public/IMAGES/IMG_20241227_150607.jpg', title: 'Photo 16' }
  ];

  useEffect(() => {
    // Hide loading after 2 seconds
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleImageHover = (index) => {
    setCurrentImageIndex(index);
  };

  if (showLoading) {
    return (
      <div className="c-loading-page">
        <div className="c-loading-page__content">
          <p className="c-loading-page__text">Gallery</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Menu Button */}
      <button className="l-menu-button">
        <span className="l-menu-button__line"></span>
        <span className="l-menu-button__line"></span>
        <span className="l-menu-button__line"></span>
      </button>

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
                    key={index + 1}
                    href="#" 
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
                  src={images[currentImageIndex - 1]?.src} 
                  alt="Featured image" 
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

export default GalleryPage;
