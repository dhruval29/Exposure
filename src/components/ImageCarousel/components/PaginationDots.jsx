import React from 'react';

const PaginationDots = ({ total, current, showDots, onClick }) => {
  if (!showDots) return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onClick(i)}
          className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${i === current 
              ? 'bg-white w-4' 
              : 'bg-white/50 hover:bg-white/75'
            }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
};

export default React.memo(PaginationDots);
