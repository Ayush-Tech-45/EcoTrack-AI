/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Cpu, Plus, HelpCircle, Thermometer, Car, Leaf, RefreshCcw } from 'lucide-react';
import { Message } from '../types';

interface AiViewProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  onLogAisaving: (name: string, value: number, detail: string) => void;
  onClearChat: () => void;
}

export default function AiView({
  messages,
  onSendMessage,
  onLogAisaving,
  onClearChat,
}: AiViewProps) {
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || typing) return;
    setInputText("");
    setTyping(true);
    try {
      await onSendMessage(textToSend);
    } catch (err) {
      console.error(err);
    } finally {
      setTyping(false);
    }
  };

  // Quick categories
  const categories = [
    {
      title: "Energy Drawing",
      icon: <Thermometer className="w-4 h-4 text-amber-400" />,
      prompt: "Give me 3 actionable ways to lower my household electricity bill and carbon footprints this month."
    },
    {
      title: "Logistical Commutes",
      icon: <Car className="w-4 h-4 text-indigo-400" />,
      prompt: "How does driving a standard gasoline car compare to electric vehicles or public trains in terms of emissions?"
    },
    {
      title: "Dietary Adjustments",
      icon: <Leaf className="w-4 h-4 text-emerald-400" />,
      prompt: "Can you estimate the CO2 save of substituting beef with plant-based vegetarian proteins over 4 days a week?"
    }
  ];

  // Helper to parse potential raw savings for active log buttons
  const parseSavingValue = (badge?: string): { name: string; val: number } | null => {
    if (!badge) return null;
    const numMatch = badge.match(/([\d\.]+)/);
    if (numMatch) {
      const val = parseFloat(numMatch[1]);
      return {
        name: "AI Verified Carbon Save",
        val: -val // negative is offset saving
      };
    }
    return null;
  };

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[500px] flex flex-col justify-between text-left relative animate-fade-in">
      
      {/* Top Advisory bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" /> Eco Advisor AI
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Your friendly sustainability guide powered by Gemini intelligence.
          </p>
        </div>
        
        {messages.length > 1 && (
          <button
            id="chat-clear-btn"
            onClick={onClearChat}
            className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded hover:bg-rose-500/10 transition-colors"
          >
            Clear Conversation
          </button>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="my-auto max-w-xl mx-auto space-y-6 text-center px-4 shrink-0 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <Cpu className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Ask Eco Advisor anything</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Get personalized plans on scaling down packaging, switching electricity grids, or optimizing flights. Let's optimize your routine!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                id={`chat-shortcut-${idx}`}
                onClick={() => handleSend(cat.prompt)}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/30 transition-all flex items-start gap-3 text-left cursor-pointer group active:scale-99"
              >
                <div className="p-2 rounded-lg bg-slate-850 border border-slate-855 mt-0.5 group-hover:bg-slate-800 transition-colors">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{cat.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{cat.prompt}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message window */}
      {messages.length > 1 && (
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-left p-1 mb-4 select-text">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            const savingObj = parseSavingValue(m.badgeSave);

            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                  isAi ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {isAi ? 'AI' : 'ME'}
                </div>

                {/* Message Bubble Container */}
                <div className="space-y-2">
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-slate-900/60 border border-slate-800/80 text-slate-100 rounded-tl-none'
                      : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10'
                  }`}>
                    {/* Preserve line jumps */}
                    <p className="whitespace-pre-line">{m.text}</p>
                    <span className="block text-[9px] text-slate-500 mt-2 font-mono text-right">{m.timestamp}</span>
                  </div>

                  {/* Estimated Save Badge with clickable log action */}
                  {isAi && savingObj && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-[10px] text-slate-200 font-mono animate-fade-in">
                      <span className="font-semibold text-emerald-400">★ {m.badgeSave}</span>
                      <span className="w-1 h-3 border-r border-slate-800" />
                      <button
                        id={`chat-log-saving-${m.id}`}
                        onClick={() => onLogAisaving(savingObj.name, savingObj.val, `Logged via Eco Advisor AI recommendations`)}
                        className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition-all flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Log to Journal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing active feedback */}
          {typing && (
            <div className="flex gap-3 max-w-[50%] mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0">
                AI
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-slate-400 text-xs sm:text-sm rounded-tl-none flex items-center gap-2">
                <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> Thinking of carbon strategies...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      {/* Input row */}
      <div className="pt-3 border-t border-slate-800/60 shrink-0 flex gap-3">
        <input
          id="chat-input-text-field"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend(inputText);
          }}
          placeholder="Ask about solar offsets, EV vs Petrol, cold cycles, dietary saves..."
          className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
        />
        <button
          id="chat-send-submit-btn"
          disabled={!inputText.trim() || typing}
          onClick={() => handleSend(inputText)}
          className="w-12 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-45 text-slate-950 flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
