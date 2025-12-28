import React from 'react';
import { AppID, AppConfig, UserProfile, FileNode } from './types';
import { 
  FolderOpen, 
  Globe, 
  FileText, 
  Terminal, 
  Settings, 
  Calculator,
  Activity,
  ShoppingBag,
  Code,
  ShieldCheck,
  LayoutPanelLeft
} from 'lucide-react';
import Explorer from './components/apps/Explorer';
import Browser from './components/apps/Browser';
import Notepad from './components/apps/Notepad';
import TerminalApp from './components/apps/Terminal';
import SettingsApp from './components/apps/Settings';
import TaskManager from './components/apps/TaskManager';
import AppStore from './components/apps/AppStore';
import VSCode from './components/apps/VSCode';
import AdminCenter from './components/apps/AdminCenter';

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
      wallpaper: WALLPAPER_URL,
      accentColor: 'blue'
    }
  },
  {
    id: 'user_01',
    name: 'Guest User',
    type: 'guest',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
    settings: {
      theme: 'light',
      wallpaper: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      accentColor: 'purple'
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
  { id: 'projects', parentId: 'guest', name: 'Projects', type: 'folder', createdAt: Date.now() },
  { id: 'trash', parentId: null, name: 'Recycle Bin', type: 'folder', createdAt: Date.now() }, // Trash Root
  
  // Sample Files
  { id: 'welcome', parentId: 'desktop', name: 'Welcome.txt', type: 'file', content: 'Welcome to WinOS Web!\n\nThis is a simulated environment built with React.', createdAt: Date.now(), size: 1024, extension: 'txt' },
  { id: 'todo', parentId: 'docs', name: 'todo.txt', type: 'file', content: '- Buy milk\n- Code React app\n- Sleep', createdAt: Date.now(), size: 512, extension: 'txt' },
  { id: 'web-project', parentId: 'projects', name: 'index.html', type: 'file', content: '<h1>Hello World</h1>\n<p>This is a live preview.</p>', createdAt: Date.now(), size: 2048, extension: 'html' },
];

export const APPS: Record<AppID, AppConfig> = {
  [AppID.EXPLORER]: {
    id: AppID.EXPLORER,
    title: 'File Explorer',
    icon: FolderOpen,
    component: <Explorer />,
    defaultWidth: 900,
    defaultHeight: 600,
    isSystem: true,
    category: 'Productivity'
  },
  [AppID.BROWSER]: {
    id: AppID.BROWSER,
    title: 'Edge Browser',
    icon: Globe,
    component: <Browser />,
    defaultWidth: 1000,
    defaultHeight: 700,
    category: 'Internet',
    version: '121.0.22',
    publisher: 'Microsoft',
    description: 'Fast, secure, and modern web browser.'
  },
  [AppID.NOTEPAD]: {
    id: AppID.NOTEPAD,
    title: 'Notepad',
    icon: FileText,
    component: <Notepad />,
    defaultWidth: 600,
    defaultHeight: 400,
    isSystem: true,
    category: 'Productivity'
  },
  [AppID.VSCODE]: {
    id: AppID.VSCODE,
    title: 'VS Code',
    icon: Code,
    component: <VSCode />,
    defaultWidth: 1100,
    defaultHeight: 700,
    category: 'Developer Tools',
    publisher: 'Microsoft',
    rating: 4.9,
    description: 'Code editing. Redefined. Build and debug modern web and cloud applications.'
  },
  [AppID.TERMINAL]: {
    id: AppID.TERMINAL,
    title: 'Terminal',
    icon: Terminal,
    component: <TerminalApp />,
    defaultWidth: 700,
    defaultHeight: 450,
    category: 'Developer Tools',
    rating: 4.8
  },
  [AppID.SETTINGS]: {
    id: AppID.SETTINGS,
    title: 'Settings',
    icon: Settings,
    component: <SettingsApp />,
    defaultWidth: 900,
    defaultHeight: 650,
    isSystem: true,
    category: 'System'
  },
  [AppID.CALCULATOR]: {
    id: AppID.CALCULATOR,
    title: 'Calculator',
    icon: Calculator,
    component: <div className="p-4 text-center">Calculator Demo</div>,
    defaultWidth: 320,
    defaultHeight: 450,
    category: 'Utilities',
    rating: 4.5
  },
  [AppID.TASK_MANAGER]: {
    id: AppID.TASK_MANAGER,
    title: 'Task Manager',
    icon: Activity,
    component: <TaskManager />,
    defaultWidth: 600,
    defaultHeight: 500,
    isSystem: true,
    category: 'System'
  },
  [AppID.STORE]: {
    id: AppID.STORE,
    title: 'Microsoft Store',
    icon: ShoppingBag,
    component: <AppStore />,
    defaultWidth: 900,
    defaultHeight: 650,
    isSystem: true,
    category: 'System'
  },
  [AppID.ADMIN_CENTER]: {
    id: AppID.ADMIN_CENTER,
    title: 'Admin Center',
    icon: ShieldCheck,
    component: <AdminCenter />,
    defaultWidth: 1000,
    defaultHeight: 700,
    isSystem: true,
    category: 'System',
    description: 'Enterprise management dashboard for system administrators.'
  },
  [AppID.WIDGETS_SERVICE]: {
    id: AppID.WIDGETS_SERVICE,
    title: 'Widgets',
    icon: LayoutPanelLeft,
    component: <div className="p-4 text-center">Widgets Service Background Process</div>,
    defaultWidth: 300,
    defaultHeight: 200,
    isSystem: true,
    category: 'System'
  }
};
