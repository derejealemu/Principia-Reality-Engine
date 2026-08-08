import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const iconColor = type === 'success' ? 'text-neon-blue' : type === 'error' ? 'text-red-400' : 'text-cosmos-300';
  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : undefined;

  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`flex items-center gap-3 px-6 py-3 rounded-full bg-cosmos-900/90 backdrop-blur-md border border-cosmos-500/50 shadow-[0_0_20px_rgba(0,243,255,0.2)] text-white min-w-[200px]`}>
        {Icon && <Icon size={18} className={iconColor} />}
        <span className="text-sm font-medium whitespace-nowrap">{message}</span>
        <button onClick={onClose} className="ml-2 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
