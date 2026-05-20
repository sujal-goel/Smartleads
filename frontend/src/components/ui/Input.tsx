import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wider text-left"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-inner',
              'placeholder:text-slate-400 outline-none transition-all duration-200',
              'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
              'dark:bg-slate-900 dark:border-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500',
              'dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20',
              leftIcon && 'pl-11',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-rose-500 text-left font-semibold">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
