import React from 'react';

interface LogoProps {
  size?: number;
  hideText?: boolean;
}

export const Logo = ({ size = 36, hideText = false }: LogoProps) => {
  const s = size;
  return (
    <div className="flex items-center gap-3">
      <div
        style={{ width: s, height: s }}
        className="flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md"
        aria-hidden
      >
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="6" fill="white" opacity="0.06" />
          <path d="M7 12L10 8L14 16L17 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {!hideText && (
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
          SmartLeads
        </span>
      )}
    </div>
  );
};

export default Logo;
