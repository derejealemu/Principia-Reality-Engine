import React, { useState } from 'react';
import { Key, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!inputKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    if (!inputKey.startsWith('AIza')) {
      setError('That doesn\'t look like a valid Google API Key');
      return;
    }
    onSave(inputKey.trim());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cosmos-900/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-cosmos-800 border border-cosmos-500 rounded-2xl shadow-2xl shadow-neon-blue/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-cosmos-900/50 p-6 border-b border-cosmos-500/30 text-center">
          <div className="w-12 h-12 bg-cosmos-700 rounded-full flex items-center justify-center mx-auto mb-4 text-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.3)]">
            <Key size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Access PRINCIPIA</h2>
          <p className="text-cosmos-300 text-sm mt-2">
            Enter your Gemini API Key to unlock the Reality Engine.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neon-blue uppercase tracking-wider">API Key</label>
            <input 
              type="password" 
              value={inputKey}
              onChange={(e) => { setInputKey(e.target.value); setError(''); }}
              placeholder="AIza..."
              className="w-full bg-cosmos-900 border border-cosmos-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
            />
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
                <AlertCircle size={12} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="text-xs text-cosmos-400 bg-cosmos-900/50 p-3 rounded-lg border border-cosmos-500/20 space-y-2">
            <div className="flex items-start gap-2">
              <ShieldCheck size={14} className="text-green-400 mt-0.5 shrink-0" />
              <p>Your key is stored locally in your browser. It is never sent to our servers.</p>
            </div>
            <div className="flex items-start gap-2">
              <ExternalLink size={14} className="text-neon-purple mt-0.5 shrink-0" />
              <p>
                Need a key? Get one for free at{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neon-blue hover:underline"
                >
                  Google AI Studio
                </a>.
              </p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(188,19,254,0.3)]"
          >
            Initialize Engine
          </button>
        </div>

      </div>
    </div>
  );
};