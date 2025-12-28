import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppID, WindowState, SystemState, UserProfile, AuthStatus, BootMode, FileNode, FileSystemContextType, AuditLogEntry, Notification } from '../types';
import { APPS, BOOT_DURATION, DEFAULT_USERS, INITIAL_FILES } from '../constants';

interface OSContextType {
  system: SystemState;
  windows: WindowState[];
  users: UserProfile[];
  currentUser: UserProfile | undefined;
  activeWindowId: string | null;
  fs: FileSystemContextType;
  notifications: Notification[];
  
  launchApp: (appId: AppID, params?: any) => void;
  installApp: (appId: AppID) => void;
  uninstallApp: (appId: AppID) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  snapWindow: (id: string, type: 'left' | 'right' | 'maximize') => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  crashApp: (id: string) => void;
  relaunchApp: (id: string) => void;
  toggleAlwaysOnTop: (id: string) => void;
  togglePiP: (id: string) => void;
  
  toggleStartMenu: () => void;
  toggleCalendar: () => void;
  toggleWidgets: () => void;
  toggleCopilot: () => void;
  toggleQuickSettings: () => void;
  switchDesktop: (index: number) => void;
  addDesktop: () => void;
  moveWindowToDesktop: (windowId: string, desktopIndex: number) => void;
  
  setTheme: (theme: 'light' | 'dark') => void;
  setAccentColor: (color: string) => void;
  setFirewallRule: (appId: AppID, blocked: boolean) => void;
  addAuditLog: (action: string, details: string, severity?: 'info' | 'warning' | 'error') => void;
  setSystemSetting: (key: keyof SystemState, value: any) => void;
  toggleNetworkFeature: (feature: 'wifi' | 'bluetooth' | 'airplane' | 'vpn') => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error', appId?: string) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  toggleDoNotDisturb: () => void;

  login: (userId: string, password?: string) => void;
  logout: () => void;
  lockSession: () => void;
  shutdown: () => void;
  restart: (safeMode?: boolean) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const STORAGE_KEY_WINDOWS = 'winos_windows';
const STORAGE_KEY_FS = 'winos_fs';
const STORAGE_KEY_APPS = 'winos_installed_apps';

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- System State ---
  const [system, setSystem] = useState<SystemState>({
    isBooting: true,
    bootMode: BootMode.NORMAL,
    authStatus: AuthStatus.LOGGED_OUT,
    currentUserId: null,
    volume: 50,
    brightness: 100,
    isStartMenuOpen: false,
    isCalendarOpen: false,
    isWidgetsOpen: false,
    isCopilotOpen: false,
    isQuickSettingsOpen: false,
    uptime: 0,
    currentDesktopIndex: 0,
    desktops: ['Desktop 1', 'Desktop 2'],
    installedApps: [AppID.EXPLORER, AppID.BROWSER, AppID.NOTEPAD, AppID.VSCODE, AppID.TERMINAL, AppID.SETTINGS, AppID.TASK_MANAGER, AppID.STORE, AppID.ADMIN_CENTER],
    startupApps: [AppID.WIDGETS_SERVICE], 
    auditLog: [],
    firewallRules: [],
    powerMode: 'balanced',
    displayScale: 100,
    doNotDisturb: false,
    network: {
      isWifiOn: true,
      isConnected: true,
      ssid: 'WinOS-5G',
      signalStrength: 4,
      isAirplaneMode: false,
      isBluetoothOn: true,
      isVpnConnected: false
    }
  });

  const [users, setUsers] = useState<UserProfile[]>(DEFAULT_USERS);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  // --- File System State ---
  const [fileNodes, setFileNodes] = useState<FileNode[]>(INITIAL_FILES);
  
  const currentUser = users.find(u => u.id === system.currentUserId);

