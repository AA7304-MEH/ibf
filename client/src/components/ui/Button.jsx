import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseStyles = "font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform active:scale-95";

    const variants = {
        primary: "bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl hover:shadow-primary-500/20",
        secondary: "bg-transparent border border-gray-600 hover:border-text-primary text-text-secondary hover:text-text-primary",
        ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
