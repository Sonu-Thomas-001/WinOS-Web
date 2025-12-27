import React from 'react';
import { useOS } from '../../context/OSContext';
import { Monitor, Volume2, Moon, Sun, Battery, Wifi } from 'lucide-react';

const SettingsApp: React.FC = () => {
  const { system, setTheme, currentUser } = useOS();

  return (
    <div className="h-full flex bg-[#f3f3f3] dark:bg-[#1f1f1f]">
      {/* Sidebar */}
      <div className="w-1/3 bg-[#f0f0f0] dark:bg-[#1a1a1a] p-4 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6 p-2">
           <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">U</div>
           <div>
              <div className="font-semibold dark:text-white">User</div>
              <div className="text-xs text-gray-500">Local Account</div>
           </div>
        </div>
        
        <div className="space-y-1">
           {['System', 'Bluetooth & devices', 'Network & internet', 'Personalization', 'Apps', 'Accounts'].map((item, i) => (
              <div key={i} className={`p-2 rounded cursor-pointer text-sm ${i === 3 ? 'bg-white dark:bg-white/10 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-white/5'} dark:text-gray-200`}>
                {item}
              </div>
           ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
         <h1 className="text-2xl font-semibold mb-6 dark:text-white">Personalization</h1>
         
         <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 mb-4">
            <h3 className="font-medium mb-4 dark:text-white">Select a theme to apply</h3>
            <div className="flex gap-4">
               <div 
                 onClick={() => setTheme('light')}
                 className={`cursor-pointer border-2 rounded-lg overflow-hidden w-32 ${currentUser?.settings.theme === 'light' ? 'border-blue-500' : 'border-transparent'}`}
               >
                  <div className="h-20 bg-blue-100 flex items-center justify-center text-gray-800"><Sun /></div>
                  <div className="p-2 text-xs text-center dark:bg-gray-800 dark:text-gray-300">Light</div>
               </div>
               <div 
                 onClick={() => setTheme('dark')}
                 className={`cursor-pointer border-2 rounded-lg overflow-hidden w-32 ${currentUser?.settings.theme === 'dark' ? 'border-blue-500' : 'border-transparent'}`}
               >
                  <div className="h-20 bg-gray-900 flex items-center justify-center text-white"><Moon /></div>
                  <div className="p-2 text-xs text-center dark:bg-gray-800 dark:text-gray-300">Dark</div>
               </div>
            </div>
         </div>

         <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 space-y-4">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <Monitor className="text-gray-500" />
                   <div>
                      <div className="text-sm font-medium dark:text-white">Display</div>
                      <div className="text-xs text-gray-500">Monitors, brightness, night light</div>
                   </div>
                </div>
                <span className="text-gray-400">&gt;</span>
             </div>
             
             <div className="h-px bg-gray-100 dark:bg-gray-600"></div>

             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <Volume2 className="text-gray-500" />
                   <div>
                      <div className="text-sm font-medium dark:text-white">Sound</div>
                      <div className="text-xs text-gray-500">Volume levels, output, input</div>
                   </div>
                </div>
                <span className="text-gray-400">&gt;</span>
             </div>
         </div>
      </div>
    </div>
  );
};

export default SettingsApp;