import React, { useState } from 'react';
import { X, Eye, Code, Copy, Download, Monitor, Smartphone, Check, ShieldCheck } from 'lucide-react';
import { marked } from 'marked';

export default function ArtifactViewer({ artifact, onClose }) {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'code'
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [copied, setCopied] = useState(false);

  if (!artifact) return null;

  const isHtml = artifact.artifact_type === 'html';

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = isHtml ? 'html' : 'md';
    const blob = new Blob([artifact.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${artifact.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full lg:w-[500px] xl:w-[600px] h-full glass border-l border-rose-900/30 flex flex-col z-30 shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-rose-900/30 flex items-center justify-between glass-light">
        <div className="flex items-center space-x-2.5 overflow-hidden pr-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
            isHtml
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {artifact.artifact_type}
          </span>
          <h3 className="font-bold text-white text-sm truncate">{artifact.title}</h3>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-rose-900/40 text-rose-300/70 hover:text-white transition-colors"
          title="Close Artifact Viewer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar Controls */}
      <div className="px-4 py-2.5 bg-rose-950/40 border-b border-rose-900/20 flex items-center justify-between text-xs">
        {/* View mode toggle */}
        <div className="flex items-center bg-rose-950/80 p-1 rounded-xl border border-rose-800/40">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              viewMode === 'preview' ? 'bg-gradient-to-r from-rose-700 to-amber-500 text-white font-bold shadow-sm' : 'text-rose-300/60 hover:text-rose-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              viewMode === 'code' ? 'bg-gradient-to-r from-rose-700 to-amber-500 text-white font-bold shadow-sm' : 'text-rose-300/60 hover:text-rose-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Source Code</span>
          </button>
        </div>

        {/* Device toggle (for Preview) & Export Actions */}
        <div className="flex items-center space-x-2">
          {viewMode === 'preview' && isHtml && (
            <div className="flex items-center bg-rose-950/80 p-1 rounded-xl border border-rose-800/40">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-lg ${deviceMode === 'desktop' ? 'bg-rose-800 text-white' : 'text-rose-400/60'}`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-lg ${deviceMode === 'mobile' ? 'bg-rose-800 text-white' : 'text-rose-400/60'}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl glass-light hover:bg-rose-900/40 text-rose-200 transition-colors border border-rose-800/30"
            title="Copy artifact code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl glass-light hover:bg-rose-900/40 text-rose-200 transition-colors border border-rose-800/30"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Security Isolation Banner for HTML */}
      {isHtml && (
        <div className="px-4 py-2 bg-emerald-950/30 border-b border-emerald-900/30 text-[11px] text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">Sandboxed Iframe Isolation Active</span>
          </div>
          <span className="text-[10px] opacity-75 font-mono">sandbox="allow-scripts"</span>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 bg-[#0f0508]/80 flex items-center justify-center">
        {viewMode === 'code' ? (
          <pre className="w-full h-full p-4 rounded-2xl glass border border-rose-900/30 font-mono text-xs text-rose-200 overflow-auto whitespace-pre-wrap select-text">
            {artifact.content}
          </pre>
        ) : isHtml ? (
          /* Secure Sandboxed Iframe Preview */
          <div className={`h-full transition-all duration-300 ${deviceMode === 'mobile' ? 'w-[340px] max-h-[640px] border-4 border-rose-900/40 rounded-3xl overflow-hidden shadow-2xl' : 'w-full'}`}>
            <iframe
              title={artifact.title}
              srcDoc={artifact.content}
              sandbox="allow-scripts"
              className="w-full h-full border-0 rounded-2xl bg-white"
            />
          </div>
        ) : (
          /* Markdown Render Preview */
          <div className="w-full h-full p-6 rounded-2xl glass border border-rose-900/30 overflow-y-auto md-body">
            <div dangerouslySetInnerHTML={{ __html: marked.parse(artifact.content || '') }} />
          </div>
        )}
      </div>
    </div>
  );
}
