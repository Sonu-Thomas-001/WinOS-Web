import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS } from '../../constants';
import { AppID } from '../../types';
import { Search, Star, Download, Check, Trash2 } from 'lucide-react';

const AppStore: React.FC = () => {
  const { system, installApp, uninstallApp } = useOS();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAppId, setSelectedAppId] = useState<AppID | null>(null);
  const [installing, setInstalling] = useState<AppID | null>(null);

  const allApps = Object.values(APPS).filter(app => app.id !== AppID.STORE); // Don't show store in store
  
  const handleInstall = (id: AppID) => {
     setInstalling(id);
     setTimeout(() => {
        installApp(id);
        setInstalling(null);
     }, 2000);
  };

  const selectedApp = selectedAppId ? APPS[selectedAppId] : null;

  return (
    <div className="flex h-full bg-[#f3f3f3] dark:bg-[#1f1f1f]">
      {/* Sidebar */}
      <div className="w-48 p-4 flex flex-col gap-1 border-r border-gray-200 dark:border-gray-700">
         <div className="mb-6 px-2 font-bold text-xl flex items-center gap-2 dark:text-white">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-8 h-8 rounded text-white flex items-center justify-center">
               MS
            </div>
            Store
         </div>
         
         {['Home', 'Apps', 'Gaming', 'Library', 'Updates'].map(tab => (
            <button 
               key={tab}
               className={`text-left px-4 py-2 rounded-md transition-colors ${activeTab === tab.toLowerCase() ? 'bg-white dark:bg-white/10 shadow-sm font-medium' : 'hover:bg-gray-200 dark:hover:bg-white/5'} dark:text-gray-200`}
               onClick={() => { setActiveTab(tab.toLowerCase()); setSelectedAppId(null); }}
            >
               {tab}
            </button>
         ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
         {selectedApp ? (
            // App Details View
            <div className="p-8 animate-fade-in">
               <button onClick={() => setSelectedAppId(null)} className="mb-4 text-blue-600 dark:text-blue-400 hover:underline">&larr; Back</button>
               
               <div className="flex gap-6 mb-8">
                  <div className="w-32 h-32 bg-white dark:bg-white/10 rounded-xl shadow-lg flex items-center justify-center">
                     <selectedApp.icon size={64} className="text-blue-500" />
                  </div>
                  <div>
                     <h1 className="text-3xl font-bold dark:text-white mb-2">{selectedApp.title}</h1>
                     <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">{selectedApp.category || 'App'}</span>
                        <span>•</span>
                        <div className="flex items-center text-yellow-500"><Star size={12} fill="currentColor"/> {selectedApp.rating || '4.5'}</div>
                        <span>•</span>
                        <span>{selectedApp.publisher || 'Microsoft Corporation'}</span>
                     </div>
                     
                     <div className="flex gap-3">
                        {system.installedApps.includes(selectedApp.id) ? (
                           <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-6 py-2 rounded text-sm font-medium flex items-center gap-2 dark:text-white">
                              <Check size={16} /> Installed
                           </button>
                        ) : (
                           <button 
                              onClick={() => handleInstall(selectedApp.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                              disabled={installing === selectedApp.id}
                           >
                              {installing === selectedApp.id ? 'Downloading...' : 'Get'}
                           </button>
                        )}
                        
                        {system.installedApps.includes(selectedApp.id) && !selectedApp.isSystem && (
                            <button onClick={() => uninstallApp(selectedApp.id)} className="border border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded text-sm font-medium text-red-600">
                               Uninstall
                            </button>
                        )}
                     </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-[#2b2b2b] rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 dark:text-white">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                     {selectedApp.description || `Experience the power of ${selectedApp.title}. This application offers state-of-the-art features designed to enhance your productivity and creativity within the WinOS ecosystem.`}
                  </p>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                     <div className="h-48 bg-gray-100 dark:bg-black/20 rounded-lg flex items-center justify-center text-gray-400">Screenshot 1</div>
                     <div className="h-48 bg-gray-100 dark:bg-black/20 rounded-lg flex items-center justify-center text-gray-400">Screenshot 2</div>
                  </div>
               </div>
            </div>
         ) : (
            // Home / Browse View
            <div className="p-8">
               {/* Hero Banner */}
               <div className="h-64 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-8 flex items-center px-10 text-white shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="relative z-10">
                     <h2 className="text-4xl font-bold mb-2">Essential Apps</h2>
                     <p className="text-lg opacity-90 mb-6">Boost your productivity with these must-have tools.</p>
                     <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-medium shadow-md hover:scale-105 transition-transform">Browse Collection</button>
                  </div>
               </div>

               <h2 className="text-xl font-semibold mb-4 dark:text-white">Top Free Apps</h2>
               <div className="grid grid-cols-3 gap-6">
                  {allApps.map(app => (
                     <div 
                        key={app.id}
                        className="bg-white dark:bg-[#2b2b2b] p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 group"
                        onClick={() => setSelectedAppId(app.id)}
                     >
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                           <app.icon size={32} className="text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="font-semibold dark:text-white truncate">{app.title}</h3>
                           <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{app.category || 'App'}</div>
                           <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Star size={10} fill="currentColor" className="text-yellow-500" />
                              {app.rating || '4.5'}
                           </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            {system.installedApps.includes(app.id) ? (
                               <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-600 dark:text-gray-300">Owned</span>
                            ) : (
                               <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium">Free</span>
                            )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default AppStore;
