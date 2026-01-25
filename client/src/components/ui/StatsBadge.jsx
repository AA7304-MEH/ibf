import React from 'react';
import { cn } from '../../lib/utils';

const StatsBadge = ({ children, variant = 'success', className }) => {
    const variants = {
        success: 'bg-green-50 text-green-700 border-green-100',
        primary: 'bg-blue-50 text-blue-700 border-blue-100',
        neutral: 'bg-gray-50 text-gray-700 border-gray-100',
    };

    return (
        <span className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border animate-in fade-in slide-in-from-top-1 duration-700",
            variants[variant],
            className
        )}>
            {variant === 'success' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />}
            {children}
        </span>
    );
};

export default StatsBadge;
