import React from 'react';

const BootScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 mb-16 relative">
          <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500">
              <path fill="currentColor" d="M0 3.44L9.36 2.14v9.64H0z" />
              <path fill="currentColor" d="M10.63 2.15L24 0v11.77h-13.37z" />
              <path fill="currentColor" d="M0 12.87h9.36v9.75L0 21.28z" />
              <path fill="currentColor" d="M10.63 12.87H24v10.99l-13.37-1.85z" />
          </svg>
      </div>
      
      {/* Loading Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute w-full h-full border-4 border-t-white border-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default BootScreen;
