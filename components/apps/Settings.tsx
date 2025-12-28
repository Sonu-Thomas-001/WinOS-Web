import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { AppID } from '../../types';
import { APPS } from '../../constants';
import { Monitor, Volume2, Moon, Sun, Battery, Wifi, Shield, Lock, Palette, Laptop, Activity } from 'lucide-react';

const SettingsApp: React.FC = () => {
  const { system, setTheme, setAccentColor, currentUser, setFirewallRule, setSystemSetting } = useOS();
  const [activeTab, setActiveTab] = useState('System');

  const tabs = [
    { name: 'System', icon: Laptop },
    { name: 'Personalization', icon: Palette },
    { name: 'Privacy & Security', icon: Shield },
    { name: 'Audit Logs', icon: Activity },
  ];

  const colors = [
    { name: 'Blue', class: 'bg-blue-500', value: 'blue' },
    { name: 'Purple', class: 'bg-purple-500', value: 'purple' },
    { name: 'Green', class: 'bg-green-500', value: 'green' },
    { name: 'Red', class: 'bg-red-500', value: 'red' },
    { name: 'Orange', class: 'bg-orange-500', value: 'orange' },
  ];

  return (
    <div className="h-full flex bg-[#f3f3f3] dark:bg-[#1f1f1f]">
      {/* Sidebar */}
      <div className="w-64 bg-[#f0f0f0] dark:bg-[#1a1a1a] p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-6 p-2">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-${currentUser?.settings.accentColor}-500`}>
              {currentUser?.name[0]}
           </div>
           <div>
              <div className="font-semibold dark:text-white">{currentUser?.name}</div>
              <div className="text-xs text-gray-500">Local Account</div>
           </div>
        </div>
        
        {tabs.map(tab => (
           <div 
             key={tab.name} 
             className={`p-2 rounded cursor-pointer text-sm flex items-center gap-3 ${activeTab === tab.name ? 'bg-white dark:bg-white/10 shadow-sm font-medium' : 'hover:bg-gray-200 dark:hover:bg-white/5'} dark:text-gray-200`}
             onClick={() => setActiveTab(tab.name)}
           >
             <tab.icon size={16} />
             {tab.name}
           </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
         <h1 className="text-2xl font-semibold mb-6 dark:text-white">{activeTab}</h1>
         
         {activeTab === 'Personalization' && (
            <div className="space-y-6 animate-fade-in">
               <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
                  <h3 className="font-medium mb-4 dark:text-white">Select a theme to apply</h3>
                  <div className="flex gap-4">
                     <div 
                       onClick={() => setTheme('light')}
                       className={`cursor-pointer border-2 rounded-lg overflow-hidden w-32 ${currentUser?.settings.theme === 'light' ? 'border-blue-500' : 'border-transparent'}`}
                     >
                        <div className="h-20 bg-blue-100 flex items-center justify-center text-gray-800"><Sun /></div>
                        <div className="p-2 text-xs text-center dark:bg-gray-800 dark:text-gray-300">Light</div>
                     </div>
                     <div 
                       onClick={() => setTheme('dark')}
                       className={`cursor-pointer border-2 rounded-lg overflow-hidden w-32 ${currentUser?.settings.theme === 'dark' ? 'border-blue-500' : 'border-transparent'}`}
                     >
                        <div className="h-20 bg-gray-900 flex items-center justify-center text-white"><Moon /></div>
                        <div className="p-2 text-xs text-center dark:bg-gray-800 dark:text-gray-300">Dark</div>
                     </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
                  <h3 className="font-medium mb-4 dark:text-white">Accent Color</h3>
                  <div className="flex gap-3">
                     {colors.map(c => (
                        <div 
                           key={c.value}
                           onClick={() => setAccentColor(c.value)}
                           className={`w-10 h-10 rounded-full cursor-pointer ${c.class} flex items-center justify-center hover:scale-110 transition-transform ${currentUser?.settings.accentColor === c.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                        >
                           {currentUser?.settings.accentColor === c.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'System' && (
             <div className="space-y-4 animate-fade-in">
                <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <Monitor className="text-gray-500" />
                      <div>
                         <div className="text-sm font-medium dark:text-white">Display Scale</div>
                         <div className="text-xs text-gray-500">Make text and apps bigger</div>
                      </div>
                   </div>
                   <select 
                     className="bg-gray-100 dark:bg-gray-700 dark:text-white border-none rounded px-2 py-1 text-sm outline-none"
                     value={system.displayScale}
                     onChange={(e) => setSystemSetting('displayScale', parseInt(e.target.value))}
                   >
                      <option value="100">100% (Recommended)</option>
                      <option value="125">125%</option>
                      <option value="150">150%</option>
                   </select>
                </div>

                <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <Battery className="text-gray-500" />
                      <div>
                         <div className="text-sm font-medium dark:text-white">Power Mode</div>
                         <div className="text-xs text-gray-500">Optimize for battery or performance</div>
                      </div>
                   </div>
                   <select 
                     className="bg-gray-100 dark:bg-gray-700 dark:text-white border-none rounded px-2 py-1 text-sm outline-none"
                     value={system.powerMode}
                     onChange={(e) => setSystemSetting('powerMode', e.target.value)}
                   >
                      <option value="balanced">Balanced</option>
                      <option value="performance">Best Performance</option>
                      <option value="saver">Best Power Efficiency</option>
                   </select>
                </div>
             </div>
         )}

         {activeTab === 'Privacy & Security' && (
            <div className="space-y-4 animate-fade-in">
                <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
                   <div className="flex items-center gap-2 mb-4">
                      <Shield className="text-green-500" />
                      <h3 className="font-semibold dark:text-white">Firewall & Network Protection</h3>
                   </div>
                   <p className="text-sm text-gray-500 mb-4">Block apps from accessing the network or launching.</p>
                   
                   <div className="space-y-2">
                      {Object.values(APPS).map(app => (
                         <div key={app.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <div className="flex items-center gap-3">
                               <div className="bg-gray-100 dark:bg-white/10 p-1.5 rounded"><app.icon size={16} /></div>
                               <span className="text-sm dark:text-gray-200">{app.title}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                               <input 
                                 type="checkbox" 
                                 className="sr-only peer" 
                                 checked={!system.firewallRules.includes(app.id)} 
                                 onChange={(e) => setFirewallRule(app.id, !e.target.checked)}
                               />
                               <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                            </label>
                         </div>
                      ))}
                   </div>
                </div>
            </div>
         )}

         {activeTab === 'Audit Logs' && (
            <div className="bg-white dark:bg-[#2b2b2b] rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden animate-fade-in">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 dark:bg-white/5 text-xs text-gray-500 dark:text-gray-400">
                     <tr>
                        <th className="p-3">Time</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Details</th>
                        <th className="p-3">Severity</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {system.auditLog.map(log => (
                        <tr key={log.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5">
                           <td className="p-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                           <td className="p-3 font-medium dark:text-gray-200">{log.action}</td>
                           <td className="p-3 text-gray-600 dark:text-gray-300">{log.details}</td>
                           <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium 
                                 ${log.severity === 'error' ? 'bg-red-100 text-red-700' : 
                                   log.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' : 
                                   'bg-blue-100 text-blue-700'}`}>
                                 {log.severity.toUpperCase()}
                              </span>
                           </td>
                        </tr>
                     ))}
                     {system.auditLog.length === 0 && (
                        <tr><td colSpan={4} className="p-4 text-center text-gray-500">No logs available</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  );
};

export default SettingsApp;
