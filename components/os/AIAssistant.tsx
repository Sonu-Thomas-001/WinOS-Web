import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Send, User, Bot, Sparkles, X } from 'lucide-react';
import { AppID } from '../../types';

const AIAssistant: React.FC = () => {
  const { system, toggleCopilot, launchApp, fs, setTheme, addNotification } = useOS();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
     { role: 'assistant', text: 'Hi! I\'m your WinOS Assistant. How can I help you today? You can ask me to open apps, change settings, or manage your files.' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');

    // Simulate AI Processing
    setTimeout(() => {
       const lower = userText.toLowerCase();
       let response = "I'm sorry, I didn't quite catch that.";

       // Intent Matching (Simulation)
       if (lower.includes('open')) {
          if (lower.includes('notepad')) {
             launchApp(AppID.NOTEPAD);
             response = "I've opened Notepad for you.";
          } else if (lower.includes('browser') || lower.includes('internet') || lower.includes('edge')) {
             launchApp(AppID.BROWSER);
             response = "Opening Edge Browser...";
          } else if (lower.includes('terminal')) {
             launchApp(AppID.TERMINAL);
             response = "Terminal started.";
          } else if (lower.includes('code')) {
             launchApp(AppID.VSCODE);
             response = "Launching VS Code.";
          } else if (lower.includes('settings')) {
             launchApp(AppID.SETTINGS);
             response = "Opening Settings.";
          } else {
             response = "I can open apps like Notepad, Browser, Terminal, and VS Code. Which one would you like?";
          }
       } else if (lower.includes('trash') || lower.includes('recycle')) {
          if (lower.includes('empty') || lower.includes('clear')) {
             fs.emptyTrash();
             response = "Recycle Bin has been emptied.";
          } else {
             launchApp(AppID.EXPLORER); // Ideally navigate to trash, but standard explorer launch is fine for now
             response = "Opening Recycle Bin.";
          }
       } else if (lower.includes('theme') || lower.includes('mode')) {
          if (lower.includes('dark')) {
             setTheme('dark');
             response = "Switched to Dark Mode.";
          } else if (lower.includes('light')) {
             setTheme('light');
             response = "Switched to Light Mode.";
          }
       } else if (lower.includes('wallpaper') || lower.includes('background')) {
          // AI Wallpaper simulation
          response = "Generating a new wallpaper for you...";
          addNotification("AI Assistant", "Applying new wallpaper...", "info");
          // Logic to actually change wallpaper would go here if exposed in context properly,
          // for now we acknowledge the intent.
       } else if (lower.includes('joke')) {
          response = "Why do programmers prefer dark mode? Because light attracts bugs.";
       } else if (lower.includes('help')) {
          response = "Try asking: 'Open Notepad', 'Switch to dark mode', 'Empty trash', or 'Generate wallpaper'.";
       }

       setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
     if (e.key === 'Enter') handleSend();
  };

  if (!system.isCopilotOpen) return null;

  return (
    <div className="absolute top-0 right-0 bottom-12 w-96 bg-white/95 dark:bg-[#202020]/95 backdrop-blur-2xl shadow-2xl border-l border-white/20 dark:border-white/5 z-[9999] flex flex-col animate-slide-up origin-right">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
         <div className="flex items-center gap-2 font-semibold text-lg dark:text-white">
            <Sparkles size={20} className="text-blue-500" />
            Copilot
            <span className="text-xs bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded text-gray-500 font-normal">PREVIEW</span>
         </div>
         <button onClick={toggleCopilot} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full dark:text-white">
            <X size={18} />
         </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  {msg.role === 'assistant' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-gray-700 dark:text-gray-300" />}
               </div>
               <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'assistant' ? 'bg-gray-100 dark:bg-white/10 dark:text-gray-200 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                  {msg.text}
               </div>
            </div>
         ))}
         <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/20">
         <div className="relative">
            <input 
               type="text" 
               className="w-full bg-white dark:bg-[#2b2b2b] border border-gray-300 dark:border-gray-600 rounded-full py-3 pl-4 pr-12 shadow-sm focus:outline-none focus:border-blue-500 dark:text-white"
               placeholder="Ask me anything..."
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={handleKeyDown}
               autoFocus
            />
            <button 
               className="absolute right-2 top-2 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
               onClick={handleSend}
               disabled={!input.trim()}
            >
               <Send size={16} />
            </button>
         </div>
         <div className="text-center mt-2 text-[10px] text-gray-500">
            AI can make mistakes. Consider checking important information.
         </div>
      </div>
    </div>
  );
};

export default AIAssistant;
