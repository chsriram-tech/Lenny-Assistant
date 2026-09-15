import React from 'react';
import { Plus, MessageSquare, Trash2, Cpu, Activity, Sparkles, BookOpen } from 'lucide-react';

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  currentProvider,
  currentModel,
  healthData,
  onOpenModelModal,
  onOpenHealthModal
}) {
  return (
    <aside className="w-64 md:w-72 glass border-r border-rose-900/30 flex flex-col h-full select-none z-20 shrink-0 relative">
      {/* Brand Header — Dominant Neon Gold & Crimson Pill */}
      <div className="p-3 border-b border-rose-900/30">
        <div className="gold-glow-pill p-3.5 rounded-2xl flex items-center space-x-3 transition-all">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-600 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
            <Sparkles className="w-6 h-6 text-slate-950 animate-pulse" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-amber-300 text-sm tracking-widest uppercase text-glow truncate">
              Lenny Assistant
            </h1>
            <p className="text-[10px] text-amber-200/90 font-bold flex items-center gap-1.5 mt-0.5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot"></span>
              Transcripts RAG
            </p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-400 text-white font-bold text-xs md:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-700/25 transition-all duration-200 active:scale-[0.98] group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>New Growth Session</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="text-[10px] font-bold text-rose-300/50 px-2.5 mb-2 uppercase tracking-widest flex items-center justify-between">
          <span>History</span>
          <span className="text-[9px] bg-rose-950/80 text-amber-300 px-1.5 py-0.5 rounded border border-rose-800/40 font-mono">
            {sessions.length}
          </span>
        </div>
        {sessions.length === 0 ? (
          <div className="text-xs text-rose-300/40 text-center py-8 px-4 italic space-y-2">
            <BookOpen className="w-6 h-6 mx-auto text-rose-400/30" />
            <p>No previous sessions. Start a new chat above!</p>
          </div>
        ) : (
          sessions.map((sess) => {
            const isActive = sess.id === activeSessionId;
            return (
              <div
                key={sess.id}
                onClick={() => onSelectSession(sess.id)}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                  isActive
                    ? 'bg-rose-950/60 text-rose-100 font-semibold border border-rose-500/40 shadow-sm shadow-rose-500/10'
                    : 'text-rose-200/70 hover:bg-rose-900/20 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate pr-2">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-rose-500/40'}`} />
                  <span className="truncate">{sess.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(sess.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-rose-400/60 transition-all rounded hover:bg-rose-950/40"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Provider & Health Status Controls */}
      <div className="p-3 border-t border-rose-900/30 space-y-2 bg-rose-950/30">
        {/* Model Selector Card */}
        <button
          onClick={onOpenModelModal}
          className="w-full p-2.5 rounded-xl glass-light hover:bg-rose-900/30 border border-rose-800/30 flex items-center justify-between text-left transition-all group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] text-rose-300/60 font-medium leading-none uppercase tracking-wider">Active LLM</div>
              <div className="text-xs font-semibold text-rose-100 capitalize truncate mt-1">
                {currentProvider} <span className="text-amber-400 font-mono">({currentModel})</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] bg-rose-950/80 text-amber-300 border border-rose-700/50 px-2 py-0.5 rounded-md font-mono">
            Switch
          </span>
        </button>

        {/* System Health Badge */}
        <button
          onClick={onOpenHealthModal}
          className="w-full p-2.5 rounded-xl glass-light hover:bg-rose-900/30 border border-rose-800/20 flex items-center justify-between text-xs text-rose-300/80 transition-all"
        >
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium">System Diagnostics</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">Online</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
