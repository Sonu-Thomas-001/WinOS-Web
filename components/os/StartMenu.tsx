import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS } from '../../constants';
import { AppID } from '../../types';
import { Search, Power, User, LogOut, Lock } from 'lucide-react';

const StartMenu: React.FC = () => {
  const { launchApp, shutdown, system, restart, currentUser, logout, lockSession } = useOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const filteredApps = Object.values(APPS).filter(app => 
    app.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-[600px] h-[650px] bg-[#f3f3f3]/95 dark:bg-[#202020]/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 dark:border-white/5 flex flex-col overflow-hidden animate-slide-up origin-bottom-left">
      
      {/* Search Bar */}
      <div className="p-6 pb-2">
         <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search for apps, settings, and documents" 
              className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 dark:text-white shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
         </div>
      </div>

      {/* Pinned / All Apps Area */}
      <div className="flex-1 overflow-y-auto p-6 pt-2">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Pinned</span>
          <button className="text-xs bg-white dark:bg-white/10 px-2 py-1 rounded shadow-sm border border-gray-200 dark:border-gray-600">All apps &gt;</button>
        </div>

        <div className="grid grid-cols-6 gap-4">
           {filteredApps.map((app) => (
             <button 
               key={app.id} 
               className="flex flex-col items-center gap-2 p-2 hover:bg-white/50 dark:hover:bg-white/5 rounded-md transition-colors group"
               onClick={() => launchApp(app.id)}
             >
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                   <app.icon size={24} className="text-blue-600" />
                </div>
                <span className="text-xs text-center text-gray-700 dark:text-gray-300 font-medium truncate w-full">{app.title}</span>
             </button>
           ))}
        </div>

        <div className="mt-8">
           <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Recommended</span>
           <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 pl-2">
              No recent files
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-14 bg-[#e6e6e6]/50 dark:bg-[#171717]/50 border-t border-gray-300 dark:border-gray-700 flex justify-between items-center px-6 relative">
         <div className="relative">
            <div 
               className="flex items-center gap-3 hover:bg-white/50 dark:hover:bg-white/10 p-2 rounded cursor-pointer transition-colors"
               onClick={() => setShowUserMenu(!showUserMenu)}
            >
               <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 dark:border-gray-500">
                  <img src={currentUser?.avatar} alt="User" className="w-full h-full object-cover" />
               </div>
               <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{currentUser?.name}</span>
            </div>

             {/* User Menu */}
             {showUserMenu && (
              <div className="absolute bottom-12 left-0 w-48 bg-white dark:bg-[#2d2d2d] rounded-md shadow-xl border border-gray-200 dark:border-gray-600 py-1 z-50 animate-fade-in">
                 <button onClick={lockSession} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Lock size={14} /> Lock
                 </button>
                 <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <LogOut size={14} /> Sign out
                 </button>
                 <div className="h-px bg-gray-200 dark:bg-gray-600 my-1"></div>
                 <div className="px-4 py-1 text-xs text-gray-500">Account settings</div>
              </div>
            )}
         </div>

         <div className="relative">
            <button 
              className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded text-gray-700 dark:text-gray-200"
              onClick={() => setShowPowerMenu(!showPowerMenu)}
            >
               <Power size={20} />
            </button>
            
            {/* Power Menu Popover */}
            {showPowerMenu && (
              <div className="absolute bottom-12 right-0 w-48 bg-white dark:bg-[#2d2d2d] rounded-md shadow-xl border border-gray-200 dark:border-gray-600 py-1 z-50 animate-fade-in">
                 <button onClick={() => window.location.reload()} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Sleep
                 </button>
                 <button onClick={shutdown} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Shut down
                 </button>
                 <button onClick={() => restart(false)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Restart
                 </button>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default StartMenu;
