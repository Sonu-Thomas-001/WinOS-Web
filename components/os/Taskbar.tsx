import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { APPS } from '../../constants';
import { AppID } from '../../types';
import { Wifi, Volume2, Battery, ChevronUp, Search, Power, LayoutPanelLeft, AppWindow, Sparkles, Shield } from 'lucide-react';
import StartMenu from './StartMenu';
import QuickSettings from './QuickSettings';

const Taskbar: React.FC = () => {
  const { windows, activeWindowId, launchApp, focusWindow, minimizeWindow, toggleStartMenu, system, toggleCalendar, toggleWidgets, switchDesktop, addDesktop, toggleCopilot, toggleQuickSettings } = useOS();
  const [time, setTime] = useState(new Date());
  const [showTaskView, setShowTaskView] = useState(false);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Combine pinned apps + open unpinned apps
  const pinnedApps = [AppID.EXPLORER, AppID.BROWSER, AppID.NOTEPAD, AppID.TERMINAL, AppID.VSCODE, AppID.SETTINGS];
  
  const taskbarAppIds = Array.from(new Set([
    ...pinnedApps,
    ...windows.filter(w => w.desktopIndex === system.currentDesktopIndex).map(w => w.appId)
  ]));

  return (
    <>
      {/* Start Menu Popup */}
      {system.isStartMenuOpen && (
         <div className="absolute bottom-12 left-2 z-[9999]">
           <StartMenu />
         </div>
      )}

      {/* Quick Settings Popup */}
      <QuickSettings />

      {/* Task View / Desktop Switcher Overlay */}
      {showTaskView && (
         <div className="fixed bottom-14 left-0 right-0 h-32 bg-[#f3f3f3]/90 dark:bg-[#202020]/90 backdrop-blur-xl border-t border-white/20 z-[9999] flex items-center justify-center gap-4 animate-fade-in">
             {system.desktops.map((name, idx) => (
                <div 
                   key={idx}
                   className={`w-48 h-24 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105 relative group bg-white dark:bg-[#2b2b2b] shadow-lg ${system.currentDesktopIndex === idx ? 'border-blue-500' : 'border-transparent hover:border-gray-400'}`}
                   onClick={() => { switchDesktop(idx); setShowTaskView(false); }}
                >
                   <span className="font-medium text-gray-700 dark:text-gray-200">{name}</span>
                </div>
             ))}
             <div 
                className="w-16 h-24 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-gray-300 text-gray-500"
                onClick={addDesktop}
             >
                +
             </div>
         </div>
      )}

      {/* Main Taskbar */}
      <div className="fixed bottom-0 w-full h-12 bg-white/80 dark:bg-[#202020]/85 backdrop-blur-xl border-t border-white/20 dark:border-white/5 flex justify-between items-center px-2 z-[9999] select-none">
        
        {/* Left: Widgets (Windows 11 style) */}
        <div className="flex items-center">
            <button 
              className={`p-2 rounded hover:bg-white/50 dark:hover:bg-white/10 transition-all ${system.isWidgetsOpen ? 'bg-white/50 dark:bg-white/10' : ''}`}
              onClick={toggleWidgets}
              title="Widgets"
            >
               <LayoutPanelLeft size={20} className="text-blue-600 dark:text-blue-400" />
            </button>
        </div>

        {/* Center: Start, Task View, Apps */}
        <div className="flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
          <button 
            onClick={toggleStartMenu}
            className={`p-2 rounded hover:bg-white/50 dark:hover:bg-white/10 transition-all ${system.isStartMenuOpen ? 'bg-white/50 dark:bg-white/10' : ''}`}
            title="Start"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path fill="#00a4ef" d="M0 3.44L9.36 2.14v9.64H0z" />
              <path fill="#ffb900" d="M10.63 2.15L24 0v11.77h-13.37z" />
              <path fill="#f25022" d="M0 12.87h9.36v9.75L0 21.28z" />
              <path fill="#7fba00" d="M10.63 12.87H24v10.99l-13.37-1.85z" />
            </svg>
          </button>
          
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-white/5 rounded-full px-3 py-1 mx-1 border border-gray-300 dark:border-gray-600/50">
             <Search size={14} className="text-gray-500 dark:text-gray-300 mr-2" />
             <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none outline-none text-xs w-24 text-gray-700 dark:text-gray-200"
                onFocus={toggleStartMenu}
             />
          </div>

          <button 
            className={`p-2 rounded hover:bg-white/50 dark:hover:bg-white/10 transition-all ${showTaskView ? 'bg-white/50 dark:bg-white/10' : ''}`}
            onClick={() => setShowTaskView(!showTaskView)}
            title="Task View"
          >
             <AppWindow size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

          {taskbarAppIds.map(appId => {
            const config = APPS[appId];
            const appWindows = windows.filter(w => w.appId === appId && w.desktopIndex === system.currentDesktopIndex);
            const isOpen = appWindows.length > 0;
            const isActive = appWindows.some(w => w.id === activeWindowId);
            const isMinimized = appWindows.every(w => w.isMinimized);

            return (
              <button
                key={appId}
                className={`
                  relative w-10 h-10 flex items-center justify-center rounded hover:bg-white/50 dark:hover:bg-white/10 transition-all group
                  ${isActive ? 'bg-white/40 dark:bg-white/10' : ''}
                `}
                onClick={() => {
                  if (isOpen) {
                    if (isActive && !isMinimized) {
                       const lastWin = appWindows[appWindows.length - 1];
                       minimizeWindow(lastWin.id);
                    } else {
                       const winToFocus = appWindows[appWindows.length - 1];
                       if (winToFocus.isMinimized) focusWindow(winToFocus.id);
                       else focusWindow(winToFocus.id);
                    }
                  } else {
                    launchApp(appId);
                  }
                }}
              >
                <config.icon 
                  size={24} 
                  className={isOpen ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'} 
                />
                
                {isOpen && (
                  <div className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full transition-all ${isActive && !isMinimized ? 'w-4 bg-blue-500' : 'bg-gray-400'}`}></div>
                )}

                <div className="absolute bottom-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-[10000]">
                   {config.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-2 h-full">
           {/* Copilot Button */}
           <button 
             className={`p-2 rounded hover:bg-white/50 dark:hover:bg-white/10 transition-all ${system.isCopilotOpen ? 'bg-white/50 dark:bg-white/10' : ''}`}
             onClick={toggleCopilot}
             title="Copilot"
           >
              <Sparkles size={18} className="text-blue-500" />
           </button>

           <div className="flex items-center gap-1 hover:bg-white/50 dark:hover:bg-white/10 p-1 rounded px-2 cursor-pointer transition-colors">
              <ChevronUp size={16} className="text-gray-600 dark:text-gray-300" />
           </div>
           
           <div 
             className={`flex items-center gap-2 hover:bg-white/50 dark:hover:bg-white/10 p-1 rounded px-2 cursor-pointer transition-colors ${system.isQuickSettingsOpen ? 'bg-white/50 dark:bg-white/10' : ''}`}
             onClick={toggleQuickSettings}
           >
              {system.network.isWifiOn ? <Wifi size={16} className="text-gray-600 dark:text-gray-300" /> : <Wifi className="text-gray-400" size={16} />}
              <Volume2 size={16} className="text-gray-600 dark:text-gray-300" />
              <Battery size={16} className="text-gray-600 dark:text-gray-300" />
              {system.network.isVpnConnected && <Shield size={12} className="text-green-500 ml-1" />}
           </div>

           <div 
             className={`flex flex-col items-end justify-center px-2 hover:bg-white/50 dark:hover:bg-white/10 h-full rounded cursor-pointer transition-colors ${system.isCalendarOpen ? 'bg-white/50 dark:bg-white/10' : ''}`}
             onClick={toggleCalendar}
           >
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-none mb-0.5">{formatTime(time)}</span>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 leading-none">{formatDate(time)}</span>
           </div>

           <div className="w-1 h-full border-l border-gray-300 dark:border-gray-600/50 ml-1 hover:bg-white/20 cursor-pointer" title="Show Desktop"></div>
        </div>
      </div>
    </>
  );
};

export default Taskbar;
