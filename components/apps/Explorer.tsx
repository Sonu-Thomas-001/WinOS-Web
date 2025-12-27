import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUp, HardDrive, File, Folder, Download, Image, Music, Video, FileText } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { FileNode, AppID } from '../../types';

const Explorer: React.FC = () => {
  const { fs, launchApp } = useOS();
  const [currentId, setCurrentId] = useState<string>('guest'); // Start at Guest home
  const [history, setHistory] = useState<string[]>(['guest']);
  
  const currentFolder = fs.getNode(currentId);
  const contents = fs.getContents(currentId);
  const pathNodes = fs.getPath(currentId);

  const handleNavigate = (id: string) => {
     setHistory(prev => [...prev, id]);
     setCurrentId(id);
  };

  const handleBack = () => {
    if (history.length > 1) {
       const newHistory = [...history];
       newHistory.pop();
       setCurrentId(newHistory[newHistory.length - 1]);
       setHistory(newHistory);
    }
  };

  const handleUp = () => {
     if (currentFolder && currentFolder.parentId) {
        handleNavigate(currentFolder.parentId);
     }
  };

  const handleOpenItem = (node: FileNode) => {
     if (node.type === 'folder') {
        handleNavigate(node.id);
     } else {
        // Simple file association
        if (node.name.endsWith('.txt')) {
           launchApp(AppID.NOTEPAD, { fileId: node.id, filename: node.name });
        } else {
           alert(`Cannot open ${node.name}`);
        }
     }
  };

  const sidebarItems = [
    { id: 'guest', icon: HardDrive, label: 'Home' },
    { id: 'desktop', icon: HardDrive, label: 'Desktop' },
    { id: 'docs', icon: File, label: 'Documents' },
    { id: 'downloads', icon: Download, label: 'Downloads' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] dark:bg-[#191919] text-sm">
      {/* Top Bar */}
      <div className="bg-white dark:bg-[#202020] p-2 border-b border-gray-200 dark:border-gray-700 flex gap-2 items-center">
         <button 
           className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded disabled:opacity-30" 
           onClick={handleBack}
           disabled={history.length <= 1}
         >
           <ArrowLeft size={16} className="dark:text-white" />
         </button>
         <button 
           className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded disabled:opacity-30" 
           onClick={handleUp}
           disabled={!currentFolder?.parentId}
         >
            <ArrowUp size={16} className="dark:text-white" />
         </button>
         
         <div className="flex-1 bg-[#f3f3f3] dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex items-center text-gray-600 dark:text-gray-300 truncate">
            <HardDrive size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate">{pathNodes.map(n => n.name).join(' > ')}</span>
         </div>

         <div className="w-48 bg-[#f3f3f3] dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-500">
            Search
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-white dark:bg-[#191919] border-r border-gray-200 dark:border-gray-700 p-2 overflow-y-auto hidden sm:block">
           <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">Pinned</div>
           {sidebarItems.map((item, i) => {
             // Find actual ID for navigation
             // In real app, sidebar items would be resolved more robustly
             const targetNode = fs.nodes.find(n => n.name.toLowerCase() === item.label.toLowerCase() && n.parentId === 'guest') || fs.getNode(item.id);

             return (
               <div 
                 key={i} 
                 className={`flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded cursor-pointer text-gray-700 dark:text-gray-200 ${currentId === targetNode?.id ? 'bg-gray-100 dark:bg-white/10' : ''}`}
                 onClick={() => targetNode && handleNavigate(targetNode.id)}
               >
                  <item.icon size={16} className="text-blue-500" />
                  <span>{item.label}</span>
               </div>
             );
           })}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 bg-white dark:bg-[#191919] overflow-y-auto">
           <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
              {contents.map((item) => (
                 <div 
                   key={item.id} 
                   className="flex flex-col items-center p-2 hover:bg-blue-50 dark:hover:bg-white/5 border border-transparent hover:border-blue-100 dark:hover:border-white/10 rounded group cursor-default"
                   onDoubleClick={() => handleOpenItem(item)}
                 >
                    {item.type === 'folder' ? (
                       <Folder size={48} className="text-yellow-500" strokeWidth={1.5} fill="#fbbf24" fillOpacity={0.2} />
                    ) : (
                       <FileText size={48} className="text-gray-400" strokeWidth={1} />
                    )}
                    <span className="mt-2 text-center text-xs text-gray-700 dark:text-gray-300 group-hover:underline truncate w-full px-1">{item.name}</span>
                 </div>
              ))}
              
              {contents.length === 0 && (
                 <div className="col-span-full text-center text-gray-400 mt-10">
                    This folder is empty.
                 </div>
              )}
           </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-white dark:bg-[#202020] border-t border-gray-200 dark:border-gray-700 flex items-center px-4 text-xs text-gray-500">
         {contents.length} items
      </div>
    </div>
  );
};

export default Explorer;