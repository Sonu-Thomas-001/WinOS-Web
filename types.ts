import { ReactNode } from 'react';

export enum AppID {
  EXPLORER = 'explorer',
  BROWSER = 'browser',
  NOTEPAD = 'notepad',
  TERMINAL = 'terminal',
  SETTINGS = 'settings',
  CALCULATOR = 'calculator',
  TASK_MANAGER = 'task_manager',
  STORE = 'store',
  VSCODE = 'vscode',
  WIDGETS_SERVICE = 'widgets_service',
  ADMIN_CENTER = 'admin_center'
}

export enum BootMode {
  NORMAL = 'normal',
  SAFE_MODE = 'safe_mode'
}

export enum AuthStatus {
  LOGGED_OUT = 'logged_out',
  LOGGING_IN = 'logging_in',
  LOGGED_IN = 'logged_in',
  LOCKED = 'locked'
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  type: 'admin' | 'user' | 'guest';
  password?: string; 
  settings: {
    theme: 'light' | 'dark';
    accentColor: string; // e.g., 'blue', 'purple', 'green'
    wallpaper?: string;
  };
}

export interface AppConfig {
  id: AppID;
  title: string;
  icon: any; 
  component: ReactNode;
  defaultWidth: number;
  defaultHeight: number;
  isSystem?: boolean; 
  version?: string;
  publisher?: string;
  description?: string;
  rating?: number;
  category?: string;
}

export interface WindowState {
  id: string; 
  appId: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isAlwaysOnTop?: boolean;
  isPiP?: boolean;
  desktopIndex: number;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  prevSize?: { width: number; height: number; x: number; y: number }; 
  isCrashed?: boolean; 
  fileOpen?: string; 
  launchParams?: any; 
  pid: number; // Simulated Process ID
}

// File System Types
export interface FileNode {
  id: string;
  parentId: string | null;
  name: string;
  type: 'folder' | 'file';
  content?: string; 
  createdAt: number;
  icon?: string; 
  size?: number; 
  isTrash?: boolean;
  readOnly?: boolean;
  extension?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'error';
}

export interface Notification {
  id: string;
  appId: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: () => void;
  actionLabel?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface FileSystemContextType {
  nodes: FileNode[];
  rootId: string;
  desktopId: string;
  createFile: (parentId: string, name: string, content?: string) => FileNode;
  createFolder: (parentId: string, name: string) => FileNode;
  deleteNode: (id: string, permanent?: boolean) => void;
  restoreNode: (id: string) => void; 
  emptyTrash: () => void;
  moveNode: (id: string, newParentId: string) => void;
  copyNode: (id: string, newParentId: string) => void;
  renameNode: (id: string, newName: string) => void;
  zipNode: (id: string) => void; 
  extractNode: (id: string) => void; 
  
  getContents: (parentId: string) => FileNode[];
  getNode: (id: string) => FileNode | undefined;
  getPath: (id: string) => FileNode[]; 
  resolvePath: (currentDirId: string, pathStr: string) => string | null;
}

export interface NetworkState {
  isWifiOn: boolean;
  isConnected: boolean;
  ssid: string | null;
  signalStrength: number; // 0-4
  isAirplaneMode: boolean;
  isBluetoothOn: boolean;
  isVpnConnected: boolean;
}

export interface SystemState {
  isBooting: boolean;
  bootMode: BootMode;
  authStatus: AuthStatus;
  currentUserId: string | null;
  volume: number;
  brightness: number;
  isStartMenuOpen: boolean;
  isCalendarOpen: boolean; // Acts as Notification Center toggle
  isWidgetsOpen: boolean;
  isCopilotOpen: boolean;
  isQuickSettingsOpen: boolean;
  uptime: number;
  currentDesktopIndex: number;
  desktops: string[];
  installedApps: AppID[];
  startupApps: AppID[];
  // Deep Settings
  auditLog: AuditLogEntry[];
  firewallRules: AppID[]; // List of BLOCKED apps
  powerMode: 'balanced' | 'performance' | 'saver';
  displayScale: number; // 100, 125, 150
  doNotDisturb: boolean;
  network: NetworkState;
}
