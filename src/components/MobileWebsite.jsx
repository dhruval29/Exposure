import React from 'react';

export default function MobileWebsite() {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Container */}
      <div className="max-w-md mx-auto bg-white shadow-lg">
        
        {/* Top Image Row */}
        <div className="flex gap-2 p-4">
          <div className="flex-1 h-48 bg-gray-200 rounded-lg overflow-hidden">
            <img 
              src="https://placehold.co/400x300/4A90E2/FFFFFF?text=Train+Station" 
              alt="Train at station"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 h-48 bg-gray-200 rounded-lg overflow-hidden">
            <img 
              src="https://placehold.co/400x300/FF6B6B/FFFFFF?text=Person+in+Water" 
              alt="Person in white dress in water"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Middle Section */}
        <div className="px-4 pb-4">
          {/* Main Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-black uppercase tracking-wider">
              EXPOSURE EXPLORERS
            </h1>
          </div>

          {/* Side Images with Title */}
          <div className="flex gap-4 mb-6">
            <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://placehold.co/200x300/8BC34A/FFFFFF?text=Forest+Path" 
                alt="Forest path with autumn leaves"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <h2 className="text-2xl font-bold text-black uppercase tracking-wide">
                EXPOSURE<br/>EXPLORERS
              </h2>
            </div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://placehold.co/200x200/9C27B0/FFFFFF?text=Glowing+Cube" 
                alt="Glowing cube-like object"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bottom Image Row */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1 h-40 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://placehold.co/400x300/FF9800/FFFFFF?text=Classical+Building" 
                alt="Classical architecture building"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 h-40 bg-gray-200 rounded-lg overflow-hidden relative">
              <img 
                src="https://placehold.co/400x300/FF5722/FFFFFF?text=Palm+Tree+Sunset" 
                alt="Palm tree silhouetted at sunset"
                className="w-full h-full object-cover"
              />
              {/* Small abstract water image */}
              <div className="absolute top-2 right-2 w-12 h-12 bg-blue-400 rounded-full overflow-hidden">
                <img 
                  src="https://placehold.co/100x100/2196F3/FFFFFF?text=Water" 
                  alt="Abstract swirling water"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Storytelling Text */}
          <div className="mb-6">
            <p className="text-lg text-black leading-relaxed font-sans" style={{ cursor: "url('/W/Vector.png') 0 0, text" }}>
              We use the power of storytelling to fire the imagination, stir the soul, and ultimately inspire people.
            </p>
          </div>

          {/* Bottom Large Images */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1 h-48 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://placehold.co/400x300/4CAF50/FFFFFF?text=Forest+Stream" 
                alt="Forest scene with stream and fallen logs"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 h-48 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://placehold.co/400x300/607D8B/FFFFFF?text=Modern+Building" 
                alt="Tall modern building viewed from below"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          {/* Page Navigation */}
          <div className="flex items-center justify-center mb-4">
            <button className="p-2 text-gray-600 hover:text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="mx-4 text-sm font-medium text-gray-700">2 / 24</span>
            <button className="p-2 text-gray-600 hover:text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Design Tool Icons */}
          <div className="flex items-center justify-center space-x-4">
            <button className="p-2 bg-green-500 text-white rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
