import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';

const Notepad: React.FC = () => {
  const { fs, windows, activeWindowId } = useOS();
  const [content, setContent] = useState('');
  
  // Find current window state to get fileId
  const windowState = windows.find(w => w.id === activeWindowId);
  const fileId = windowState?.fileOpen;

  useEffect(() => {
    if (fileId) {
       const file = fs.getNode(fileId);
       if (file && file.content) setContent(file.content);
    } else {
       // Only check localstorage if not opening a specific file (legacy behavior)
       const saved = localStorage.getItem('notepad_content');
       if (saved) setContent(saved);
    }
  }, [fileId, fs]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    if (!fileId) {
        localStorage.setItem('notepad_content', val);
    } else {
        // Auto-save to VFS (Simulated)
        const file = fs.getNode(fileId);
        if (file) file.content = val;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="flex gap-2 text-xs border-b border-gray-200 p-1 bg-white">
        <button className="px-2 py-0.5 hover:bg-gray-100 rounded">File</button>
        <button className="px-2 py-0.5 hover:bg-gray-100 rounded">Edit</button>
        <button className="px-2 py-0.5 hover:bg-gray-100 rounded">View</button>
      </div>
      <textarea
        className="flex-1 w-full p-2 resize-none outline-none font-mono text-sm"
        value={content}
        onChange={handleChange}
        placeholder="Type here..."
        spellCheck={false}
      />
      <div className="bg-gray-50 border-t border-gray-200 px-2 py-0.5 text-[10px] text-gray-500 flex justify-end gap-4">
         <span>{fileId ? 'Saved' : 'Local Draft'}</span>
         <span>UTF-8</span>
         <span>Windows (CRLF)</span>
      </div>
    </div>
  );
};

export default Notepad;
