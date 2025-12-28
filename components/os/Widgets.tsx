import React from 'react';
import { useOS } from '../../context/OSContext';
import { Cloud, TrendingUp, Newspaper, Image, Clock } from 'lucide-react';

const Widgets: React.FC = () => {
  const { system, toggleWidgets } = useOS();

  if (!system.isWidgetsOpen) return null;

  return (
    <div 
      className="absolute top-2 bottom-14 left-2 w-[750px] bg-[#f3f3f3]/90 dark:bg-[#202020]/90 backdrop-blur-2xl rounded-lg shadow-2xl border border-white/20 dark:border-white/5 z-[9998] animate-slide-up origin-left overflow-y-auto p-6 scrollbar-hide"
    >
      <div className="flex justify-between items-center mb-6">
         <div className="text-3xl font-light text-gray-800 dark:text-gray-100">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
         <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
             {/* Profile Icon Placeholder */}
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         {/* Weather Widget */}
         <div className="bg-white dark:bg-white/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">
               <Cloud size={14} /> Weather
            </div>
            <div className="flex justify-between items-end">
               <div>
                  <div className="text-4xl font-bold text-gray-800 dark:text-white">72°</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Mostly Sunny</div>
               </div>
               <Cloud size={48} className="text-yellow-400" />
            </div>
         </div>

         {/* Stocks Widget */}
         <div className="bg-white dark:bg-white/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
             <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">
               <TrendingUp size={14} /> Market
            </div>
            <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-200">AAPL</span>
                  <span className="text-green-500">+1.25%</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-200">MSFT</span>
                  <span className="text-green-500">+0.85%</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-200">GOOGL</span>
                  <span className="text-red-500">-0.42%</span>
               </div>
            </div>
         </div>

         {/* Photos Widget - Spans 2 cols */}
         <div className="col-span-2 bg-white dark:bg-white/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-48 relative overflow-hidden group">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1874&q=80)' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
               <div className="flex items-center gap-2 text-xs font-semibold uppercase mb-1 opacity-80">
                  <Image size={14} /> OneDrive
               </div>
               <div className="font-medium">On this day</div>
            </div>
         </div>

         {/* News Widget - Infinite scroll simulation */}
         <div className="col-span-2 space-y-4 mt-2">
             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Top Stories</h3>
             {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-white/10 rounded-xl p-4 shadow-sm flex gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/20 transition-colors">
                   <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(https://source.unsplash.com/random/200x150?news&sig=${i})` }}></div>
                   <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                         <Newspaper size={12} /> CNN • 2h ago
                      </div>
                      <div className="font-medium text-gray-800 dark:text-gray-100 leading-tight">
                         Technology sector sees unprecedented growth in AI development tools...
                      </div>
                   </div>
                </div>
             ))}
         </div>
      </div>
    </div>
  );
};

export default Widgets;
