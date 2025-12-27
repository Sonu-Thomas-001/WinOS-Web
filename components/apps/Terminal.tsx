import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';

const TerminalApp: React.FC = () => {
  const { fs, currentUser } = useOS();
  const [history, setHistory] = useState<string[]>(['Microsoft Windows [Version 10.0.19045.3693]', '(c) Microsoft Corporation. All rights reserved.', '']);
  const [input, setInput] = useState('');
  const [currentDirId, setCurrentDirId] = useState<string>('guest'); // Start at user home
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Construct display path
  const pathNodes = fs.getPath(currentDirId);
  const displayPath = 'C:\\' + pathNodes.slice(1).map(n => n.name).join('\\');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setHistory(prev => [...prev, `${displayPath}> ${input}`]);
      processCommand(cmd);
      setInput('');
    }
  };

  const processCommand = (cmd: string) => {
    if (!cmd) {
        setHistory(prev => [...prev, '']);
        return;
    }

    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    let response = '';

    switch (command) {
      case 'help':
        response = 'Commands: cls, ver, date, echo, whoami, dir, cd, mkdir, type, touch';
        break;
      case 'ver':
        response = 'Microsoft Windows [Version 10.0.19045.3693]';
        break;
      case 'cls':
        setHistory([]);
        return;
      case 'date':
        response = new Date().toString();
        break;
      case 'whoami':
        response = `win-desktop\\${currentUser?.name.toLowerCase().replace(' ', '')}`;
        break;
      case 'dir':
      case 'ls':
        const contents = fs.getContents(currentDirId);
        if (contents.length === 0) {
            response = ' File Not Found';
        } else {
            response = contents.map(n => {
                const date = new Date(n.createdAt).toLocaleDateString();
                const time = new Date(n.createdAt).toLocaleTimeString();
                const type = n.type === 'folder' ? '<DIR>     ' : '          ';
                return `${date}  ${time}    ${type}    ${n.name}`;
            }).join('\n');
            response = ` Directory of ${displayPath}\n\n` + response;
        }
        break;
      case 'cd':
        if (!args[0]) {
            response = displayPath;
        } else {
            const targetId = fs.resolvePath(currentDirId, args[0]);
            if (targetId) {
                setCurrentDirId(targetId);
                setHistory(prev => [...prev, '']);
                return;
            } else {
                response = 'The system cannot find the path specified.';
            }
        }
        break;
      case 'mkdir':
        if (args[0]) {
            fs.createFolder(currentDirId, args[0]);
            response = '';
        } else {
            response = 'usage: mkdir [name]';
        }
        break;
      case 'touch':
        if (args[0]) {
            fs.createFile(currentDirId, args[0]);
            response = '';
        } else {
            response = 'usage: touch [name]';
        }
        break;
      case 'type': // Windows equivalent of cat
      case 'cat':
        if (args[0]) {
            const targetId = fs.resolvePath(currentDirId, args[0]);
            const node = targetId ? fs.getNode(targetId) : null;
            if (node && node.type === 'file') {
                response = node.content || '';
            } else {
                response = 'File not found.';
            }
        }
        break;
      case 'echo':
         // Simple echo "text" > file support
         const redirectIdx = args.indexOf('>');
         if (redirectIdx !== -1 && args[redirectIdx + 1]) {
             const text = args.slice(0, redirectIdx).join(' ').replace(/"/g, '');
             const filename = args[redirectIdx + 1];
             fs.createFile(currentDirId, filename, text);
             response = '';
         } else {
             response = args.join(' ');
         }
         break;
      default:
         response = `'${command}' is not recognized as an internal or external command.`;
    }

    if (response) {
       const lines = response.split('\n');
       setHistory(prev => [...prev, ...lines, '']);
    } else {
       setHistory(prev => [...prev, '']);
    }
  };

  return (
    <div className="h-full bg-black text-gray-200 font-mono text-sm p-2 overflow-auto" onClick={() => document.getElementById('terminal-input')?.focus()}>
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap leading-tight min-h-[1.2em]">{line}</div>
      ))}
      <div className="flex">
        <span className="mr-2">{displayPath}&gt;</span>
        <input
          id="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none flex-1 text-gray-200"
          autoFocus
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default TerminalApp;
