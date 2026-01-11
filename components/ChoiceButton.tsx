
import React from 'react';

interface ChoiceButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left p-6 rounded-2xl border border-zinc-800/50
        transition-all duration-500 group relative overflow-hidden
        ${disabled ? 'opacity-30 cursor-not-allowed shadow-none' : 'hover:border-fuchsia-500/50 hover:bg-zinc-900/30 hover:shadow-[0_10px_30px_rgba(217,70,239,0.05)] active:scale-[0.98]'}
      `}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-fuchsia-500 transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_10px_#d946ef]" />
        <span className="text-zinc-400 group-hover:text-white font-medium text-lg leading-snug transition-colors duration-300">
          {text}
        </span>
      </div>
      {/* Hover Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/[0.02] to-cyan-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
};
