
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
        w-full text-left p-6 border border-white/10 bg-white/5 backdrop-blur-sm
        transition-all duration-300 group relative overflow-hidden rounded-xl
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:border-arcade-choice/50 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] active:scale-[0.98]'}
      `}
    >
      <div className="flex items-center justify-center relative z-10">
        <span className="text-zinc-400 group-hover:text-white font-arcade text-lg md:text-xl leading-snug transition-colors duration-300 text-center w-full uppercase tracking-wider">
          {text}
        </span>
      </div>
      {/* Subtle glow line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-arcade-choice/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  );
};
