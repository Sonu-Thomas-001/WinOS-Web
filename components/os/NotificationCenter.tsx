import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { X, Bell, BellOff, Trash2 } from 'lucide-react';

const NotificationCenter: React.FC = () => {
  const { system, notifications, clearNotification, clearAllNotifications, toggleDoNotDisturb, toggleCalendar } = useOS();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!system.isCalendarOpen) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="absolute top-2 bottom-14 right-2 w-96 bg-[#f3f3f3]/95 dark:bg-[#202020]/95 backdrop-blur-2xl rounded-lg shadow-2xl border border-white/20 dark:border-white/5 z-[9998] flex flex-col animate-slide-up origin-right overflow-hidden">
       {/* Calendar Section */}
       <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-white/5">
          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{formatDate(time)}</div>
          <div className="text-4xl font-light text-gray-800 dark:text-white mb-6">
             {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </div>
          
          {/* Mock Calendar Grid */}
          <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600">
             <div className="flex justify-between items-center mb-4 text-sm font-bold dark:text-white">
                <span>{time.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <div className="flex gap-2">
                   <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded">▲</button>
                   <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded">▼</button>
                </div>
             </div>
             <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                   <div key={d} className="font-semibold text-gray-500 mb-2">{d}</div>
                ))}
                {Array.from({length: 30}, (_, i) => i + 1).map(d => (
                   <div 
                     key={d} 
                     className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 ${d === time.getDate() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-700 dark:text-gray-300'}`}
                   >
                      {d}
                   </div>
                ))}
             </div>
          </div>
       </div>

       {/* Notifications Header */}
       <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-black/20">
          <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">Notifications</span>
          <div className="flex gap-2">
             <button 
               onClick={toggleDoNotDisturb} 
               className={`p-1.5 rounded transition-colors ${system.doNotDisturb ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500'}`}
               title={system.doNotDisturb ? "Turn off Do Not Disturb" : "Turn on Do Not Disturb"}
             >
                {system.doNotDisturb ? <BellOff size={16} /> : <Bell size={16} />}
             </button>
             {notifications.length > 0 && (
                <button 
                  onClick={clearAllNotifications} 
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-500 transition-colors"
                  title="Clear all"
                >
                   <Trash2 size={16} />
                </button>
             )}
          </div>
       </div>

       {/* Notifications List */}
       <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                <Bell size={48} className="mb-4 opacity-20" />
                No new notifications
             </div>
          ) : (
             notifications.map(notif => (
                <div key={notif.id} className="bg-white dark:bg-[#2b2b2b] rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600 relative group animate-fade-in">
                   <button 
                     onClick={(e) => { e.stopPropagation(); clearNotification(notif.id); }}
                     className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                      <X size={14} />
                   </button>
                   <div className="flex gap-3">
                      <div className={`w-1 bg-${notif.type === 'error' ? 'red' : notif.type === 'warning' ? 'yellow' : notif.type === 'success' ? 'green' : 'blue'}-500 rounded-full`}></div>
                      <div className="flex-1 min-w-0">
                         <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-0.5 uppercase">{notif.appId}</div>
                         <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">{notif.title}</div>
                         <div className="text-gray-600 dark:text-gray-300 text-sm leading-snug">{notif.message}</div>
                         <div className="text-[10px] text-gray-400 mt-2 text-right">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                   </div>
                </div>
             ))
          )}
       </div>
    </div>
  );
};

export default NotificationCenter;
