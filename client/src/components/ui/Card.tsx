import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-background-card border border-border rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
