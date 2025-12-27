import React from 'react';
import { MonitorX } from 'lucide-react';

const MobileFallback: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex flex-col items-center justify-center p-8 text-center z-[20000] md:hidden">
      <MonitorX size={64} className="mb-6 text-red-400" />
      <h1 className="text-2xl font-bold mb-4">Desktop Experience Required</h1>
      <p className="text-gray-400">
        This Windows 11 simulation is designed for desktop interaction (mouse & keyboard).
        Please open this on a larger screen or maximize your browser window.
      </p>
    </div>
  );
};

export default MobileFallback;
