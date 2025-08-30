import React, { useState, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const CarouselItem = ({ image, width, spacing, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imageRef = useRef(null);

  const observerCallback = (entry) => {
    if (entry.isIntersecting && imageRef.current) {
      imageRef.current.src = image.src;
    }
  };

  const setRef = useIntersectionObserver(observerCallback, {
    rootMargin: '50px',
    threshold: 0.1
  });

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
  };

  return (
    <div
      className="relative"
      style={{
        width: '620px',
        height: '350px',
        flex: 'none'
      }}
    >
      <div
        className={`w-full h-full overflow-hidden bg-gray-100 
          ${!isLoaded ? 'animate-pulse' : ''}`}
      >
        <img
          ref={(node) => {
            imageRef.current = node;
            setRef(node);
          }}
          data-src={image.src}
          alt={image.alt}
          className={`h-full w-full object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Failed to load image</span>
          </div>
        )}
      </div>
      {image.caption && (
        <div className="mt-2 text-sm text-gray-600">
          {image.caption}
        </div>
      )}
    </div>
  );
};

export default React.memo(CarouselItem);