  // --- Persistence Logic ---
  useEffect(() => {
    const savedWindows = localStorage.getItem(STORAGE_KEY_WINDOWS);
    const savedFs = localStorage.getItem(STORAGE_KEY_FS);
    const savedApps = localStorage.getItem(STORAGE_KEY_APPS);

    if (savedWindows) {
      try {
         const parsed = JSON.parse(savedWindows);
         if (Array.isArray(parsed)) setWindows(parsed);
      } catch (e) { console.error("Failed to load windows", e); }
    }
    if (savedFs) {
      try {
         const parsed = JSON.parse(savedFs);
         if (Array.isArray(parsed)) setFileNodes(parsed);
      } catch (e) { console.error("Failed to load FS", e); }
    }
    if (savedApps) {
       try {
          const parsed = JSON.parse(savedApps);
          if (Array.isArray(parsed)) setSystem(prev => ({...prev, installedApps: parsed}));
       } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (system.authStatus === AuthStatus.LOGGED_IN) {
       localStorage.setItem(STORAGE_KEY_WINDOWS, JSON.stringify(windows));
       localStorage.setItem(STORAGE_KEY_FS, JSON.stringify(fileNodes));
       localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(system.installedApps));
    }
  }, [windows, fileNodes, system.installedApps, system.authStatus]);


  // FS Helpers (Omitted for brevity, same as before)
  const fs: FileSystemContextType = {
    nodes: fileNodes,
    rootId: 'root',
    desktopId: 'desktop',
    createFile: (parentId, name, content = '') => {
      const ext = name.includes('.') ? name.split('.').pop() : 'txt';
      const newNode: FileNode = { 
        id: `file-${Date.now()}-${Math.random()}`, 
        parentId, 
        name, 
        type: 'file', 
        content, 
        createdAt: Date.now(),
        size: Math.floor(Math.random() * 5000) + 100, // Sim size
        extension: ext,
        isTrash: false
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
        createdAt: Date.now(),
        isTrash: false
      };
      setFileNodes(prev => [...prev, newNode]);
      return newNode;
    },
    deleteNode: (id, permanent = false) => {
       if (permanent) {
         // Recursive delete
         const toDelete = new Set<string>();
         const findChildren = (nodeId: string) => {
            toDelete.add(nodeId);
            fileNodes.filter(n => n.parentId === nodeId).forEach(child => findChildren(child.id));
         };
         findChildren(id);
         setFileNodes(prev => prev.filter(n => !toDelete.has(n.id)));
       } else {
         // Move to Trash
         setFileNodes(prev => prev.map(n => n.id === id ? { ...n, isTrash: true } : n));
       }
    },
    restoreNode: (id) => {
       setFileNodes(prev => prev.map(n => n.id === id ? { ...n, isTrash: false } : n));
    },
    emptyTrash: () => {
       const trashItems = fileNodes.filter(n => n.isTrash);
       setFileNodes(prev => prev.filter(n => !n.isTrash));
    },
    moveNode: (id, newParentId) => {
       setFileNodes(prev => prev.map(n => n.id === id ? { ...n, parentId: newParentId } : n));
    },
    renameNode: (id, newName) => {
       setFileNodes(prev => prev.map(n => n.id === id ? { ...n, name: newName } : n));
    },
    copyNode: (id, newParentId) => {
       const node = fileNodes.find(n => n.id === id);
       if (!node) return;
       const newNode = { ...node, id: `${node.type}-${Date.now()}-${Math.random()}`, parentId: newParentId, name: node.name.includes('Copy') ? node.name : `${node.name} - Copy` };
       setFileNodes(prev => [...prev, newNode]);
    },
    zipNode: (id) => {
       const node = fileNodes.find(n => n.id === id);
       if (node && node.type === 'folder') {
          // Convert folder to zip file
          setFileNodes(prev => prev.map(n => n.id === id ? { ...n, type: 'file', extension: 'zip', name: `${n.name}.zip` } : n));
       }
    },
    extractNode: (id) => {
       const node = fileNodes.find(n => n.id === id);
       if (node && node.type === 'file' && node.extension === 'zip') {
          // Convert zip file to folder
          setFileNodes(prev => prev.map(n => n.id === id ? { ...n, type: 'folder', extension: undefined, name: n.name.replace('.zip', '') } : n));
       }
    },
    getContents: (parentId) => fileNodes.filter(n => n.parentId === parentId && !n.isTrash),
    getNode: (id) => fileNodes.find(n => n.id === id),
    getPath: (id) => {
      const path: FileNode[] = [];
      let current = fileNodes.find(n => n.id === id);
      while (current) { path.unshift(current); current = fileNodes.find(n => n.id === current?.parentId); }
      return path;
    },
    resolvePath: (currentDirId, pathStr) => {
      if (!pathStr || pathStr === '.') return currentDirId;
      if (pathStr === '..') {
        const current = fileNodes.find(n => n.id === currentDirId);
        return current?.parentId || currentDirId;
      }
      const child = fileNodes.find(n => n.parentId === currentDirId && n.name.toLowerCase() === pathStr.toLowerCase() && !n.isTrash);
      return child ? child.id : null;
    }
  };

