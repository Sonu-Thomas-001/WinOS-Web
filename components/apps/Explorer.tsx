import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUp, HardDrive, File, Folder, Download, Image, Music, Video, FileText, Trash2, Archive, Eye, Copy, Move, RefreshCcw } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { FileNode, AppID } from '../../types';

const Explorer: React.FC = () => {
  const { fs, launchApp } = useOS();
  const [currentId, setCurrentId] = useState<string>('guest'); // Start at Guest home
  const [history, setHistory] = useState<string[]>(['guest']);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId: string | null } | null>(null);

  const isTrash = currentId === 'trash';
  const currentFolder = isTrash ? fs.getNode('trash') : fs.getNode(currentId);
  
  // If trash, get all trash items, else get contents of folder
  const contents = isTrash 
      ? fs.nodes.filter(n => n.isTrash) 
      : fs.getContents(currentId);
      
  const pathNodes = isTrash ? [{id: 'trash', name: 'Recycle Bin', type: 'folder' as const, createdAt: 0, parentId: null}] : fs.getPath(currentId);

  // Close context menu on click elsewhere
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleNavigate = (id: string) => {
     setHistory(prev => [...prev, id]);
     setCurrentId(id);
     setSelectedIds(new Set());
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
     if (isTrash) return; // Cannot open from trash

     if (node.type === 'folder') {
        handleNavigate(node.id);
     } else {
        if (node.extension === 'zip') {
            fs.extractNode(node.id);
            return;
        }
        // Simple file association
        if (node.name.endsWith('.txt')) {
           launchApp(AppID.NOTEPAD, { fileId: node.id, filename: node.name });
        } else {
           // Simulate generic open
           alert(`Opened ${node.name}`);
        }
     }
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
      e.dataTransfer.setData('nodeId', nodeId);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
      e.preventDefault();
      const nodeId = e.dataTransfer.getData('nodeId');
      if (nodeId && nodeId !== targetFolderId) {
          fs.moveNode(nodeId, targetFolderId);
      }
  };

  const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({ x: e.clientX, y: e.clientY, nodeId });
      setSelectedIds(new Set([nodeId]));
  };

  const sidebarItems = [
    { id: 'guest', icon: HardDrive, label: 'Home' },
    { id: 'desktop', icon: HardDrive, label: 'Desktop' },
    { id: 'docs', icon: File, label: 'Documents' },
    { id: 'downloads', icon: Download, label: 'Downloads' },
    { id: 'trash', icon: Trash2, label: 'Recycle Bin' }
  ];

  const formatSize = (bytes?: number) => {
      if (!bytes) return '--';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Context Menu Actions
  const activeNode = contextMenu?.nodeId ? fs.getNode(contextMenu.nodeId) : null;

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] dark:bg-[#191919] text-sm select-none">
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
           disabled={!currentFolder?.parentId && !isTrash}
         >
            <ArrowUp size={16} className="dark:text-white" />
         </button>
         
         <div className="flex-1 bg-[#f3f3f3] dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex items-center text-gray-600 dark:text-gray-300 truncate">
            <HardDrive size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate">{pathNodes.map(n => n.name).join(' > ')}</span>
         </div>

         {/* Toolbar Actions */}
         <div className="flex gap-1">
             <button 
               onClick={() => fs.createFolder(currentId, 'New Folder')} 
               disabled={isTrash}
               className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded disabled:opacity-30" 
               title="New Folder"
             >
                <Folder size={16} className="text-blue-500" />
             </button>
             {isTrash && (
                 <button 
                    onClick={fs.emptyTrash} 
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                    title="Empty Recycle Bin"
                 >
                    <Trash2 size={16} />
                 </button>
             )}
             <button 
               onClick={() => setShowPreview(!showPreview)} 
               className={`p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded ${showPreview ? 'bg-gray-200 dark:bg-white/10' : ''}`}
               title="Toggle Preview Pane"
             >
                <Eye size={16} className="dark:text-gray-300" />
             </button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-white dark:bg-[#191919] border-r border-gray-200 dark:border-gray-700 p-2 overflow-y-auto hidden sm:block">
           <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">Pinned</div>
           {sidebarItems.map((item, i) => {
             const targetId = item.id === 'trash' ? 'trash' : fs.nodes.find(n => n.name.toLowerCase() === item.label.toLowerCase() && n.parentId === 'guest')?.id || item.id;
             const active = currentId === targetId;

             return (
               <div 
                 key={i} 
                 className={`flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded cursor-pointer text-gray-700 dark:text-gray-200 ${active ? 'bg-gray-100 dark:bg-white/10' : ''}`}
                 onClick={() => handleNavigate(targetId)}
                 onDrop={(e) => handleDrop(e, targetId)}
                 onDragOver={(e) => e.preventDefault()}
               >
                  <item.icon size={16} className={item.id === 'trash' ? 'text-gray-500' : 'text-blue-500'} />
                  <span>{item.label}</span>
               </div>
             );
           })}
        </div>

        {/* Main Content Grid */}
        <div 
           className="flex-1 p-4 bg-white dark:bg-[#191919] overflow-y-auto"
           onContextMenu={(e) => { e.preventDefault(); /* Folder context menu could go here */ }}
        >
           {isTrash && contents.length > 0 && (
               <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 p-2 text-xs text-yellow-800 dark:text-yellow-200 rounded border border-yellow-200 dark:border-yellow-800">
                  Items in the Recycle Bin are deleted permanently after 30 days.
               </div>
           )}

           <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
              {contents.map((item) => (
                 <div 
                   key={item.id} 
                   className={`
                      flex flex-col items-center p-2 border rounded group cursor-default transition-all
                      ${selectedIds.has(item.id) ? 'bg-blue-50 border-blue-200 dark:bg-white/10 dark:border-white/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}
                   `}
                   onClick={(e) => { e.stopPropagation(); setSelectedIds(new Set([item.id])); }}
                   onDoubleClick={() => handleOpenItem(item)}
                   onContextMenu={(e) => handleContextMenu(e, item.id)}
                   draggable={!isTrash}
                   onDragStart={(e) => handleDragStart(e, item.id)}
                   onDrop={(e) => item.type === 'folder' && handleDrop(e, item.id)}
                   onDragOver={(e) => item.type === 'folder' && e.preventDefault()}
                 >
                    {item.type === 'folder' ? (
                       <Folder size={48} className="text-yellow-500" strokeWidth={1.5} fill="#fbbf24" fillOpacity={0.2} />
                    ) : item.extension === 'zip' ? (
                        <Archive size={48} className="text-yellow-600" />
                    ) : item.extension === 'jpg' ? (
                        <Image size={48} className="text-purple-500" />
                    ) : (
                       <FileText size={48} className="text-gray-400" strokeWidth={1} />
                    )}
                    <span className="mt-2 text-center text-xs text-gray-700 dark:text-gray-300 truncate w-full px-1 select-text">{item.name}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* Preview Pane */}
        {showPreview && selectedIds.size === 1 && (
           <div className="w-64 bg-gray-50 dark:bg-[#202020] border-l border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center text-center">
               {(() => {
                   const item = fs.getNode(Array.from(selectedIds)[0]);
                   if (!item) return null;
                   return (
                       <>
                          <div className="w-24 h-24 flex items-center justify-center bg-white dark:bg-white/5 rounded shadow-sm mb-4">
                             {item.type === 'folder' ? <Folder size={48} className="text-yellow-500" /> : <FileText size={48} className="text-gray-400" />}
                          </div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100 break-all mb-2">{item.name}</h3>
                          
                          <div className="w-full text-left space-y-2 mt-4">
                             <div className="flex justify-between text-xs border-b pb-1 dark:border-gray-600">
                                <span className="text-gray-500">Type</span>
                                <span className="text-gray-800 dark:text-gray-300">{item.type === 'folder' ? 'File folder' : `${item.extension?.toUpperCase()} File`}</span>
                             </div>
                             <div className="flex justify-between text-xs border-b pb-1 dark:border-gray-600">
                                <span className="text-gray-500">Size</span>
                                <span className="text-gray-800 dark:text-gray-300">{formatSize(item.size)}</span>
                             </div>
                             <div className="flex justify-between text-xs border-b pb-1 dark:border-gray-600">
                                <span className="text-gray-500">Created</span>
                                <span className="text-gray-800 dark:text-gray-300">{new Date(item.createdAt).toLocaleDateString()}</span>
                             </div>
                          </div>
                       </>
                   );
               })()}
           </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
         <div 
            className="fixed bg-white dark:bg-[#2d2d2d] shadow-xl border border-gray-200 dark:border-gray-600 rounded py-1 z-50 w-48 text-sm animate-fade-in"
            style={{ top: contextMenu.y, left: contextMenu.x }}
         >
             {!isTrash && (
                 <>
                    <button onClick={() => { handleOpenItem(activeNode!); setContextMenu(null); }} className="w-full text-left px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white">Open</button>
                    {activeNode?.type === 'folder' && (
                        <button onClick={() => { fs.zipNode(activeNode.id); setContextMenu(null); }} className="w-full text-left px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white flex items-center gap-2"><Archive size={14}/> Compress to ZIP</button>
                    )}
                    {activeNode?.extension === 'zip' && (
                        <button onClick={() => { fs.extractNode(activeNode.id); setContextMenu(null); }} className="w-full text-left px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white">Extract All...</button>
                    )}
                    <button onClick={() => { fs.copyNode(activeNode!.id, currentId); setContextMenu(null); }} className="w-full text-left px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white flex items-center gap-2"><Copy size={14}/> Copy</button>
                    <div className="h-px bg-gray-200 dark:bg-gray-600 my-1"></div>
                    <button onClick={() => { 
                        const newName = prompt('Rename:', activeNode?.name); 
                        if(newName) fs.renameNode(activeNode!.id, newName); 
                        setContextMenu(null); 
                    }} className="w-full text-left px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white">Rename</button>
                    <button onClick={() => { fs.deleteNode(activeNode!.id); setContextMenu(null); }} className="w-full text-left px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 text-red-600 flex items-center gap-2"><Trash2 size={14}/> Delete</button>
                 </>
             )}
             {isTrash && (
                 <>
                    <button onClick={() => { fs.restoreNode(activeNode!.id); setContextMenu(null); }} className="w-full text-left px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-white flex items-center gap-2"><RefreshCcw size={14}/> Restore</button>
                    <button onClick={() => { fs.deleteNode(activeNode!.id, true); setContextMenu(null); }} className="w-full text-left px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 text-red-600 flex items-center gap-2"><Trash2 size={14}/> Delete Permanently</button>
                 </>
             )}
         </div>
      )}
      
      {/* Footer */}
      <div className="h-6 bg-white dark:bg-[#202020] border-t border-gray-200 dark:border-gray-700 flex items-center px-4 text-xs text-gray-500 justify-between">
         <span>{contents.length} items</span>
         <span>{selectedIds.size > 0 ? `${selectedIds.size} item selected` : ''}</span>
      </div>
    </div>
  );
};

export default Explorer;
