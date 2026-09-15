import React from 'react';
import { X, Cpu, Check, ShieldCheck } from 'lucide-react';

export default function ModelSelectorModal({
  isOpen,
  onClose,
  providers,
  currentProvider,
  currentModel,
  onSelectProviderModel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0508]/80 backdrop-blur-md flex items-center justify-center p-4 msg-in">
      <div className="glass border border-rose-800/40 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative glow-wine">
        <div className="flex items-center justify-between border-b border-rose-900/30 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white gradient-text">Select LLM Provider & Model</h3>
              <p className="text-xs text-rose-300/60">Switch providers dynamically without modifying code</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-rose-300/60 hover:text-white hover:bg-rose-900/40 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5">
          {providers.map((prov) => {
            const isSelected = currentProvider.toLowerCase() === prov.name.toLowerCase();
            return (
              <div
                key={prov.name}
                className={`p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-rose-950/70 border-rose-500/60 shadow-lg shadow-rose-900/30'
                    : 'glass-light border-rose-900/30 hover:border-rose-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{prov.display_name}</span>
                    {prov.name === 'ollama' && (
                      <span className="text-[10px] bg-rose-950 text-amber-300 border border-rose-700/60 px-2 py-0.5 rounded-full font-mono font-semibold">
                        Mandatory Target
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Connected
                    </span>
                  </div>
                </div>

                <div className="text-xs text-rose-300/60 mb-3">
                  <span>Ready for grounded transcript inference.</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-rose-900/30">
                  {prov.supported_models.map((mod) => {
                    const isModelActive = isSelected && currentModel === mod;
                    return (
                      <button
                        key={mod}
                        onClick={() => {
                          onSelectProviderModel(prov.name, mod);
                          onClose();
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                          isModelActive
                            ? 'bg-gradient-to-r from-rose-700 to-amber-500 text-white shadow-md shadow-rose-700/30'
                            : 'glass-light hover:bg-rose-900/40 text-rose-300 border border-rose-800/30'
                        }`}
                      >
                        {mod} {isModelActive && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-1 text-center text-xs text-rose-300/40">
          *All LLM providers are online and ready for seamless model switching.
        </div>
      </div>
    </div>
  );
}
