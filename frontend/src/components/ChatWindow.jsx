import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  ExternalLink,
  FileText,
  Code,
  ChevronDown,
  ChevronUp,
  Compass,
  Zap,
  Target,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { marked } from 'marked';

export default function ChatWindow({
  messages,
  loading,
  onSendMessage,
  onTriggerShip30,
  onGenerateArtifact,
  onViewArtifact,
  currentProvider,
  currentModel
}) {
  const [inputMessage, setInputMessage] = useState('');
  const [openSourcesMap, setOpenSourcesMap] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  const toggleSources = (msgId) => {
    setOpenSourcesMap((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const promptSuggestions = [
    {
      title: "Feature Factories & Product Strategy",
      desc: "What is Marty Cagan's view on feature factories?",
      icon: Target,
      color: "from-rose-700 to-amber-600"
    },
    {
      title: "B2B Growth Loops & PLG",
      desc: "Explain Elena Verna's B2B growth loops and PLG.",
      icon: Zap,
      color: "from-amber-600 to-rose-700"
    },
    {
      title: "Netflix DHM Framework",
      desc: "How does Gibson Biddle define Netflix's DHM framework?",
      icon: Layers,
      color: "from-rose-800 to-rose-600"
    },
    {
      title: "Prioritization & Executive Work",
      desc: "How to use Shreyas Doshi's LNO framework for prioritizing?",
      icon: Compass,
      color: "from-amber-500 to-rose-700"
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0f0508] relative overflow-hidden app-bg">
      {/* Top Ambient Header */}
      <header className="h-16 border-b border-rose-900/30 px-6 flex items-center justify-between glass z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-700 to-amber-500 flex items-center justify-center text-white font-bold shadow-md shadow-rose-700/20">
            <Bot className="w-4 h-4 text-amber-200" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-amber-300 tracking-wider uppercase text-glow flex items-center gap-2">
              The Lenny Growth Assistant
              <span className="text-[10px] bg-rose-950/80 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-normal">
                {currentProvider} / {currentModel}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onTriggerShip30("Empowered Product Growth & Retention")}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-950/80 to-amber-950/80 hover:from-rose-900/80 hover:to-amber-900/80 text-amber-200 border border-amber-500/30 text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm group"
            title="Generate a 1,250-word Ship 30 for 30 essay"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Ship 30 Essay</span>
          </button>
        </div>
      </header>

      {/* Messages Feed — Full-Width Centered Layout */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 ? (
            /* Welcome / Hero Screen */
            <div className="py-12 space-y-8 text-center msg-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 mx-auto flex items-center justify-center shadow-xl shadow-rose-700/30 glow-wine">
                <Sparkles className="w-8 h-8 text-amber-100" />
              </div>

              <div className="space-y-3 max-w-xl mx-auto">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  What growth strategy would you like to explore today?
                </h3>
                <p className="text-sm text-rose-200/70 leading-relaxed">
                  Grounded directly in authentic transcripts from Brian Chesky, Marty Cagan, Elena Verna, Gibson Biddle, Shreyas Doshi, and Claire Vo.
                </p>
              </div>

              {/* 2x2 Grid of Prompt Cards */}
              <div className="pt-4 max-w-3xl mx-auto">
                <p className="text-[11px] font-bold text-rose-300/50 uppercase tracking-widest mb-4">
                  Suggested Strategic Topics
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {promptSuggestions.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => onSendMessage(item.desc)}
                        className="p-4 rounded-2xl glass-light hover:bg-rose-950/40 border border-rose-800/25 text-left transition-all duration-200 group relative hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-900/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white font-bold shadow-sm`}>
                            <IconComp className="w-4 h-4 text-amber-200" />
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-rose-400/40 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h4 className="text-xs font-bold text-rose-100 group-hover:text-white transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-rose-300/60 mt-1 line-clamp-2">
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isSourcesOpen = openSourcesMap[msg.id];
              const hasSources = msg.sources && msg.sources.length > 0;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-4 msg-in ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-700 to-amber-500 flex items-center justify-center shrink-0 shadow-md shadow-rose-700/20 text-amber-100 font-bold mt-1">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className={`space-y-3 max-w-3xl ${isUser ? 'order-1' : 'order-2 flex-1'}`}>
                    {/* Message Bubble */}
                    <div
                      className={`p-5 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-rose-700 to-amber-600 text-white font-semibold rounded-tr-none shadow-lg shadow-rose-700/20 ml-auto max-w-xl'
                          : 'glass border border-rose-800/30 text-rose-100/90 rounded-tl-none shadow-xl'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div
                          className="md-body"
                          dangerouslySetInnerHTML={{ __html: marked.parse(msg.content || '') }}
                        />
                      )}
                    </div>

                    {/* Artifact Link Notification */}
                    {msg.artifact_id && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => onViewArtifact(msg.artifact_id)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-950 via-amber-950 to-rose-900 border border-rose-500/40 text-amber-200 text-xs font-semibold flex items-center space-x-2.5 hover:border-amber-400 transition-all shadow-md group"
                        >
                          <FileText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                          <span>View Generated Artifact Side-by-Side</span>
                        </button>
                      </div>
                    )}

                    {/* Grounding Transcript Sources Accordion */}
                    {hasSources && (
                      <div className="glass-light border border-rose-800/30 rounded-xl overflow-hidden mt-3">
                        <button
                          onClick={() => toggleSources(msg.id)}
                          className="w-full px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900/30 flex items-center justify-between text-xs text-rose-300 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-amber-400" />
                            <span className="font-semibold text-rose-200">
                              {msg.sources.length} Grounded Transcript Sources Cited
                            </span>
                          </div>
                          {isSourcesOpen ? (
                            <ChevronUp className="w-4 h-4 text-amber-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-amber-400" />
                          )}
                        </button>

                        {isSourcesOpen && (
                          <div className="p-3 space-y-2 border-t border-rose-800/30 bg-[#0f0508]/60">
                            {msg.sources.map((src, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-3 rounded-xl glass border border-rose-900/30 space-y-1.5"
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-rose-400" /> {src.guest}
                                  </span>
                                  <span className="text-[10px] bg-rose-950 text-amber-300 px-2 py-0.5 rounded-full font-mono border border-rose-800/50">
                                    Match: {Math.round((src.relevance_score || 0.8) * 100)}%
                                  </span>
                                </div>
                                <p className="text-[11px] font-medium text-rose-300/70 italic">
                                  "{src.episode_title}"
                                </p>
                                <p className="text-xs text-rose-200/90 leading-snug bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/40">
                                  {src.excerpt}
                                </p>
                                {src.source_url && (
                                  <a
                                    href={src.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 hover:underline pt-0.5"
                                  >
                                    <span>View Original Newsletter / Transcript</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons under Assistant Message */}
                    {!isUser && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={() => onTriggerShip30(msg.content)}
                          className="text-[11px] px-3 py-1.5 rounded-xl glass-light hover:bg-rose-900/40 text-amber-300 border border-rose-800/30 hover:border-amber-600/40 flex items-center gap-1.5 transition-all font-medium"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Turn into Ship 30 Essay</span>
                        </button>
                        <button
                          onClick={() => onGenerateArtifact(msg.content, 'markdown')}
                          className="text-[11px] px-3 py-1.5 rounded-xl glass-light hover:bg-rose-900/40 text-rose-300 border border-rose-800/30 hover:border-rose-600/40 flex items-center gap-1.5 transition-all font-medium"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-400" />
                          <span>Generate Markdown</span>
                        </button>
                        <button
                          onClick={() => onGenerateArtifact(msg.content, 'html')}
                          className="text-[11px] px-3 py-1.5 rounded-xl glass-light hover:bg-rose-900/40 text-rose-300 border border-rose-800/30 hover:border-rose-600/40 flex items-center gap-1.5 transition-all font-medium"
                        >
                          <Code className="w-3.5 h-3.5 text-amber-400" />
                          <span>Generate HTML Artifact</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-9 h-9 rounded-xl bg-rose-950 border border-rose-800/60 flex items-center justify-center shrink-0 text-amber-300 mt-1 shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex gap-4 msg-in max-w-3xl">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-700 to-amber-500 flex items-center justify-center shrink-0 shadow-md text-amber-100 font-bold mt-1">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl glass border border-rose-800/30 text-rose-300 text-xs flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-rose-400 typing-dot"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400 typing-dot"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400 typing-dot"></div>
                </div>
                <span className="font-medium">Searching Lenny's Podcast transcripts & generating grounded answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Bottom Input Bar */}
      <footer className="p-4 md:px-8 border-t border-rose-900/30 glass">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a product or growth question grounded in Lenny's podcast..."
            className="w-full pl-5 pr-14 py-4 bg-rose-950/40 border border-rose-800/40 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 rounded-2xl text-sm text-white placeholder-rose-300/40 outline-none transition-all shadow-inner"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="absolute right-2.5 p-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-amber-500 hover:from-rose-600 hover:to-amber-400 disabled:opacity-30 text-white font-bold transition-all shadow-lg shadow-rose-700/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-center text-rose-300/40 mt-2 font-medium">
          Answers grounded strictly in authenticated transcripts • Dynamic multi-provider model switching supported
        </p>
      </footer>
    </div>
  );
}
