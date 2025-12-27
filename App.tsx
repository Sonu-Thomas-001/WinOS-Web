import React, { useEffect, useState } from 'react';
import { OSProvider, useOS } from './context/OSContext';
import Desktop from './components/os/Desktop';
import Taskbar from './components/os/Taskbar';
import BootScreen from './components/BootScreen';
import LoginScreen from './components/LoginScreen';
import MobileFallback from './components/MobileFallback';
import { AuthStatus } from './types';

const OS: React.FC = () => {
  const { system } = useOS();
  
  // 1. Boot Screen
  if (system.isBooting) {
    return <BootScreen />;
  }

  // 2. Login / Lock Screen
  if (system.authStatus === AuthStatus.LOGGED_OUT || system.authStatus === AuthStatus.LOCKED || system.authStatus === AuthStatus.LOGGING_IN) {
     return <LoginScreen />;
  }

  // 3. Desktop Environment (Logged In)
  return (
    <>
      <MobileFallback />
      <div className="hidden md:block w-screen h-screen overflow-hidden select-none">
        <Desktop />
        <Taskbar />
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <OSProvider>
       <OS />
    </OSProvider>
  );
};

export default App;