  const addAuditLog = useCallback((action: string, details: string, severity: 'info' | 'warning' | 'error' = 'info') => {
      setSystem(prev => ({
         ...prev,
         auditLog: [{ id: Date.now().toString(), timestamp: Date.now(), action, details, severity }, ...prev.auditLog].slice(0, 100)
      }));
  }, []);

  const addNotification = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', appId: string = 'system') => {
      const newNotif: Notification = {
          id: Date.now().toString() + Math.random(),
          appId,
          title,
          message,
          timestamp: Date.now(),
          type,
          read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const clearNotification = useCallback((id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
      setNotifications([]);
  }, []);

  const toggleDoNotDisturb = useCallback(() => {
     setSystem(prev => ({ ...prev, doNotDisturb: !prev.doNotDisturb }));
  }, []);

  const toggleNetworkFeature = useCallback((feature: 'wifi' | 'bluetooth' | 'airplane' | 'vpn') => {
     setSystem(prev => {
        const net = { ...prev.network };
        if (feature === 'wifi') {
           net.isWifiOn = !net.isWifiOn;
           net.isConnected = net.isWifiOn; // Sim connection logic
        } else if (feature === 'bluetooth') {
           net.isBluetoothOn = !net.isBluetoothOn;
        } else if (feature === 'airplane') {
           net.isAirplaneMode = !net.isAirplaneMode;
           if (net.isAirplaneMode) {
              net.isWifiOn = false;
              net.isBluetoothOn = false;
              net.isConnected = false;
           }
        } else if (feature === 'vpn') {
           net.isVpnConnected = !net.isVpnConnected;
           if (net.isVpnConnected) {
              addNotification('VPN', 'Secure connection established to Enterprise Server.', 'success', 'security');
           }
        }
        return { ...prev, network: net };
     });
  }, [addNotification]);

  useEffect(() => {
    const interval = setInterval(() => setSystem(prev => ({ ...prev, uptime: prev.uptime + 1 })), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (system.isBooting) {
      const timer = setTimeout(() => {
          setSystem(prev => ({ ...prev, isBooting: false }));
          addAuditLog('System', 'System Booted successfully');
          // Startup Automation
          setTimeout(() => {
             addNotification('Welcome to WinOS', 'System loaded successfully. Click Copilot to get AI assistance.', 'success');
          }, 1000);
      }, BOOT_DURATION);
      return () => clearTimeout(timer);
    }
  }, [system.isBooting, addAuditLog, addNotification]);

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

    if (!app) return; // Guard

    if (!system.installedApps.includes(appId)) {
       addNotification('Installation Error', `${app.title} is not installed.`, 'error');
       addAuditLog('Security', `Failed launch attempt: ${appId} (Not Installed)`, 'warning');
       return;
    }

    if (system.firewallRules.includes(appId)) {
        addNotification('Firewall Alert', `${app.title} was blocked by your organization.`, 'error', 'security');
        addAuditLog('Firewall', `Blocked launch attempt: ${appId}`, 'error');
        return;
    }

    if (system.bootMode === BootMode.SAFE_MODE && !app.isSystem) {
       addNotification('Safe Mode', `${app.title} cannot run in Safe Mode.`, 'warning');
       return;
    }

    // Smart Behavior: VS Code Launch
    if (appId === AppID.VSCODE) {
       if (!windows.some(w => w.appId === AppID.TERMINAL)) {
           setTimeout(() => launchApp(AppID.TERMINAL), 500);
           addNotification('Dev Environment', 'Terminal launched automatically for your development session.', 'info', 'automation');
       }
    }

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: params?.filename ? `${params.filename} - ${app.title}` : app.title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      isAlwaysOnTop: false,
      isPiP: false,
      desktopIndex: system.currentDesktopIndex,
      zIndex: getNextZIndex(),
      position: { 
        x: Math.max(0, (window.innerWidth / 2) - (app.defaultWidth / 2) + (windows.length * 20)), 
        y: Math.max(0, (window.innerHeight / 2) - (app.defaultHeight / 2) + (windows.length * 20)) 
      },
      size: { width: app.defaultWidth, height: app.defaultHeight },
      fileOpen: params?.fileId,
      launchParams: params,
      pid: Math.floor(Math.random() * 9000) + 1000
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setSystem(prev => ({ ...prev, isStartMenuOpen: false, isWidgetsOpen: false, isCalendarOpen: false, isCopilotOpen: false, isQuickSettingsOpen: false }));
    addAuditLog('Process', `Started Process ${newWindow.pid} (${app.title})`);
  }, [windows, system.bootMode, system.currentDesktopIndex, system.installedApps, system.firewallRules, addAuditLog, addNotification]);

