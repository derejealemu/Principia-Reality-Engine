import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-cosmos-900/80 backdrop-blur-sm">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-cosmos-500/30 rounded-full animate-ping"></div>
        <div className="absolute inset-0 border-4 border-t-neon-blue border-r-neon-purple border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-b-neon-pink border-l-neon-blue border-t-transparent border-r-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <div className="mt-6 text-neon-blue font-mono text-lg animate-pulse">
        Deriving Reality...
      </div>
      <div className="mt-2 text-cosmos-300 text-xs font-sans">
        Gemini 3.0 Pro is thinking
      </div>
    </div>
  );
};
