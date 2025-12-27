import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppID, WindowState, SystemState, UserProfile, AuthStatus, BootMode, FileNode, FileSystemContextType } from '../types';
import { APPS, BOOT_DURATION, DEFAULT_USERS, INITIAL_FILES } from '../constants';

interface OSContextType {
  system: SystemState;
  windows: WindowState[];
  users: UserProfile[];
  currentUser: UserProfile | undefined;
  activeWindowId: string | null;
  fs: FileSystemContextType; // File System
  
  launchApp: (appId: AppID, params?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  snapWindow: (id: string, type: 'left' | 'right' | 'maximize') => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  crashApp: (id: string) => void;
  
  toggleStartMenu: () => void;
  toggleCalendar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  login: (userId: string, password?: string) => void;
  logout: () => void;
  lockSession: () => void;
  shutdown: () => void;
  restart: (safeMode?: boolean) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- System State ---
  const [system, setSystem] = useState<SystemState>({
    isBooting: true,
    bootMode: BootMode.NORMAL,
    authStatus: AuthStatus.LOGGED_OUT,
    currentUserId: null,
    volume: 50,
    isStartMenuOpen: false,
    isCalendarOpen: false,
    uptime: 0,
  });

  const [users] = useState<UserProfile[]>(DEFAULT_USERS);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  // --- File System State ---
  const [fileNodes, setFileNodes] = useState<FileNode[]>(INITIAL_FILES);
  
  // Calculate current user
  const currentUser = users.find(u => u.id === system.currentUserId);

  // FS Helpers
  const fs: FileSystemContextType = {
    nodes: fileNodes,
    rootId: 'root',
    desktopId: 'desktop', // Hardcoded for simplicity in this demo
    
    createFile: (parentId, name, content = '') => {
      const newNode: FileNode = {
        id: `file-${Date.now()}-${Math.random()}`,
        parentId,
        name,
        type: 'file',
        content,
        createdAt: Date.now()
      };
      setFileNodes(prev => [...prev, newNode]);
      return newNode;
    },
    
    createFolder: (parentId, name) => {
      const newNode: FileNode = {
        id: `folder-${Date.now()}-${Math.random()}`,
        parentId,
        name,
        type: 'folder',
        createdAt: Date.now()
      };
      setFileNodes(prev => [...prev, newNode]);
      return newNode;
    },
    
    deleteNode: (id) => {
      // Recursive delete could go here, for now simple filter
      setFileNodes(prev => prev.filter(n => n.id !== id && n.parentId !== id));
    },
    
    getContents: (parentId) => {
      return fileNodes.filter(n => n.parentId === parentId);
    },
    
    getNode: (id) => fileNodes.find(n => n.id === id),
    
    getPath: (id) => {
      const path: FileNode[] = [];
      let current = fileNodes.find(n => n.id === id);
      while (current) {
        path.unshift(current);
        current = fileNodes.find(n => n.id === current?.parentId);
      }
      return path;
    },

    resolvePath: (currentDirId, pathStr) => {
      if (!pathStr) return currentDirId;
      if (pathStr === '.') return currentDirId;
      if (pathStr === '..') {
        const current = fileNodes.find(n => n.id === currentDirId);
        return current?.parentId || currentDirId;
      }
      // Simple one-level navigation for now
      const child = fileNodes.find(n => n.parentId === currentDirId && n.name.toLowerCase() === pathStr.toLowerCase());
      return child ? child.id : null;
    }
  };

  // --- Effects ---
  useEffect(() => {
    const interval = setInterval(() => {
      setSystem(prev => ({ ...prev, uptime: prev.uptime + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (system.isBooting) {
      const timer = setTimeout(() => {
        setSystem(prev => ({ ...prev, isBooting: false }));
      }, BOOT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [system.isBooting]);

  useEffect(() => {
    const theme = currentUser?.settings.theme || 'light';
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [currentUser]);

  // --- Window Management ---
  const getNextZIndex = () => {
    const highest = windows.reduce((max, win) => Math.max(max, win.zIndex), 0);
    return highest + 1;
  };

  const launchApp = useCallback((appId: AppID, params?: any) => {
    const app = APPS[appId];
    
    // Check if app is already open if it's a singleton app (optional, here we allow multiples)
    // For Notepad, if a file is passed, maybe check if already open? Nah, new window for simplicity.

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: params?.filename ? `${params.filename} - ${app.title}` : app.title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: getNextZIndex(),
      position: { 
        x: Math.max(0, (window.innerWidth / 2) - (app.defaultWidth / 2) + (windows.length * 20)), 
        y: Math.max(0, (window.innerHeight / 2) - (app.defaultHeight / 2) + (windows.length * 20)) 
      },
      size: { width: app.defaultWidth, height: app.defaultHeight },
      fileOpen: params?.fileId // Custom param for opening files
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setSystem(prev => ({ ...prev, isStartMenuOpen: false }));
  }, [windows]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const crashApp = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isCrashed: true } : w));
    setTimeout(() => {
       closeWindow(id);
    }, 2000);
  }, [windows, closeWindow]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    snapWindow(id, 'maximize');
  }, []);

  const snapWindow = useCallback((id: string, type: 'left' | 'right' | 'maximize') => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      
      const taskbarHeight = 48;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight - taskbarHeight;

      if (type === 'maximize') {
        if (w.isMaximized) {
           // Restore
           return {
             ...w, isMaximized: false,
             position: { x: w.prevSize?.x || 100, y: w.prevSize?.y || 100 },
             size: { width: w.prevSize?.width || 800, height: w.prevSize?.height || 600 }
           };
        } else {
           // Maximize
           return {
             ...w, isMaximized: true,
             prevSize: { ...w.size, x: w.position.x, y: w.position.y },
             position: { x: 0, y: 0 },
             size: { width: screenW, height: screenH }
           };
        }
      } else if (type === 'left') {
         return {
            ...w, isMaximized: false,
            prevSize: { ...w.size, x: w.position.x, y: w.position.y }, // Save prev state
            position: { x: 0, y: 0 },
            size: { width: screenW / 2, height: screenH }
         };
      } else if (type === 'right') {
         return {
            ...w, isMaximized: false,
            prevSize: { ...w.size, x: w.position.x, y: w.position.y },
            position: { x: screenW / 2, y: 0 },
            size: { width: screenW / 2, height: screenH }
         };
      }
      return w;
    }));
    focusWindow(id);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, zIndex: getNextZIndex(), isMinimized: false };
      }
      return w;
    }));
    setActiveWindowId(id);
  }, [windows]); 

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size: { width, height } } : w));
  }, []);

  // --- Auth & Session ---
  const toggleStartMenu = useCallback(() => {
    setSystem(prev => ({ ...prev, isStartMenuOpen: !prev.isStartMenuOpen, isCalendarOpen: false }));
  }, []);

  const toggleCalendar = useCallback(() => {
    setSystem(prev => ({ ...prev, isCalendarOpen: !prev.isCalendarOpen, isStartMenuOpen: false }));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    const currentUser = users.find(u => u.id === system.currentUserId);
    if (currentUser) {
      currentUser.settings.theme = theme;
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [users, system.currentUserId]);

  const login = useCallback((userId: string, password?: string) => {
     setSystem(prev => ({ ...prev, currentUserId: userId, authStatus: AuthStatus.LOGGED_IN, isStartMenuOpen: false }));
  }, []);

  const logout = useCallback(() => {
     setSystem(prev => ({ ...prev, authStatus: AuthStatus.LOGGED_OUT, currentUserId: null, isStartMenuOpen: false }));
     setWindows([]);
  }, []);

  const lockSession = useCallback(() => {
     setSystem(prev => ({ ...prev, authStatus: AuthStatus.LOCKED, isStartMenuOpen: false }));
  }, []);

  const shutdown = useCallback(() => {
    setSystem(prev => ({ ...prev, isBooting: true }));
    setWindows([]);
    setTimeout(() => { window.location.reload(); }, 2000);
  }, []);

  const restart = useCallback((safeMode: boolean = false) => {
     setSystem(prev => ({ ...prev, isBooting: true, bootMode: safeMode ? BootMode.SAFE_MODE : BootMode.NORMAL }));
     setWindows([]);
     setTimeout(() => {
        setSystem(prev => ({ ...prev, isBooting: false, authStatus: AuthStatus.LOGGED_OUT }));
     }, BOOT_DURATION);
  }, []);

  return (
    <OSContext.Provider value={{
      system, windows, users, currentUser, activeWindowId, fs,
      launchApp, closeWindow, minimizeWindow, maximizeWindow, snapWindow, focusWindow, updateWindowPosition, updateWindowSize, crashApp,
      toggleStartMenu, toggleCalendar, setTheme, login, logout, lockSession, shutdown, restart
    }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error("useOS must be used within OSProvider");
  return context;
};