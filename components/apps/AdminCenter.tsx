import React from 'react';
import { useOS } from '../../context/OSContext';
import { ShieldCheck, Activity, Users, Settings, Server, Globe, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminCenter: React.FC = () => {
  const { system, users } = useOS();

  return (
    <div className="flex h-full bg-[#f8f9fa] dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#001529] text-gray-300 flex flex-col">
         <div className="h-14 flex items-center px-6 font-bold text-white text-lg tracking-wide border-b border-white/10">
            <ShieldCheck className="mr-2 text-blue-400" /> Admin Center
         </div>
         <div className="p-4 space-y-1">
            <div className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer flex items-center gap-3">
               <Activity size={18} /> Dashboard
            </div>
            <div className="px-4 py-2 hover:bg-white/5 rounded cursor-pointer flex items-center gap-3">
               <Users size={18} /> User Management
            </div>
            <div className="px-4 py-2 hover:bg-white/5 rounded cursor-pointer flex items-center gap-3">
               <Settings size={18} /> Policies
            </div>
            <div className="px-4 py-2 hover:bg-white/5 rounded cursor-pointer flex items-center gap-3">
               <Globe size={18} /> Network Map
            </div>
            <div className="px-4 py-2 hover:bg-white/5 rounded cursor-pointer flex items-center gap-3">
               <AlertTriangle size={18} /> Threat Intel
            </div>
         </div>
         <div className="mt-auto p-4 border-t border-white/10">
             <div className="text-xs text-gray-500 uppercase font-semibold mb-2">System Status</div>
             <div className="flex items-center gap-2 text-sm text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                All Systems Operational
             </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
         <header className="h-14 bg-white dark:bg-[#202020] border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-8 shadow-sm">
            <h2 className="text-xl font-semibold">Overview</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500">
               <span>Last updated: just now</span>
               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">A</div>
            </div>
         </header>

         <div className="p-8 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
               <StatCard title="Active Users" value={users.length.toString()} icon={<Users className="text-blue-500" />} />
               <StatCard title="Network Traffic" value="1.2 GB/s" icon={<Globe className="text-purple-500" />} />
               <StatCard title="Threats Blocked" value="0" icon={<ShieldCheck className="text-green-500" />} />
               <StatCard title="Server Load" value="12%" icon={<Server className="text-orange-500" />} />
            </div>

            {/* Health & Security Section */}
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white dark:bg-[#2b2b2b] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">System Health</h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span>CPU Usage</span>
                        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 w-[24%]"></div>
                        </div>
                        <span className="text-sm w-10 text-right">24%</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span>Memory Usage</span>
                        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-purple-500 w-[45%]"></div>
                        </div>
                        <span className="text-sm w-10 text-right">45%</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span>Storage (C:)</span>
                        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-green-500 w-[68%]"></div>
                        </div>
                        <span className="text-sm w-10 text-right">68%</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-[#2b2b2b] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4">Security Status</h3>
                  <div className="space-y-3">
                     <StatusItem label="Firewall" status="active" />
                     <StatusItem label="Anti-Malware" status="active" />
                     <StatusItem label="Data Loss Prevention" status="warning" message="Policy update required" />
                     <StatusItem label="VPN Gateway" status={system.network.isVpnConnected ? "active" : "inactive"} />
                  </div>
               </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-[#2b2b2b] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 font-semibold">
                  Recent User Activity
               </div>
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-white/5 text-gray-500">
                     <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Last Login</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                     {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                           <td className="px-6 py-3 flex items-center gap-2">
                              <img src={u.avatar} className="w-6 h-6 rounded-full" alt="" />
                              {u.name}
                           </td>
                           <td className="px-6 py-3 capitalize">{u.type}</td>
                           <td className="px-6 py-3">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                           </td>
                           <td className="px-6 py-3 text-gray-500">Today, 10:42 AM</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: any) => (
   <div className="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div>
         <div className="text-gray-500 text-sm font-medium">{title}</div>
         <div className="text-2xl font-bold mt-1">{value}</div>
      </div>
      <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-full">
         {icon}
      </div>
   </div>
);

const StatusItem = ({ label, status, message }: any) => (
   <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
         {message && <span className="text-xs text-gray-500">{message}</span>}
         {status === 'active' && <CheckCircle size={16} className="text-green-500" />}
         {status === 'warning' && <AlertTriangle size={16} className="text-yellow-500" />}
         {status === 'inactive' && <div className="w-2 h-2 bg-gray-300 rounded-full"></div>}
      </div>
   </div>
);

export default AdminCenter;
