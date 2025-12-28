import React, { useRef, useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS } from '../../constants';
import { AppID, BootMode } from '../../types';
import WindowFrame from './WindowFrame';
import Widgets from './Widgets';
import AIAssistant from './AIAssistant';
import NotificationCenter from './NotificationCenter';
import { Folder, FileText, X } from 'lucide-react';

const Desktop: React.FC = () => {
  const { windows, launchApp, toggleStartMenu, system, currentUser, fs, notifications, clearNotification } = useOS();
  const desktopRef = useRef<HTMLDivElement>(null);
  
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, show: boolean }>({ x: 0, y: 0, show: false });

  // Get Desktop Files
  const desktopContent = fs.getContents(fs.desktopId);

  // Filter for unread toasts (show last 3 within 5 seconds)
  const [activeToasts, setActiveToasts] = useState<typeof notifications>([]);
  
  // Logic to show toasts temporarily
  useEffect(() => {
     if (notifications.length > 0) {
        // Simple logic: show the newest notification for 5 seconds if not DND
        const latest = notifications[0];
        if (!system.doNotDisturb && Date.now() - latest.timestamp < 1000) {
             setActiveToasts(prev => [latest, ...prev].slice(0, 3));
             setTimeout(() => {
                setActiveToasts(prev => prev.filter(n => n.id !== latest.id));
             }, 5000);
        }
     }
  }, [notifications, system.doNotDisturb]);


  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, show: true });
  };

  const handleClick = (e: React.MouseEvent) => {
     if (contextMenu.show) setContextMenu({ ...contextMenu, show: false });
     if (system.isStartMenuOpen) toggleStartMenu();
  };

  // Static icons
  const staticIcons = [
    { appId: AppID.EXPLORER, label: 'This PC', icon: APPS[AppID.EXPLORER].icon },
    { appId: AppID.CALCULATOR, label: 'Recycle Bin', icon: APPS[AppID.CALCULATOR].icon },
  ];

  const isSafeMode = system.bootMode === BootMode.SAFE_MODE;
  const wallpaper = isSafeMode ? 'none' : `url(${currentUser?.settings.wallpaper})`;
  const bgColor = isSafeMode ? '#000000' : 'transparent';

  return (
    <div 
      ref={desktopRef}
      className="fixed inset-0 z-0 bg-cover bg-center overflow-hidden transition-all duration-500"
      style={{ backgroundImage: wallpaper, backgroundColor: bgColor }}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      {/* Safe Mode Watermarks */}
      {isSafeMode && (
        <div className="absolute top-2 right-2 text-white font-bold opacity-80 pointer-events-none">Safe Mode</div>
      )}

      {/* Widgets & Overlays Layer */}
      <Widgets />
      <AIAssistant />
      <NotificationCenter />

      {/* Desktop Grid Icons */}
      <div className="flex flex-col flex-wrap content-start h-[calc(100vh-48px)] p-2 gap-2 w-fit relative z-0">
        {/* Static Icons */}
        {staticIcons.map((item, index) => (
             <div 
               key={`static-${index}`}
               className="w-24 h-24 flex flex-col items-center justify-center rounded hover:bg-white/10 border border-transparent hover:border-white/20 cursor-default transition-all group active:bg-white/20"
               onDoubleClick={() => launchApp(item.appId)}
             >
                <item.icon size={40} className="text-blue-200 drop-shadow-md mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-white text-xs text-center drop-shadow-md line-clamp-2 px-1 font-medium text-shadow">{item.label}</span>
             </div>
        ))}

        {/* Dynamic VFS Icons */}
        {desktopContent.map((node) => (
            <div 
               key={node.id}
               className="w-24 h-24 flex flex-col items-center justify-center rounded hover:bg-white/10 border border-transparent hover:border-white/20 cursor-default transition-all group active:bg-white/20"
               onDoubleClick={() => {
                  if (node.type === 'folder') {
                      launchApp(AppID.EXPLORER); 
                  } else {
                      launchApp(AppID.NOTEPAD, { fileId: node.id, filename: node.name });
                  }
               }}
             >
                {node.type === 'folder' ? (
                   <Folder size={40} className="text-yellow-400 drop-shadow-md mb-2 group-hover:scale-105 transition-transform" fill="#fbbf24" fillOpacity={0.8} />
                ) : (
                   <FileText size={40} className="text-gray-100 drop-shadow-md mb-2 group-hover:scale-105 transition-transform" />
                )}
                <span className="text-white text-xs text-center drop-shadow-md line-clamp-2 px-1 font-medium text-shadow">{node.name}</span>
             </div>
        ))}
      </div>

      {/* Windows Layer */}
      {windows
        .filter(win => win.desktopIndex === system.currentDesktopIndex)
        .map((win) => {
          const AppComp = APPS[win.appId].component;
          return (
            <WindowFrame key={win.id} windowState={win}>
               {AppComp}
            </WindowFrame>
          );
      })}

      {/* Toast Notifications Layer */}
      <div className="absolute bottom-14 right-4 z-[10000] flex flex-col gap-2 items-end pointer-events-none">
         {activeToasts.map(toast => (
            <div 
               key={toast.id} 
               className="w-80 bg-white dark:bg-[#2b2b2b] rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-4 animate-slide-up pointer-events-auto relative"
            >
                <button 
                  onClick={() => setActiveToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                   <X size={14} />
                </button>
                <div className="flex gap-3">
                   {/* Icon based on app or type */}
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-green-100 text-green-600' : toast.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {APPS[toast.appId as AppID]?.icon ? React.createElement(APPS[toast.appId as AppID].icon, { size: 20 }) : <span className="text-xs font-bold">SYS</span>}
                   </div>
                   <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{toast.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{toast.message}</p>
                   </div>
                </div>
            </div>
         ))}
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div 
          className="absolute bg-white/90 dark:bg-[#2d2d2d]/95 backdrop-blur shadow-xl rounded-md w-48 py-1 z-[9999] border border-gray-200 dark:border-gray-700 animate-fade-in"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
           <ContextMenuItem label="View" />
           <ContextMenuItem label="Sort by" />
           <ContextMenuItem label="Refresh" onClick={() => window.location.reload()} />
           <div className="h-px bg-gray-300 dark:bg-gray-600 my-1 mx-2"></div>
           <ContextMenuItem label="New Folder" onClick={() => fs.createFolder(fs.desktopId, 'New Folder')} />
           <ContextMenuItem label="New Text Document" onClick={() => fs.createFile(fs.desktopId, 'New Text Document.txt')} />
           <div className="h-px bg-gray-300 dark:bg-gray-600 my-1 mx-2"></div>
           <ContextMenuItem label="Display settings" onClick={() => launchApp(AppID.SETTINGS)} />
           <ContextMenuItem label="Personalize" onClick={() => launchApp(AppID.SETTINGS)} />
        </div>
      )}
    </div>
  );
};

const ContextMenuItem: React.FC<{ label: string, onClick?: () => void, hasSubmenu?: boolean }> = ({ label, onClick, hasSubmenu }) => (
  <button 
    className="w-full text-left px-4 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white transition-colors flex justify-between items-center"
    onClick={onClick}
  >
    {label}
    {hasSubmenu && <span className="text-xs">▶</span>}
  </button>
);

export default Desktop;
