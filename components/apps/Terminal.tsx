import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';

const TerminalApp: React.FC = () => {
  const { fs, currentUser, windows, closeWindow, system } = useOS();
  const [history, setHistory] = useState<string[]>(['Microsoft Windows [Version 10.0.19045.3693]', '(c) Microsoft Corporation. All rights reserved.', '']);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [currentDirId, setCurrentDirId] = useState<string>('guest'); // Start at user home
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  // Construct display path
  const pathNodes = fs.getPath(currentDirId);
  const displayPath = 'C:\\' + pathNodes.slice(1).map(n => n.name).join('\\');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setHistory(prev => [...prev, `${displayPath}> ${input}`]);
      if (cmd) {
         setCommandHistory(prev => [cmd, ...prev]);
         setHistoryIndex(-1);
      }
      processCommand(cmd);
      setInput('');
    } else if (e.key === 'ArrowUp') {
       e.preventDefault();
       if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
       }
    } else if (e.key === 'ArrowDown') {
       e.preventDefault();
       if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
       } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput('');
       }
    } else if (e.key === 'Tab') {
       e.preventDefault();
       const parts = input.split(' ');
       const partial = parts[parts.length - 1];
       if (partial) {
          const matches = fs.getContents(currentDirId).filter(n => n.name.toLowerCase().startsWith(partial.toLowerCase()));
          if (matches.length === 1) {
             parts.pop();
             parts.push(matches[0].name);
             setInput(parts.join(' '));
          }
       }
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
    const extraLines: string[] = [];

    switch (command) {
      case 'help':
        response = 'Commands: cls, ver, date, echo, whoami, dir, cd, mkdir, type, touch, ps, kill, neofetch';
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
      case 'type': 
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
      case 'ps':
         response = 'PID    USER     STATUS    COMMAND\n';
         response += '---------------------------------\n';
         windows.forEach(win => {
             response += `${win.pid.toString().padEnd(7)} ${currentUser?.name.split(' ')[0].padEnd(9)} R         ${win.title.substring(0, 15)}\n`;
         });
         response += `8921    SYSTEM    R         System\n`;
         response += `1102    SYSTEM    S         Registry`;
         break;
      case 'kill':
         if (args[0]) {
             const pid = parseInt(args[0]);
             const win = windows.find(w => w.pid === pid);
             if (win) {
                 closeWindow(win.id);
                 response = `Sent SIGTERM to process ${pid}`;
             } else {
                 response = `Process ${pid} not found`;
             }
         } else {
             response = 'usage: kill [pid]';
         }
         break;
      case 'neofetch':
         extraLines.push(
            `    .----------.      ${currentUser?.name}@WinOS-Web`,
            `   /          / \\     ----------------`,
            `  /          /   \\    OS: WinOS 11 Web Edition`,
            ` /          /     \\   Uptime: ${Math.floor(system.uptime / 60)} mins`,
            `/__________/       \\  Packages: ${system.installedApps.length} (npm)`,
            `\\          \\       /  Shell: React Term 2.0`,
            ` \\          \\     /   Resolution: ${window.innerWidth}x${window.innerHeight}`,
            `  \\          \\   /    Theme: ${currentUser?.settings.theme}`,
            `   \\__________\\ /     CPU: Simulated Virtual Core`,
            `                      Memory: 644MB / 16GB`,
            ``
         );
         break;
      default:
         response = `'${command}' is not recognized as an internal or external command.`;
    }

    if (extraLines.length > 0) {
        setHistory(prev => [...prev, ...extraLines, '']);
    } else if (response) {
       const lines = response.split('\n');
       setHistory(prev => [...prev, ...lines, '']);
    } else {
       setHistory(prev => [...prev, '']);
    }
  };

  return (
    <div className="h-full bg-[#0c0c0c] text-gray-200 font-mono text-sm p-2 overflow-auto scrollbar-hide" onClick={() => inputRef.current?.focus()}>
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap leading-tight min-h-[1.2em]">{line}</div>
      ))}
      <div className="flex">
        <span className="mr-2 text-green-400">{displayPath}&gt;</span>
        <input
          ref={inputRef}
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
