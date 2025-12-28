import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, X, Plus, Star, Download, MoreVertical, Globe } from 'lucide-react';
import { useOS } from '../../context/OSContext';

interface Tab {
  id: number;
  url: string;
  title: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
}

const Browser: React.FC = () => {
  const { addNotification } = useOS();
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, url: 'https://www.wikipedia.org', title: 'Wikipedia', history: ['https://www.wikipedia.org'], historyIndex: 0, isLoading: false }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [inputVal, setInputVal] = useState('https://www.wikipedia.org');
  const [showDownloads, setShowDownloads] = useState(false);
  const [downloads, setDownloads] = useState<{name: string, progress: number}[]>([]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const updateTab = (id: number, updates: Partial<Tab>) => {
     setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputVal;
    if (!target.startsWith('http')) target = 'https://' + target;
    
    // Simulate loading
    updateTab(activeTabId, { isLoading: true });
    setTimeout(() => {
       const newHistory = [...activeTab.history.slice(0, activeTab.historyIndex + 1), target];
       updateTab(activeTabId, { 
          url: target, 
          title: new URL(target).hostname, 
          isLoading: false,
          history: newHistory,
          historyIndex: newHistory.length - 1
       });
    }, 1000);
  };

  const handleNewTab = () => {
     const newId = Date.now();
     setTabs(prev => [...prev, { id: newId, url: 'https://www.google.com', title: 'New Tab', history: ['https://www.google.com'], historyIndex: 0, isLoading: false }]);
     setActiveTabId(newId);
     setInputVal('https://www.google.com');
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
     e.stopPropagation();
     if (tabs.length === 1) return;
     const newTabs = tabs.filter(t => t.id !== id);
     setTabs(newTabs);
     if (activeTabId === id) setActiveTabId(newTabs[0].id);
  };

  const startDownload = () => {
     addNotification('Browser', 'Starting download: sample-file.zip', 'info');
     setDownloads(prev => [...prev, { name: 'sample-file.zip', progress: 0 }]);
     setShowDownloads(true);
     
     let progress = 0;
     const interval = setInterval(() => {
        progress += 10;
        setDownloads(prev => prev.map(d => d.name === 'sample-file.zip' ? { ...d, progress } : d));
        if (progress >= 100) {
           clearInterval(interval);
           addNotification('Browser', 'Download complete: sample-file.zip', 'success');
        }
     }, 500);
  };

  const handleBack = () => {
     if (activeTab.historyIndex > 0) {
        const newIndex = activeTab.historyIndex - 1;
        const prevUrl = activeTab.history[newIndex];
        updateTab(activeTabId, { url: prevUrl, historyIndex: newIndex, title: new URL(prevUrl).hostname });
        setInputVal(prevUrl);
     }
  };

  return (
    <div className="flex flex-col h-full bg-[#f7f7f7] dark:bg-gray-800">
      {/* Chrome (Top Bar) */}
      <div className="flex flex-col border-b border-gray-300 dark:border-gray-700">
         {/* Tabs */}
         <div className="flex px-2 pt-2 gap-1 overflow-x-auto bg-[#dee1e6] dark:bg-gray-900">
            {tabs.map(tab => (
               <div 
                  key={tab.id}
                  className={`w-48 max-w-[200px] h-9 rounded-t-lg flex justify-between items-center px-3 text-xs border-t border-x relative -bottom-px cursor-pointer group select-none ${activeTabId === tab.id ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm z-10' : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-white/10'}`}
                  onClick={() => { setActiveTabId(tab.id); setInputVal(tab.url); }}
               >
                  <div className="flex items-center gap-2 truncate flex-1">
                     {tab.isLoading ? <RotateCw size={12} className="animate-spin text-blue-500" /> : <Globe size={12} className="text-gray-500" />}
                     <span className={`truncate ${activeTabId === tab.id ? 'text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>{tab.title}</span>
                  </div>
                  <X size={12} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/20 rounded-full p-0.5" onClick={(e) => closeTab(tab.id, e)} />
               </div>
            ))}
            <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full" onClick={handleNewTab}>
               <Plus size={14} className="text-gray-600 dark:text-gray-400" />
            </button>
         </div>
         
         {/* Toolbar */}
         <div className="flex items-center p-2 gap-2 bg-white dark:bg-gray-800 shadow-sm z-20">
            <div className="flex gap-1 text-gray-600 dark:text-gray-400">
               <button disabled={activeTab.historyIndex === 0} onClick={handleBack} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full disabled:opacity-30">
                  <ArrowLeft size={16} />
               </button>
               <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full disabled:opacity-30">
                  <ArrowRight size={16} />
               </button>
               <button onClick={() => updateTab(activeTabId, { isLoading: true })} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                  <RotateCw size={16} className={activeTab.isLoading ? 'animate-spin' : ''} />
               </button>
            </div>
            
            <form onSubmit={handleNavigate} className="flex-1 relative">
               <input 
                 className="w-full bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1.5 pl-8 text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:text-white transition-shadow"
                 value={inputVal}
                 onChange={(e) => setInputVal(e.target.value)}
                 onFocus={(e) => e.target.select()}
               />
               <div className="absolute left-3 top-2 text-gray-400">
                  {activeTab.url.startsWith('https') ? <div className="text-green-600"><LockIcon size={12} /></div> : <Globe size={12} />}
               </div>
               <div className="absolute right-2 top-1.5 text-gray-400 hover:text-yellow-500 cursor-pointer">
                  <Star size={16} />
               </div>
            </form>

            <div className="flex gap-1 relative">
               <button 
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full relative"
                  onClick={() => setShowDownloads(!showDownloads)}
               >
                  <Download size={18} className="text-gray-600 dark:text-gray-400" />
                  {downloads.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>}
               </button>
               
               <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full" onClick={startDownload}>
                  <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
               </button>

               {/* Downloads Popover */}
               {showDownloads && (
                  <div className="absolute top-10 right-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                     <div className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Downloads</div>
                     {downloads.length === 0 ? (
                        <div className="text-sm text-gray-500">No recent downloads</div>
                     ) : (
                        <div className="space-y-3">
                           {downloads.map((d, i) => (
                              <div key={i} className="text-sm">
                                 <div className="truncate mb-1 dark:text-gray-300">{d.name}</div>
                                 <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${d.progress}%` }}></div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex gap-4 px-4 py-1.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
         <div className="cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
            <img src={`https://www.google.com/s2/favicons?domain=youtube.com`} className="w-3 h-3" alt="" /> YouTube
         </div>
         <div className="cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
             <img src={`https://www.google.com/s2/favicons?domain=github.com`} className="w-3 h-3" alt="" /> GitHub
         </div>
         <div className="cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
             <img src={`https://www.google.com/s2/favicons?domain=news.google.com`} className="w-3 h-3" alt="" /> News
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white relative">
         <iframe 
            src={activeTab.url} 
            className="w-full h-full border-none"
            title="Browser"
            sandbox="allow-scripts allow-same-origin allow-forms"
         />
      </div>
    </div>
  );
};

const LockIcon = ({ size }: { size: number }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

export default Browser;
