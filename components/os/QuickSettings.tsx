import React from 'react';
import { useOS } from '../../context/OSContext';
import { Wifi, WifiOff, Bluetooth, Plane, Moon, Sun, Volume2, Shield } from 'lucide-react';

const QuickSettings: React.FC = () => {
  const { system, toggleNetworkFeature, setSystemSetting, currentUser, setTheme } = useOS();

  if (!system.isQuickSettingsOpen) return null;

  const { network } = system;

  const toggleTheme = () => {
     setTheme(currentUser?.settings.theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="absolute bottom-14 right-2 w-80 bg-[#f3f3f3]/95 dark:bg-[#202020]/95 backdrop-blur-2xl rounded-lg shadow-2xl border border-white/20 dark:border-white/5 z-[9998] p-4 animate-slide-up origin-bottom-right">
       {/* Feature Grid */}
       <div className="grid grid-cols-3 gap-2 mb-6">
          <button 
             onClick={() => toggleNetworkFeature('wifi')}
             className={`h-20 rounded flex flex-col items-center justify-center gap-2 transition-colors border border-transparent ${network.isWifiOn ? 'bg-blue-600 text-white' : 'bg-white dark:bg-white/10 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/20'}`}
          >
             {network.isWifiOn ? <Wifi size={20} /> : <WifiOff size={20} />}
             <span className="text-xs font-medium">{network.isWifiOn ? network.ssid || 'Available' : 'Wi-Fi'}</span>
          </button>

          <button 
             onClick={() => toggleNetworkFeature('bluetooth')}
             className={`h-20 rounded flex flex-col items-center justify-center gap-2 transition-colors border border-transparent ${network.isBluetoothOn ? 'bg-blue-600 text-white' : 'bg-white dark:bg-white/10 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/20'}`}
          >
             <Bluetooth size={20} />
             <span className="text-xs font-medium">Bluetooth</span>
          </button>

          <button 
             onClick={() => toggleNetworkFeature('airplane')}
             className={`h-20 rounded flex flex-col items-center justify-center gap-2 transition-colors border border-transparent ${network.isAirplaneMode ? 'bg-blue-600 text-white' : 'bg-white dark:bg-white/10 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/20'}`}
          >
             <Plane size={20} />
             <span className="text-xs font-medium">Airplane</span>
          </button>

          <button 
             onClick={toggleTheme}
             className={`h-20 rounded flex flex-col items-center justify-center gap-2 transition-colors border border-transparent ${currentUser?.settings.theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-white/10 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/20'}`}
          >
             <Moon size={20} />
             <span className="text-xs font-medium">Dark Mode</span>
          </button>

          <button 
             onClick={() => toggleNetworkFeature('vpn')}
             className={`h-20 rounded flex flex-col items-center justify-center gap-2 transition-colors border border-transparent ${network.isVpnConnected ? 'bg-green-600 text-white' : 'bg-white dark:bg-white/10 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/20'}`}
          >
             <Shield size={20} />
             <span className="text-xs font-medium">VPN</span>
          </button>

          <button className="h-20 rounded flex flex-col items-center justify-center gap-2 transition-colors border border-transparent bg-white dark:bg-white/10 dark:text-gray-300 opacity-50 cursor-not-allowed">
             <div className="font-bold text-xs">...</div>
          </button>
       </div>

       {/* Sliders */}
       <div className="space-y-4">
          <div className="flex items-center gap-3">
             <Sun size={16} className="text-gray-500 dark:text-gray-400" />
             <input 
               type="range" 
               min="0" max="100" 
               value={system.brightness}
               onChange={(e) => setSystemSetting('brightness', parseInt(e.target.value))}
               className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
          </div>
          <div className="flex items-center gap-3">
             <Volume2 size={16} className="text-gray-500 dark:text-gray-400" />
             <input 
               type="range" 
               min="0" max="100" 
               value={system.volume}
               onChange={(e) => setSystemSetting('volume', parseInt(e.target.value))}
               className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
          </div>
       </div>

       <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500">
           <span>{network.isWifiOn ? 'Connected' : 'Disconnected'}</span>
           <span>{system.volume}%</span>
       </div>
    </div>
  );
};

export default QuickSettings;
