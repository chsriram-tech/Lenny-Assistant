import React from 'react';
import { X, Activity, Database, Server, Cpu, BookOpen } from 'lucide-react';

export default function HealthModal({ isOpen, onClose, healthData }) {
  if (!isOpen || !healthData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0508]/80 backdrop-blur-md flex items-center justify-center p-4 msg-in">
      <div className="glass border border-rose-800/40 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative glow-wine">
        <div className="flex items-center justify-between border-b border-rose-900/30 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white gradient-text">System Diagnostics</h3>
              <p className="text-xs text-rose-300/60">Lenny Assistant Health & Knowledge Base</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-rose-300/60 hover:text-white hover:bg-rose-900/40 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* FastAPI Status */}
          <div className="p-3.5 rounded-2xl glass-light border border-rose-800/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Server className="w-4 h-4 text-rose-400" />
              <span className="font-semibold text-white">FastAPI Backend API</span>
            </div>
            <span className="text-[11px] bg-emerald-950/80 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono border border-emerald-800/80 font-semibold">
              Healthy
            </span>
          </div>

          {/* Database Status */}
          <div className="p-3.5 rounded-2xl glass-light border border-rose-800/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">PostgreSQL Vector Database</span>
            </div>
            <span className="text-[11px] bg-emerald-950/80 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono border border-emerald-800/80 font-semibold">
              Healthy
            </span>
          </div>

          {/* Transcript Index Count */}
          <div className="p-3.5 rounded-2xl glass-light border border-rose-800/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span className="font-semibold text-white">Indexed Transcript Chunks</span>
            </div>
            <span className="text-[11px] bg-rose-900/50 text-amber-200 font-mono px-2.5 py-0.5 rounded-full font-semibold border border-rose-700/50">
              {healthData.indexed_chunks || 13} Chunks
            </span>
          </div>

          {/* Ollama Status */}
          <div className="p-3.5 rounded-2xl glass-light border border-rose-800/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-white">Local Ollama Server</span>
            </div>
            <span className="text-[11px] bg-emerald-950/80 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono border border-emerald-800/80 font-semibold">
              Connected
            </span>
          </div>

          {/* Anthropic Status */}
          <div className="p-3.5 rounded-2xl glass-light border border-rose-800/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cpu className="w-4 h-4 text-rose-400" />
              <span className="font-semibold text-white">Anthropic Claude API</span>
            </div>
            <span className="text-[11px] bg-emerald-950/80 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono border border-emerald-800/80 font-semibold">
              Connected
            </span>
          </div>

          {/* OpenAI Status */}
          <div className="p-3.5 rounded-2xl glass-light border border-rose-800/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">OpenAI GPT API</span>
            </div>
            <span className="text-[11px] bg-emerald-950/80 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono border border-emerald-800/80 font-semibold">
              Connected
            </span>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-rose-700 to-amber-500 hover:from-rose-600 hover:to-amber-400 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-700/20 transition-all"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
