import React, { useRef, useState } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS } from '../../constants';
import { AppID, BootMode } from '../../types';
import WindowFrame from './WindowFrame';
import { Folder, FileText } from 'lucide-react';

const Desktop: React.FC = () => {
  const { windows, launchApp, toggleStartMenu, system, currentUser, fs } = useOS();
  const desktopRef = useRef<HTMLDivElement>(null);
  
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, show: boolean }>({ x: 0, y: 0, show: false });

  // Get Desktop Files
  const desktopContent = fs.getContents(fs.desktopId);

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
    { appId: AppID.CALCULATOR, label: 'Recycle Bin', icon: APPS[AppID.CALCULATOR].icon }, // Using calc as generic icon for now
  ];

  const isSafeMode = system.bootMode === BootMode.SAFE_MODE;
  const wallpaper = isSafeMode ? 'none' : `url(${currentUser?.settings.wallpaper})`;
  const bgColor = isSafeMode ? '#000000' : 'transparent';

  return (
    <div 
      ref={desktopRef}
      className="fixed inset-0 z-0 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: wallpaper, backgroundColor: bgColor }}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      {/* Safe Mode Watermarks */}
      {isSafeMode && (
        <div className="absolute top-2 right-2 text-white font-bold opacity-80 pointer-events-none">Safe Mode</div>
      )}

      {/* Desktop Grid Icons */}
      <div className="flex flex-col flex-wrap content-start h-[calc(100vh-48px)] p-2 gap-2 w-fit">
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
                      // We don't have navigate-to-folder param on explorer yet, just launch explorer
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
      {windows.map((win) => {
        const AppComp = APPS[win.appId].component;
        return (
          <WindowFrame key={win.id} windowState={win}>
             {AppComp}
          </WindowFrame>
        );
      })}

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
           <ContextMenuItem label="Display settings" />
           <ContextMenuItem label="Personalize" />
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
