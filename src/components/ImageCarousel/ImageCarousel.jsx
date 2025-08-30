import React, { useState, useRef, useEffect, useCallback } from 'react';
import CarouselItem from './components/CarouselItem';
import NavigationArrows from './components/NavigationArrows';
import PaginationDots from './components/PaginationDots';
import { useSwipe } from './hooks/useSwipe';

const ImageCarousel = ({
  images = [],
  autoPlay = false,
  autoPlayInterval = 3000,
  showDots = true,
  showArrows = true,
  itemsPerView = 1,
  spacing = 16
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);

  const itemWidth = useRef(0);
  const totalItems = images.length;

  useEffect(() => {
    const updateItemWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const totalSpacing = spacing * (itemsPerView - 1);
        itemWidth.current = (containerWidth - totalSpacing) / itemsPerView;
      }
    };

    updateItemWidth();
    window.addEventListener('resize', updateItemWidth);

    return () => {
      window.removeEventListener('resize', updateItemWidth);
    };
  }, [spacing, itemsPerView]);

  const scrollToIndex = useCallback((index) => {
    if (containerRef.current) {
      const scrollLeft = index * (itemWidth.current + spacing);
      containerRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [spacing]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prev => {
      const nextIndex = prev + 1 >= totalItems ? 0 : prev + 1;
      scrollToIndex(nextIndex);
      return nextIndex;
    });
  }, [totalItems, scrollToIndex, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex(prev => {
      const nextIndex = prev - 1 < 0 ? totalItems - 1 : prev - 1;
      scrollToIndex(nextIndex);
      return nextIndex;
    });
  }, [totalItems, scrollToIndex, isTransitioning]);

  const handleSwipe = useCallback((direction) => {
    if (direction === 'left') {
      handleNext();
    } else {
      handlePrev();
    }
  }, [handleNext, handlePrev]);

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe(handleSwipe);

  const handleWheel = useCallback((e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      if (e.deltaX > 50) {
        handleNext();
      } else if (e.deltaX < -50) {
        handlePrev();
      }
    }
  }, [handleNext, handlePrev]);

  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(handleNext, autoPlayInterval);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, handleNext]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  if (!images.length) {
    return null;
  }

  return (
    <div className="relative w-full h-full" aria-label="Image carousel">
      <div
        ref={containerRef}
        className="absolute"
        style={{
          width: '3901px',
          height: '350px',
          position: 'relative',
          display: 'flex',
          gap: '37px'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
        onTransitionEnd={handleTransitionEnd}
      >
        {images.map((image, index) => (
          <CarouselItem
            key={index}
            image={image}
            width={itemWidth.current}
            spacing={spacing}
          />
        ))}
      </div>

      <NavigationArrows
        showArrows={showArrows}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <PaginationDots
        showDots={showDots}
        total={totalItems}
        current={currentIndex}
        onClick={scrollToIndex}
      />
    </div>
  );
};

export default ImageCarousel;
