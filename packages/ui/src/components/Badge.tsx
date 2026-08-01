import React from 'react';
import { cn } from '../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
    success: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-800/50',
    danger: 'bg-rose-950/60 text-rose-300 border-rose-800/50',
    info: 'bg-sky-950/60 text-sky-300 border-sky-800/50',
    outline: 'bg-transparent text-slate-300 border-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
