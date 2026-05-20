import React from 'react';
import { Moon, Sun, Bell, Menu } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Logo from './Logo';

interface NavbarProps {
  pageTitle: string;
  onMenuToggle?: () => void;
}

export const Navbar = ({ pageTitle, onMenuToggle }: NavbarProps) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200/50 bg-white/70 px-4 md:px-6 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60">
      <div className="flex items-center gap-2 md:gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors -ml-1 mr-1"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <Logo hideText size={32} />
        <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white ml-2">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications placeholder */}
        <button
          id="navbar-notifications-btn"
          className="relative rounded-xl p-2.5 border border-transparent text-slate-500 hover:bg-slate-100 hover:border-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:border-slate-800 transition-all duration-200"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/30" />
        </button>

        {/* Dark mode toggle */}
        <button
          id="navbar-theme-toggle"
          onClick={toggleTheme}
          className="rounded-xl p-2.5 border border-transparent text-slate-500 hover:bg-slate-100 hover:border-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:border-slate-800 transition-all duration-200"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>
      </div>
    </header>
  );
};
