import React from 'react';

const Container = ({ children, className = '' }) => {
    return (
        <div className={`max-w-[1280px] mx-auto px-6 md:px-8 w-full ${className}`}>
            {children}
        </div>
    );
};

export default Container;
