import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ children, variant = 'primary', className }) => {
    const variants = {
        primary: 'bg-primary/10 text-primary border-primary/20',
        secondary: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        error: 'bg-red-500/10 text-red-400 border-red-500/20',
        default: 'bg-slate-800 text-slate-400 border-slate-700',
    };

    return (
        <span className={cn(
            'inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-heading font-black uppercase tracking-[0.2em] italic border shadow-sm',
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};

export default Badge;
