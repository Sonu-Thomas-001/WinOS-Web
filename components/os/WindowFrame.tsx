import React, { useRef, useEffect, useState } from 'react';
import { Minus, Square, X, Maximize2, AlertTriangle, LayoutTemplate, RotateCw, Pin, PictureInPicture2 } from 'lucide-react';
import { WindowState } from '../../types';
import { useOS } from '../../context/OSContext';
import { APPS } from '../../constants';

interface Props {
  windowState: WindowState;
  children: React.ReactNode;
}

const WindowFrame: React.FC<Props> = ({ windowState, children }) => {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, snapWindow, updateWindowPosition, updateWindowSize, relaunchApp, toggleAlwaysOnTop, togglePiP } = useOS();
  const { id, appId, title, isMaximized, position, size, zIndex, isMinimized, isCrashed, isAlwaysOnTop, isPiP } = windowState;
  const appConfig = APPS[appId];

  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  
  const [showSnapMenu, setShowSnapMenu] = useState(false);
  const snapMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mouse Down for Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized && !isPiP) return; // Prevent drag if maximized unless PiP (PiP shouldn't be maximized anyway)
    
    const target = e.target as HTMLElement;
    if (target.closest('.window-controls')) return;

    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    focusWindow(id);
  };

  // Resize Handling
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    focusWindow(id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        if (newY < 0) newY = 0; 
        updateWindowPosition(id, newX, newY);
      }

      if (isResizing && windowRef.current) {
         const rect = windowRef.current.getBoundingClientRect();
         const minWidth = isPiP ? 200 : 300;
         const minHeight = isPiP ? 120 : 200;
         let newWidth = size.width;
         let newHeight = size.height;

         if (resizeDirection?.includes('e')) newWidth = Math.max(minWidth, e.clientX - rect.left);
         if (resizeDirection?.includes('s')) newHeight = Math.max(minHeight, e.clientY - rect.top);

         updateWindowSize(id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, id, updateWindowPosition, updateWindowSize, size, resizeDirection, isPiP]);

  if (isMinimized) return null;

  // Calculate Z-Index: If always on top, boost by 1000
  const effectiveZIndex = zIndex + (isAlwaysOnTop ? 1000 : 0);

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-75 
        ${isDragging ? 'opacity-90' : 'opacity-100'} 
        ${isCrashed ? 'grayscale pointer-events-none' : ''}
        ${isPiP ? 'border-2 border-blue-500 shadow-[0_0_20px_rgba(0,0,0,0.3)]' : ''}
      `}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: effectiveZIndex,
        transform: isMaximized ? 'none' : 'translate(0,0)',
        borderRadius: isMaximized ? 0 : '0.5rem',
      }}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div 
        className={`h-9 bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-2 select-none 
           ${isCrashed ? 'bg-red-100 dark:bg-red-900/30' : ''}
           ${isPiP ? 'h-6' : ''} 
        `}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => !isPiP && maximizeWindow(id)}
      >
        <div className="flex items-center gap-2">
          {!isPiP && (
            isCrashed ? <AlertTriangle size={16} className="text-red-500" /> : <appConfig.icon size={16} className="text-blue-500" />
          )}
          <span className={`font-medium text-gray-700 dark:text-gray-200 ${isPiP ? 'text-[10px]' : 'text-xs'}`}>
             {title} {isCrashed ? '(Not Responding)' : ''}
          </span>
        </div>
        
        <div className="window-controls flex items-center h-full relative pointer-events-auto">
          {/* Extra Window Tools (Pin, PiP) */}
          {!isPiP && (
             <button 
               onClick={(e) => { e.stopPropagation(); toggleAlwaysOnTop(id); }} 
               className={`w-8 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 ${isAlwaysOnTop ? 'text-blue-500' : 'text-gray-400'}`}
               title="Always On Top"
             >
               <Pin size={12} className={isAlwaysOnTop ? 'fill-current' : ''} />
             </button>
          )}

          <button 
             onClick={(e) => { e.stopPropagation(); togglePiP(id); }} 
             className={`w-8 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 ${isPiP ? 'text-blue-500' : 'text-gray-400'}`}
             title="Picture-in-Picture"
          >
             <PictureInPicture2 size={12} />
          </button>

          {!isPiP && (
            <>
               <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} className="w-8 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300">
                 <Minus size={14} />
               </button>
               
               <div 
                  className="relative h-full"
                  onMouseEnter={() => {
                     if (snapMenuTimeout.current) clearTimeout(snapMenuTimeout.current);
                     setShowSnapMenu(true);
                  }}
                  onMouseLeave={() => {
                     snapMenuTimeout.current = setTimeout(() => setShowSnapMenu(false), 500);
                  }}
               >
                 <button 
                     onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }} 
                     className="w-8 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
                 >
                     {isMaximized ? <Maximize2 size={12} /> : <Square size={12} />}
                 </button>
     
                 {/* Snap Layouts Popup */}
                 {showSnapMenu && (
                    <div className="absolute top-full right-0 mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-xl border border-gray-300 dark:border-gray-600 z-[100] w-32 flex gap-2 animate-fade-in">
                        <div 
                           className="flex-1 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded flex cursor-pointer hover:bg-blue-100"
                           onClick={(e) => { e.stopPropagation(); snapWindow(id, 'left'); setShowSnapMenu(false); }}
                           title="Snap Left"
                        >
                           <div className="w-1/2 h-full bg-blue-500/50 rounded-l"></div>
                        </div>
                        <div 
                           className="flex-1 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded flex cursor-pointer hover:bg-blue-100"
                           onClick={(e) => { e.stopPropagation(); snapWindow(id, 'right'); setShowSnapMenu(false); }}
                           title="Snap Right"
                        >
                            <div className="w-1/2 h-full ml-auto bg-blue-500/50 rounded-r"></div>
                        </div>
                    </div>
                 )}
               </div>
            </>
          )}

          <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }} className="w-8 h-full flex items-center justify-center hover:bg-red-500 hover:text-white text-gray-600 dark:text-gray-300 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-slate-800 relative">
        {(isDragging || isResizing) && <div className="absolute inset-0 z-50 bg-transparent" />}
        {children}
        
        {/* Crashed Overlay */}
        {isCrashed && (
           <div className="absolute inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center z-[999] pointer-events-auto backdrop-blur-sm">
               <div className="bg-white dark:bg-[#2b2b2b] p-6 shadow-2xl border border-gray-200 dark:border-gray-600 rounded-lg text-center max-w-sm w-full animate-fade-in">
                  <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title} is not responding</h3>
                  <div className="flex flex-col gap-2 mt-4">
                     <button 
                       onClick={() => relaunchApp(id)}
                       className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2 transition-colors"
                     >
                        <RotateCw size={16} /> Restart
                     </button>
                     <button 
                       onClick={() => closeWindow(id)}
                       className="w-full py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded transition-colors"
                     >
                        Close
                     </button>
                  </div>
               </div>
           </div>
        )}
      </div>

      {/* Resize Handles */}
      {(!isMaximized && !isCrashed) && (
        <>
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'se')} />
          {!isPiP && (
             <>
               <div className="absolute right-0 top-0 bottom-0 w-1 cursor-e-resize z-40" onMouseDown={(e) => handleResizeStart(e, 'e')} />
               <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize z-40" onMouseDown={(e) => handleResizeStart(e, 's')} />
             </>
          )}
        </>
      )}
    </div>
  );
};

export default WindowFrame;
