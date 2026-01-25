import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const ModernButton = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
        secondary: 'border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-200',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg font-semibold',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

ModernButton.displayName = 'ModernButton';

export default ModernButton;