  const installApp = useCallback((appId: AppID) => {
     if (!system.installedApps.includes(appId)) {
        setSystem(prev => ({ ...prev, installedApps: [...prev.installedApps, appId] }));
        addAuditLog('AppStore', `Installed application: ${APPS[appId].title}`);
        addNotification('App Store', `${APPS[appId].title} installed successfully.`, 'success', 'store');
     }
  }, [system.installedApps, addAuditLog, addNotification]);

  const uninstallApp = useCallback((appId: AppID) => {
     setSystem(prev => ({ ...prev, installedApps: prev.installedApps.filter(id => id !== appId) }));
     setWindows(prev => prev.filter(w => w.appId !== appId));
     addAuditLog('AppStore', `Uninstalled application: ${APPS[appId].title}`, 'warning');
     addNotification('App Store', `${APPS[appId].title} removed.`, 'info', 'store');
  }, [addAuditLog, addNotification]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const crashApp = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isCrashed: true } : w));
    addAuditLog('Process', `Process crashed: ${id}`, 'error');
    addNotification('System Error', `A process has stopped responding.`, 'error', 'system');
  }, [addAuditLog, addNotification]);

  const relaunchApp = useCallback((id: string) => {
    const win = windows.find(w => w.id === id);
    if (win) {
       const { appId, launchParams } = win;
       closeWindow(id);
       setTimeout(() => launchApp(appId, launchParams), 300);
    }
  }, [windows, closeWindow, launchApp]);

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
           return { ...w, isMaximized: false, position: { x: w.prevSize?.x || 100, y: w.prevSize?.y || 100 }, size: { width: w.prevSize?.width || 800, height: w.prevSize?.height || 600 } };
        } else {
           return { ...w, isMaximized: true, prevSize: { ...w.size, x: w.position.x, y: w.position.y }, position: { x: 0, y: 0 }, size: { width: screenW, height: screenH } };
        }
      } else if (type === 'left') {
         return { ...w, isMaximized: false, prevSize: { ...w.size, x: w.position.x, y: w.position.y }, position: { x: 0, y: 0 }, size: { width: screenW / 2, height: screenH } };
      } else if (type === 'right') {
         return { ...w, isMaximized: false, prevSize: { ...w.size, x: w.position.x, y: w.position.y }, position: { x: screenW / 2, y: 0 }, size: { width: screenW / 2, height: screenH } };
      }
      return w;
    }));
    focusWindow(id);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: getNextZIndex(), isMinimized: false } : w));
    setActiveWindowId(id);
  }, [windows]); 

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size: { width, height } } : w));
  }, []);

  const toggleAlwaysOnTop = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isAlwaysOnTop: !w.isAlwaysOnTop } : w));
  }, []);

  const togglePiP = useCallback((id: string) => {
     setWindows(prev => prev.map(w => {
        if (w.id !== id) return w;
        const isPiP = !w.isPiP;
        if (isPiP) {
           return {
              ...w,
              isPiP: true,
              isAlwaysOnTop: true,
              prevSize: { ...w.size, x: w.position.x, y: w.position.y },
              size: { width: 320, height: 180 },
              position: { x: window.innerWidth - 340, y: window.innerHeight - 240 }
           };
        } else {
           return {
              ...w,
              isPiP: false,
              isAlwaysOnTop: false,
              position: { x: w.prevSize?.x || 100, y: w.prevSize?.y || 100 },
              size: { width: w.prevSize?.width || 800, height: w.prevSize?.height || 600 }
           };
        }
     }));
  }, []);

  // --- Virtual Desktop & Menus ---

  const toggleStartMenu = useCallback(() => {
    setSystem(prev => ({ ...prev, isStartMenuOpen: !prev.isStartMenuOpen, isCalendarOpen: false, isWidgetsOpen: false, isCopilotOpen: false, isQuickSettingsOpen: false }));
  }, []);

  const toggleCalendar = useCallback(() => {
    setSystem(prev => ({ ...prev, isCalendarOpen: !prev.isCalendarOpen, isStartMenuOpen: false, isWidgetsOpen: false, isCopilotOpen: false, isQuickSettingsOpen: false }));
  }, []);

  const toggleWidgets = useCallback(() => {
    setSystem(prev => ({ ...prev, isWidgetsOpen: !prev.isWidgetsOpen, isStartMenuOpen: false, isCalendarOpen: false, isCopilotOpen: false, isQuickSettingsOpen: false }));
  }, []);

  const toggleCopilot = useCallback(() => {
    setSystem(prev => ({ ...prev, isCopilotOpen: !prev.isCopilotOpen, isStartMenuOpen: false, isCalendarOpen: false, isWidgetsOpen: false, isQuickSettingsOpen: false }));
  }, []);

  const toggleQuickSettings = useCallback(() => {
    setSystem(prev => ({ ...prev, isQuickSettingsOpen: !prev.isQuickSettingsOpen, isStartMenuOpen: false, isCalendarOpen: false, isWidgetsOpen: false, isCopilotOpen: false }));
  }, []);

  const switchDesktop = useCallback((index: number) => {
     setSystem(prev => ({ ...prev, currentDesktopIndex: index }));
  }, []);

  const addDesktop = useCallback(() => {
     setSystem(prev => ({ ...prev, desktops: [...prev.desktops, `Desktop ${prev.desktops.length + 1}`], currentDesktopIndex: prev.desktops.length }));
  }, []);

  const moveWindowToDesktop = useCallback((windowId: string, desktopIndex: number) => {
     setWindows(prev => prev.map(w => w.id === windowId ? { ...w, desktopIndex } : w));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setUsers(prevUsers => prevUsers.map(u => 
      u.id === system.currentUserId 
        ? { ...u, settings: { ...u.settings, theme } } 
        : u
    ));
  }, [system.currentUserId]);

  const setAccentColor = useCallback((color: string) => {
    setUsers(prevUsers => prevUsers.map(u => 
      u.id === system.currentUserId 
        ? { ...u, settings: { ...u.settings, accentColor: color } } 
        : u
    ));
  }, [system.currentUserId]);

  const setFirewallRule = useCallback((appId: AppID, blocked: boolean) => {
      setSystem(prev => ({
          ...prev,
          firewallRules: blocked 
              ? [...prev.firewallRules, appId]
              : prev.firewallRules.filter(id => id !== appId)
      }));
      addAuditLog('Firewall', `${blocked ? 'Blocked' : 'Unblocked'} application: ${appId}`, 'warning');
  }, [addAuditLog]);

  const setSystemSetting = useCallback((key: keyof SystemState, value: any) => {
      setSystem(prev => ({ ...prev, [key]: value }));
  }, []);

  const login = useCallback((userId: string, password?: string) => {
     setSystem(prev => ({ ...prev, currentUserId: userId, authStatus: AuthStatus.LOGGED_IN, isStartMenuOpen: false }));
     addAuditLog('Security', `User logged in: ${userId}`);
  }, [addAuditLog]);

  const logout = useCallback(() => {
     setSystem(prev => ({ ...prev, authStatus: AuthStatus.LOGGED_OUT, currentUserId: null, isStartMenuOpen: false }));
     setWindows([]);
     setNotifications([]);
     addAuditLog('Security', `User logged out`);
     localStorage.removeItem(STORAGE_KEY_WINDOWS); 
  }, [addAuditLog]);

  const lockSession = useCallback(() => {
     setSystem(prev => ({ ...prev, authStatus: AuthStatus.LOCKED, isStartMenuOpen: false }));
     addAuditLog('Security', `Session locked`);
  }, [addAuditLog]);

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
      system, windows, users, currentUser, activeWindowId, fs, notifications,
      launchApp, installApp, uninstallApp, closeWindow, minimizeWindow, maximizeWindow, snapWindow, focusWindow, updateWindowPosition, updateWindowSize, crashApp, relaunchApp,
      toggleAlwaysOnTop, togglePiP,
      toggleStartMenu, toggleCalendar, toggleWidgets, toggleCopilot, toggleQuickSettings, switchDesktop, addDesktop, moveWindowToDesktop,
      setTheme, setAccentColor, setFirewallRule, addAuditLog, setSystemSetting, toggleNetworkFeature, addNotification, clearNotification, clearAllNotifications, toggleDoNotDisturb,
      login, logout, lockSession, shutdown, restart
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
