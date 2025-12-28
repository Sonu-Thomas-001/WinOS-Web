import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Activity, X, Cpu, Server } from 'lucide-react';

const TaskManager: React.FC = () => {
  const { windows, closeWindow, system, crashApp } = useOS();
  const [activeTab, setActiveTab] = useState<'processes' | 'performance'>('processes');
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(40).fill(0));
  const [currentCpu, setCurrentCpu] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
       const usage = Math.floor(Math.random() * 30) + 5; // Sim random cpu
       setCurrentCpu(usage);
       setCpuHistory(prev => {
          const next = [...prev, usage];
          return next.slice(-40);
       });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] dark:bg-[#1f1f1f] text-sm">
      {/* Tabs */}
      <div className="flex bg-white dark:bg-[#2b2b2b] border-b border-gray-200 dark:border-gray-700">
         <button 
            className={`px-4 py-2 flex items-center gap-2 border-b-2 ${activeTab === 'processes' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 dark:text-gray-400'}`}
            onClick={() => setActiveTab('processes')}
         >
            <Activity size={14} /> Processes
         </button>
         <button 
            className={`px-4 py-2 flex items-center gap-2 border-b-2 ${activeTab === 'performance' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 dark:text-gray-400'}`}
            onClick={() => setActiveTab('performance')}
         >
            <Cpu size={14} /> Performance
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'processes' && (
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="text-xs text-gray-500 border-b border-gray-300 dark:border-gray-600">
                    <th className="pb-2 pl-2">Name</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">CPU</th>
                    <th className="pb-2">Memory</th>
                    <th className="pb-2 text-right pr-2">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {windows.map(win => (
                    <tr key={win.id} className="hover:bg-white dark:hover:bg-white/5 border-b border-gray-200 dark:border-gray-700/50">
                       <td className="py-2 pl-2 font-medium text-gray-800 dark:text-gray-200">{win.title}</td>
                       <td className={`py-2 ${win.isCrashed ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                          {win.isCrashed ? 'Not Responding' : 'Running'}
                       </td>
                       <td className="py-2 text-gray-600 dark:text-gray-400">{win.isCrashed ? '0%' : Math.floor(Math.random() * 5) + '%'}</td>
                       <td className="py-2 text-gray-600 dark:text-gray-400">{Math.floor(Math.random() * 200) + 50} MB</td>
                       <td className="py-2 text-right pr-2 flex justify-end gap-2">
                          {!win.isCrashed && (
                             <button onClick={() => crashApp(win.id)} className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                                Crash
                             </button>
                          )}
                          <button onClick={() => closeWindow(win.id)} className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded">
                             End Task
                          </button>
                       </td>
                    </tr>
                 ))}
                 {windows.length === 0 && (
                    <tr>
                       <td colSpan={5} className="py-4 text-center text-gray-500">No active applications</td>
                    </tr>
                 )}
              </tbody>
           </table>
        )}

        {activeTab === 'performance' && (
           <div className="grid grid-cols-2 gap-4">
              {/* CPU Graph */}
              <div className="bg-white dark:bg-[#2b2b2b] p-4 rounded border border-gray-200 dark:border-gray-700 shadow-sm col-span-2">
                 <div className="flex justify-between mb-4">
                    <div>
                       <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">CPU</h3>
                       <p className="text-2xl font-light text-blue-600 dark:text-blue-400">{currentCpu}%</p>
                    </div>
                    <Cpu className="text-gray-300 dark:text-gray-600" size={32} />
                 </div>
                 <div className="h-40 flex items-end gap-1">
                    {cpuHistory.map((val, i) => (
                       <div 
                         key={i} 
                         className="flex-1 bg-blue-100 dark:bg-blue-900/50 border-t border-blue-400 dark:border-blue-500" 
                         style={{ height: `${val}%` }}
                       ></div>
                    ))}
                 </div>
              </div>

              {/* Memory Stats */}
              <div className="bg-white dark:bg-[#2b2b2b] p-4 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                 <div className="flex items-center gap-3 mb-2">
                    <Server size={20} className="text-purple-500" />
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">Memory</h3>
                 </div>
                 <div className="text-2xl font-light text-purple-600 dark:text-purple-400">4.2 / 16.0 GB</div>
                 <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-500 h-full w-[26%]"></div>
                 </div>
              </div>
              
              {/* Uptime */}
              <div className="bg-white dark:bg-[#2b2b2b] p-4 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                 <div className="flex items-center gap-3 mb-2">
                    <Activity size={20} className="text-green-500" />
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">System Uptime</h3>
                 </div>
                 <div className="text-2xl font-light text-gray-700 dark:text-gray-300">
                    {new Date(system.uptime * 1000).toISOString().substr(11, 8)}
                 </div>
              </div>
           </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#2b2b2b] border-t border-gray-200 dark:border-gray-700 p-1 px-4 text-xs text-gray-500 flex justify-between">
          <span>Processes: {windows.length}</span>
          <span>Up time: {Math.floor(system.uptime / 60)}m</span>
      </div>
    </div>
  );
};

export default TaskManager;
