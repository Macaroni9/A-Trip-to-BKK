
import React from 'react';

interface StoryAnimationProps {
  title: string;
  size?: 'sm' | 'lg';
}

export const StoryAnimation: React.FC<StoryAnimationProps> = ({ title, size = 'sm' }) => {
  const t = title.toLowerCase();
  const iconClass = size === 'lg' ? 'w-48 h-32' : 'w-24 h-16';
  const owlClass = size === 'lg' ? 'w-32 h-32' : 'w-16 h-16';

  if (t.includes('suvarnabhumi')) {
    return (
      <svg viewBox="0 0 100 60" className={`${iconClass}`}>
        {/* Static Runway */}
        <g className="text-arcade-accent opacity-30">
          <rect x="10" y="50" width="80" height="4" fill="currentColor" />
          <rect x="20" y="50" width="10" height="2" fill="white" />
          <rect x="45" y="50" width="10" height="2" fill="white" />
          <rect x="70" y="50" width="10" height="2" fill="white" />
        </g>
        {/* Animated Plane */}
        <g className="animate-plane-land text-white">
          <g transform="scale(-1, 1) translate(-100, 0)">
            <path d="M10 25 Q30 20 50 25 L80 25 Q85 25 85 28 Q85 31 80 31 L20 31 Q10 31 10 25" fill="currentColor" />
            <path d="M40 25 L30 10 L45 10 L55 25 Z" fill="currentColor" /> {/* Top Wing */}
            <path d="M40 31 L30 46 L45 46 L55 31 Z" fill="currentColor" /> {/* Bottom Wing */}
            <path d="M10 25 L5 15 L15 15 L20 25 Z" fill="currentColor" /> {/* Tail */}
            {/* Windows */}
            <rect x="55" y="26" width="3" height="2" fill="#88ccff" />
            <rect x="62" y="26" width="3" height="2" fill="#88ccff" />
            <rect x="69" y="26" width="3" height="2" fill="#88ccff" />
          </g>
        </g>
      </svg>
    );
  }

  if (t.includes('night owl')) {
    return (
      <svg viewBox="0 0 64 64" className={`${owlClass}`}>
        {/* Branch */}
        <path d="M5 50 Q32 45 59 50" stroke="#5D4037" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Owl */}
        <g className="text-[#8D6E63]">
          {/* Body & Head */}
          <path d="M22 20 Q32 15 42 20 L45 45 Q32 55 19 45 Z" fill="currentColor" />
          {/* Detailed Feathers */}
          <path d="M25 35 Q32 38 39 35" stroke="#5D4037" fill="none" strokeWidth="1" />
          <path d="M25 40 Q32 43 39 40" stroke="#5D4037" fill="none" strokeWidth="1" />
          {/* Ears/Tufts */}
          <path d="M22 20 L18 10 L28 18 Z" fill="currentColor" />
          <path d="M42 20 L46 10 L36 18 Z" fill="currentColor" />
          {/* Eyes */}
          <circle cx="27" cy="28" r="6" fill="#FFF176" />
          <circle cx="37" cy="28" r="6" fill="#FFF176" />
          <circle cx="27" cy="28" r="2.5" fill="black" className="animate-owl-blink" />
          <circle cx="37" cy="28" r="2.5" fill="black" className="animate-owl-blink" />
          {/* Beak */}
          <path d="M32 32 L29 38 L35 38 Z" fill="#FBC02D" />
          {/* Wings */}
          <path d="M22 25 Q15 35 22 45" stroke="#5D4037" fill="none" strokeWidth="2" />
          <path d="M42 25 Q49 35 42 45" stroke="#5D4037" fill="none" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  if (t.includes('proper bite')) {
    return (
      <svg viewBox="0 0 64 64" className={`${owlClass} text-arcade-choice`}>
        {/* Plate */}
        <ellipse cx="32" cy="45" rx="25" ry="8" fill="currentColor" opacity="0.5" />
        <ellipse cx="32" cy="42" rx="20" ry="6" fill="currentColor" />
        {/* Food */}
        <rect x="22" y="35" width="20" height="8" rx="4" fill="#FFD700" />
        {/* Steam */}
        <path d="M25 30 Q28 25 25 20" fill="none" stroke="currentColor" strokeWidth="2" className="animate-steam-rise" style={{ animationDelay: '0s' }} />
        <path d="M32 28 Q35 23 32 18" fill="none" stroke="currentColor" strokeWidth="2" className="animate-steam-rise" style={{ animationDelay: '0.2s' }} />
        <path d="M39 30 Q42 25 39 20" fill="none" stroke="currentColor" strokeWidth="2" className="animate-steam-rise" style={{ animationDelay: '0.4s' }} />
      </svg>
    );
  }

  if (t.includes('sweetest craving')) {
    return (
      <svg viewBox="0 0 64 64" className={`${owlClass}`}>
        {/* Ant */}
        <g className="animate-ant-walk text-[#D32F2F]">
          {/* Abdomen */}
          <ellipse cx="45" cy="45" rx="8" ry="5" fill="currentColor" />
          {/* Thorax */}
          <ellipse cx="32" cy="45" rx="5" ry="4" fill="currentColor" />
          {/* Head */}
          <circle cx="22" cy="45" r="5" fill="currentColor" />
          {/* Antennae */}
          <path d="M22 40 L18 32" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M22 40 L26 32" stroke="currentColor" strokeWidth="1" fill="none" />
          {/* Legs */}
          <path d="M32 45 L28 55" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M32 45 L36 55" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M45 45 L42 55" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M45 45 L48 55" stroke="currentColor" strokeWidth="1.5" fill="none" />
          {/* Sugar Cube */}
          <rect x="25" y="25" width="14" height="14" fill="white" stroke="#ccc" strokeWidth="1" />
        </g>
      </svg>
    );
  }

  if (t.includes('postcard')) {
    return (
      <svg viewBox="0 0 64 64" className={`${owlClass}`}>
        {/* Water */}
        <g className="text-[#0288D1]">
          <path d="M0 45 Q16 40 32 45 T64 45" fill="none" stroke="currentColor" strokeWidth="2" className="animate-water-flow" />
          <path d="M0 52 Q16 47 32 52 T64 52" fill="none" stroke="currentColor" strokeWidth="2" className="animate-water-flow" style={{ animationDelay: '-1s' }} />
        </g>
        {/* Sun */}
        <g className="text-[#FF8C00]">
          <circle cx="32" cy="35" r="18" fill="currentColor" className="animate-sunset-shimmer" />
          {/* Reflection in water */}
          <rect x="20" y="46" width="24" height="2" fill="currentColor" opacity="0.6" />
          <rect x="24" y="50" width="16" height="2" fill="currentColor" opacity="0.4" />
        </g>
      </svg>
    );
  }

  if (t.includes('riverside')) {
    return (
      <svg viewBox="0 0 100 64" className={`${iconClass}`}>
        {/* Water */}
        <g className="text-[#03A9F4]">
          <path d="M0 50 Q25 45 50 50 T100 50" fill="none" stroke="currentColor" strokeWidth="3" className="animate-water-flow" />
          <path d="M0 58 Q25 53 50 58 T100 58" fill="none" stroke="currentColor" strokeWidth="3" className="animate-water-flow" style={{ animationDelay: '-1s' }} />
        </g>
        {/* Boat & Man */}
        <g className="animate-boat-row">
          {/* Boat */}
          <path d="M20 40 L80 40 L70 55 L30 55 Z" fill="#795548" />
          {/* Man */}
          <g className="text-[#FFCCBC]">
            <circle cx="45" cy="28" r="5" fill="currentColor" /> {/* Head */}
            <path d="M40 33 L50 33 L52 45 L38 45 Z" fill="#3F51B5" /> {/* Body/Shirt */}
            <path d="M40 35 L30 42" stroke="currentColor" strokeWidth="3" fill="none" /> {/* Arm */}
          </g>
          {/* Oar */}
          <line x1="30" y1="42" x2="15" y2="58" stroke="#5D4037" strokeWidth="4" className="animate-oar-row" />
        </g>
      </svg>
    );
  }

  if (t.includes('out on foot')) {
    return (
      <svg viewBox="0 0 64 64" className={`${owlClass} text-zinc-500`}>
        <g className="animate-footstep-fade" style={{ animationDelay: '0s' }}>
          {/* Left Foot */}
          <path d="M20 20 Q28 15 32 25 L30 45 Q25 50 18 45 Z" fill="currentColor" />
          <circle cx="22" cy="15" r="2" fill="currentColor" />
          <circle cx="26" cy="14" r="2" fill="currentColor" />
          <circle cx="30" cy="15" r="2" fill="currentColor" />
        </g>
        <g className="animate-footstep-fade" style={{ animationDelay: '0.5s' }}>
          {/* Right Foot */}
          <path d="M40 30 Q48 25 52 35 L50 55 Q45 60 38 55 Z" fill="currentColor" />
          <circle cx="42" cy="25" r="2" fill="currentColor" />
          <circle cx="46" cy="24" r="2" fill="currentColor" />
          <circle cx="50" cy="25" r="2" fill="currentColor" />
        </g>
      </svg>
    );
  }

  if (t.includes('great reset')) {
    return (
      <svg viewBox="0 0 64 64" className={`${owlClass} text-arcade-secondary animate-hourglass-rotate`}>
        {/* Hourglass Frame */}
        <path d="M20 10 L44 10 L44 15 L35 32 L44 49 L44 54 L20 54 L20 49 L29 32 L20 15 L20 10 Z" fill="none" stroke="currentColor" strokeWidth="3" />
        {/* Sand */}
        <path d="M25 15 L39 15 L32 30 Z" fill="currentColor" />
        <path d="M32 35 L25 50 L39 50 Z" fill="currentColor" opacity="0.5" />
      </svg>
    );
  }

  return null;
};
