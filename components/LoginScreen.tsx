import React, { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { WALLPAPER_LOCK_URL } from '../constants';
import { ArrowRight, Power, Wifi, Monitor, User as UserIcon } from 'lucide-react';
import { AuthStatus } from '../types';

const LoginScreen: React.FC = () => {
  const { users, login, system, shutdown, restart } = useOS();
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0].id);
  const [isLockScreen, setIsLockScreen] = useState(system.authStatus === AuthStatus.LOGGED_OUT); // True = Clock, False = Login inputs
  const [password, setPassword] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // If locked (not logged out), show login inputs immediately or clock? Windows shows clock first usually.
    // We'll reset to lock screen (clock) whenever this mounts if logged out
    if (system.authStatus === AuthStatus.LOCKED) {
       setIsLockScreen(true);
       if (system.currentUserId) setSelectedUserId(system.currentUserId);
    }
  }, [system.authStatus, system.currentUserId]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedUserId, password);
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  // Formatting
  const timeString = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateString = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  if (isLockScreen) {
    return (
      <div 
        className="fixed inset-0 z-[5000] bg-cover bg-center flex flex-col items-center text-white select-none transition-all duration-500"
        style={{ backgroundImage: `url(${WALLPAPER_LOCK_URL})` }}
        onClick={() => setIsLockScreen(false)}
      >
        <div className="mt-24 flex flex-col items-center animate-fade-in">
           <div className="text-8xl font-light tracking-tighter drop-shadow-md">{timeString}</div>
           <div className="text-2xl font-medium mt-4 drop-shadow-md">{dateString}</div>
        </div>
        
        <div className="absolute bottom-8 flex flex-col items-center animate-bounce opacity-70">
           <div className="text-sm font-medium">Click to unlock</div>
        </div>

        <div className="absolute bottom-6 right-6 flex gap-4">
           <Wifi size={24} className="drop-shadow-sm" />
           <Monitor size={24} className="drop-shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[5000] bg-cover bg-center flex flex-col items-center justify-center relative overflow-hidden"
    >
       {/* Blurred Background Layer */}
       <div 
         className="absolute inset-0 bg-cover bg-center blur-xl scale-110"
         style={{ backgroundImage: `url(${WALLPAPER_LOCK_URL})` }}
       ></div>
       <div className="absolute inset-0 bg-black/20"></div>

       {/* Login Container */}
       <div className="relative z-10 flex flex-col items-center animate-slide-up w-full max-w-sm">
          {/* User Avatar */}
          <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center mb-6 shadow-2xl overflow-hidden border-4 border-white/10">
             {selectedUser ? (
                 <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
             ) : (
                 <UserIcon size={64} className="text-white" />
             )}
          </div>

          <h2 className="text-3xl font-semibold text-white mb-6 drop-shadow-md">
             {selectedUser?.name}
          </h2>

          {/* Password Input */}
          <form onSubmit={handleLogin} className="w-full flex flex-col items-center gap-4">
             <div className="relative w-3/4 group">
                <input 
                  type="password" 
                  placeholder="PIN or Password" 
                  className="w-full bg-white/30 backdrop-blur-md border border-white/20 rounded-sm px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:bg-white/40 focus:border-white/50 transition-all shadow-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 w-8 bg-white/20 hover:bg-white/30 flex items-center justify-center rounded-sm transition-colors"
                >
                   <ArrowRight size={16} className="text-white" />
                </button>
             </div>
             
             {system.authStatus === AuthStatus.LOCKED && (
                <div className="text-white/80 text-sm mt-2">Locked</div>
             )}
          </form>

          {/* User Switcher (if logged out) */}
          {system.authStatus !== AuthStatus.LOCKED && (
            <div className="flex gap-6 mt-12">
               {users.map(user => (
                  <div 
                    key={user.id} 
                    className={`flex flex-col items-center cursor-pointer transition-opacity ${selectedUserId === user.id ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                    onClick={() => { setSelectedUserId(user.id); setPassword(''); }}
                  >
                     <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border-2 border-transparent hover:border-white/50">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                     </div>
                     <span className="text-xs text-white font-medium">{user.name}</span>
                  </div>
               ))}
            </div>
          )}
       </div>

       {/* Footer Power Options */}
       <div className="absolute bottom-8 right-8 flex gap-4 z-20">
          <Wifi size={24} className="text-white drop-shadow-md cursor-pointer hover:opacity-80" />
          <div className="group relative">
             <Power size={24} className="text-white drop-shadow-md cursor-pointer hover:opacity-80" />
             {/* Simple Power Menu */}
             <div className="absolute bottom-8 right-0 w-32 bg-gray-900/90 backdrop-blur text-white rounded p-1 hidden group-hover:block animate-fade-in shadow-xl border border-white/10">
                <div onClick={() => restart(false)} className="px-3 py-2 hover:bg-white/10 cursor-pointer text-sm">Restart</div>
                <div onClick={() => restart(true)} className="px-3 py-2 hover:bg-white/10 cursor-pointer text-sm text-yellow-300">Safe Mode</div>
                <div onClick={shutdown} className="px-3 py-2 hover:bg-white/10 cursor-pointer text-sm">Shut down</div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default LoginScreen;
