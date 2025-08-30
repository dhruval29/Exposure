import React from 'react';

const NavigationArrows = ({ onPrev, onNext, showArrows }) => {
  if (!showArrows) return null;

  const baseClasses = `
    absolute top-1/2 -translate-y-1/2 flex items-center justify-center
    w-10 h-10 rounded-full bg-white/80 shadow-lg cursor-pointer
    hover:bg-white transition-all duration-300 focus:outline-none
    focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
  `;

  return (
    <>
      <button
        className={`${baseClasses} left-4`}
        onClick={onPrev}
        aria-label="Previous image"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        className={`${baseClasses} right-4`}
        onClick={onNext}
        aria-label="Next image"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </>
  );
};

export default React.memo(NavigationArrows);
