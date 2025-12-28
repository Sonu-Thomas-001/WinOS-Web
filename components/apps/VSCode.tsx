import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Files, Search, GitBranch, Play, Settings as SettingsIcon, ChevronRight, ChevronDown, X } from 'lucide-react';

const VSCode: React.FC = () => {
  const [activeFile, setActiveFile] = useState('index.html');
  const [files, setFiles] = useState<{ [key: string]: string }>({
    'index.html': `<div class="container">\n  <h1>Hello WinOS</h1>\n  <p>Edit me!</p>\n  <button>Click Me</button>\n</div>`,
    'style.css': `body { font-family: sans-serif; padding: 20px; }\n.container { text-align: center; }\nbutton { padding: 10px 20px; background: #0078d4; color: white; border: none; rounded: 4px; }`,
    'script.js': `document.querySelector('button').onclick = () => alert('Clicked!');`
  });
  const [showPreview, setShowPreview] = useState(true);

  const updateFile = (content: string) => {
    setFiles(prev => ({ ...prev, [activeFile]: content }));
  };

  const getPreviewSrc = () => {
    const html = files['index.html'];
    const css = `<style>${files['style.css']}</style>`;
    const js = `<script>${files['script.js']}<\/script>`;
    return `data:text/html;charset=utf-8,${encodeURIComponent(html + css + js)}`;
  };

  return (
    <div className="flex h-full bg-[#1e1e1e] text-[#cccccc] font-sans">
      {/* Activity Bar */}
      <div className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-4 border-r border-[#2b2b2b]">
         <Files size={24} className="text-white cursor-pointer" />
         <Search size={24} className="text-[#858585] hover:text-white cursor-pointer" />
         <GitBranch size={24} className="text-[#858585] hover:text-white cursor-pointer" />
         <div className="flex-1" />
         <SettingsIcon size={24} className="text-[#858585] hover:text-white cursor-pointer mb-2" />
      </div>

      {/* Sidebar */}
      <div className="w-48 bg-[#252526] flex flex-col text-sm border-r border-[#2b2b2b]">
         <div className="p-2 text-xs font-bold uppercase tracking-wide">Explorer</div>
         <div className="flex items-center px-1 py-1 cursor-pointer hover:bg-[#2a2d2e]">
             <ChevronDown size={14} className="mr-1" />
             <span className="font-bold text-xs">MY-PROJECT</span>
         </div>
         <div className="pl-2">
             {Object.keys(files).map(fileName => (
                 <div 
                   key={fileName}
                   className={`flex items-center px-4 py-1 cursor-pointer hover:bg-[#2a2d2e] ${activeFile === fileName ? 'bg-[#37373d] text-white' : ''}`}
                   onClick={() => setActiveFile(fileName)}
                 >
                    <span className="ml-1">{fileName}</span>
                 </div>
             ))}
         </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
         {/* Tabs */}
         <div className="flex bg-[#2d2d2d] overflow-x-auto">
             {Object.keys(files).map(fileName => (
                 <div 
                   key={fileName}
                   className={`px-3 py-2 flex items-center gap-2 text-sm border-r border-[#1e1e1e] cursor-pointer min-w-[100px] ${activeFile === fileName ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#0078d4]' : 'bg-[#2d2d2d] text-[#969696]'}`}
                   onClick={() => setActiveFile(fileName)}
                 >
                    <span>{fileName}</span>
                    <X size={12} className="hover:bg-[#4d4d4d] rounded p-0.5" />
                 </div>
             ))}
         </div>

         <div className="flex-1 flex">
             {/* Code Input */}
             <div className="flex-1 relative">
                 <textarea 
                    className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm outline-none resize-none"
                    value={files[activeFile]}
                    onChange={(e) => updateFile(e.target.value)}
                    spellCheck={false}
                 />
                 <div className="absolute top-2 right-4 flex gap-2">
                    <button 
                      className={`p-1 rounded ${showPreview ? 'bg-[#0078d4] text-white' : 'bg-[#3c3c3c] text-gray-300'}`}
                      onClick={() => setShowPreview(!showPreview)}
                      title="Toggle Preview"
                    >
                       <Play size={14} />
                    </button>
                 </div>
             </div>

             {/* Live Preview */}
             {showPreview && (
                <div className="w-1/2 border-l border-[#2b2b2b] bg-white">
                   <iframe 
                      src={getPreviewSrc()}
                      className="w-full h-full border-none"
                      title="Preview"
                   />
                </div>
             )}
         </div>
         
         {/* Status Bar */}
         <div className="h-6 bg-[#007fd4] flex items-center px-4 text-white text-xs gap-4">
             <div className="flex items-center gap-1"><GitBranch size={10} /> main</div>
             <div>0 errors</div>
             <div className="flex-1" />
             <div>Ln 1, Col 1</div>
             <div>UTF-8</div>
             <div>{activeFile.endsWith('.js') ? 'JavaScript' : activeFile.endsWith('.css') ? 'CSS' : 'HTML'}</div>
         </div>
      </div>
    </div>
  );
};

export default VSCode;
