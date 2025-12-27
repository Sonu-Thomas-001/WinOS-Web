import { ReactNode } from 'react';

export enum AppID {
  EXPLORER = 'explorer',
  BROWSER = 'browser',
  NOTEPAD = 'notepad',
  TERMINAL = 'terminal',
  SETTINGS = 'settings',
  CALCULATOR = 'calculator'
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
  password?: string; // For simulation
  settings: {
    theme: 'light' | 'dark';
    wallpaper?: string;
  };
}

export interface AppConfig {
  id: AppID;
  title: string;
  icon: any; // Lucide Icon component type
  component: ReactNode;
  defaultWidth: number;
  defaultHeight: number;
}

export interface WindowState {
  id: string; // Unique instance ID
  appId: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  prevSize?: { width: number; height: number; x: number; y: number }; // For restoring from max
  isCrashed?: boolean; 
  fileOpen?: string; // Path of file opened (for Notepad etc)
}

// File System Types
export interface FileNode {
  id: string;
  parentId: string | null;
  name: string;
  type: 'folder' | 'file';
  content?: string; // Text content for now
  createdAt: number;
  icon?: string; // Optional custom icon
}

export interface FileSystemContextType {
  nodes: FileNode[];
  rootId: string;
  desktopId: string;
  createFile: (parentId: string, name: string, content?: string) => FileNode;
  createFolder: (parentId: string, name: string) => FileNode;
  deleteNode: (id: string) => void;
  getContents: (parentId: string) => FileNode[];
  getNode: (id: string) => FileNode | undefined;
  getPath: (id: string) => FileNode[]; // Returns array of nodes from root to id
  resolvePath: (currentDirId: string, pathStr: string) => string | null; // Returns target ID
}

export interface SystemState {
  isBooting: boolean;
  bootMode: BootMode;
  authStatus: AuthStatus;
  currentUserId: string | null;
  volume: number;
  isStartMenuOpen: boolean;
  isCalendarOpen: boolean;
  uptime: number; // Seconds
}
