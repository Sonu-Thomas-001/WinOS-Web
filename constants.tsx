import React from 'react';
import { AppID, AppConfig, UserProfile, FileNode } from './types';
import { 
  FolderOpen, 
  Globe, 
  FileText, 
  Terminal, 
  Settings, 
  Calculator 
} from 'lucide-react';
import Explorer from './components/apps/Explorer';
import Browser from './components/apps/Browser';
import Notepad from './components/apps/Notepad';
import TerminalApp from './components/apps/Terminal';
import SettingsApp from './components/apps/Settings';

// Constants
export const WALLPAPER_URL = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
export const WALLPAPER_LOCK_URL = "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
export const BOOT_DURATION = 2500;

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'admin_01',
    name: 'Admin',
    type: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    settings: {
      theme: 'dark',
      wallpaper: WALLPAPER_URL
    }
  },
  {
    id: 'user_01',
    name: 'Guest User',
    type: 'guest',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
    settings: {
      theme: 'light',
      wallpaper: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
  }
];

// Initial File System Data
export const INITIAL_FILES: FileNode[] = [
  { id: 'root', parentId: null, name: 'C:', type: 'folder', createdAt: Date.now() },
  { id: 'users', parentId: 'root', name: 'Users', type: 'folder', createdAt: Date.now() },
  { id: 'guest', parentId: 'users', name: 'Guest', type: 'folder', createdAt: Date.now() },
  { id: 'desktop', parentId: 'guest', name: 'Desktop', type: 'folder', createdAt: Date.now() },
  { id: 'docs', parentId: 'guest', name: 'Documents', type: 'folder', createdAt: Date.now() },
  { id: 'downloads', parentId: 'guest', name: 'Downloads', type: 'folder', createdAt: Date.now() },
  { id: 'pics', parentId: 'guest', name: 'Pictures', type: 'folder', createdAt: Date.now() },
  { id: 'music', parentId: 'guest', name: 'Music', type: 'folder', createdAt: Date.now() },
  
  // Sample Files
  { id: 'welcome', parentId: 'desktop', name: 'Welcome.txt', type: 'file', content: 'Welcome to WinOS Web!\n\nThis is a simulated environment built with React.', createdAt: Date.now() },
  { id: 'todo', parentId: 'docs', name: 'todo.txt', type: 'file', content: '- Buy milk\n- Code React app\n- Sleep', createdAt: Date.now() },
];

export const APPS: Record<AppID, AppConfig> = {
  [AppID.EXPLORER]: {
    id: AppID.EXPLORER,
    title: 'File Explorer',
    icon: FolderOpen,
    component: <Explorer />,
    defaultWidth: 800,
    defaultHeight: 500,
  },
  [AppID.BROWSER]: {
    id: AppID.BROWSER,
    title: 'Edge Browser',
    icon: Globe,
    component: <Browser />,
    defaultWidth: 900,
    defaultHeight: 600,
  },
  [AppID.NOTEPAD]: {
    id: AppID.NOTEPAD,
    title: 'Notepad',
    icon: FileText,
    component: <Notepad />,
    defaultWidth: 600,
    defaultHeight: 400,
  },
  [AppID.TERMINAL]: {
    id: AppID.TERMINAL,
    title: 'Terminal',
    icon: Terminal,
    component: <TerminalApp />,
    defaultWidth: 700,
    defaultHeight: 450,
  },
  [AppID.SETTINGS]: {
    id: AppID.SETTINGS,
    title: 'Settings',
    icon: Settings,
    component: <SettingsApp />,
    defaultWidth: 700,
    defaultHeight: 500,
  },
  [AppID.CALCULATOR]: {
    id: AppID.CALCULATOR,
    title: 'Calculator',
    icon: Calculator,
    component: <div className="p-4 text-center">Calculator Demo</div>,
    defaultWidth: 300,
    defaultHeight: 400,
  }
};
