import React from 'react';

interface LogoProps {
  size?: number;
  hideText?: boolean;
}

export const Logo = ({ size = 36, hideText = false }: LogoProps) => {
  const s = size;
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.svg"
        alt="SmartLeads logo"
        width={s}
        height={s}
        className="rounded-xl bg-transparent"
        style={{ objectFit: 'contain' }}
      />
      {!hideText && (
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
          SmartLeads
        </span>
      )}
    </div>
  );
};

export default Logo;
