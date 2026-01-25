import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
    return (
        <div className="space-y-2 w-full">
            {label && (
                <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest px-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-lg border border-border bg-background-subtle px-4 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-primary",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && <p className="text-[10px] font-bold text-red-500 px-1">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
