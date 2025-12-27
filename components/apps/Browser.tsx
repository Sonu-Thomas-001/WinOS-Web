import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, X } from 'lucide-react';

const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputVal, setInputVal] = useState('https://www.wikipedia.org');

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputVal;
    if (!target.startsWith('http')) target = 'https://' + target;
    setUrl(target);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Browser Chrome */}
      <div className="flex flex-col border-b border-gray-200 dark:border-gray-700">
         {/* Tabs */}
         <div className="flex px-2 pt-2 bg-gray-100 dark:bg-gray-900 gap-1">
            <div className="w-48 bg-white dark:bg-gray-800 p-2 rounded-t-lg flex justify-between items-center text-xs border-t border-x border-gray-200 dark:border-gray-700 relative -bottom-px shadow-sm">
               <span className="truncate">New Tab</span>
               <X size={12} className="cursor-pointer hover:bg-gray-200 rounded-full p-0.5" />
            </div>
            <div className="p-2 text-gray-500">+</div>
         </div>
         
         {/* Toolbar */}
         <div className="flex items-center p-2 gap-3 bg-white dark:bg-gray-800">
            <div className="flex gap-2 text-gray-600 dark:text-gray-400">
               <ArrowLeft size={18} className="cursor-pointer hover:text-blue-500" />
               <ArrowRight size={18} className="cursor-pointer hover:text-blue-500" />
               <RotateCw size={18} className="cursor-pointer hover:text-blue-500" />
            </div>
            <form onSubmit={handleNavigate} className="flex-1">
               <input 
                 className="w-full bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
                 value={inputVal}
                 onChange={(e) => setInputVal(e.target.value)}
               />
            </form>
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white relative">
         <iframe 
            src={url} 
            className="w-full h-full border-none"
            title="Browser"
            sandbox="allow-scripts allow-same-origin allow-forms"
         />
      </div>
    </div>
  );
};

export default Browser;
