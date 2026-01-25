import React from 'react';
import { cn } from '../../lib/utils';

const SectionContainer = ({ children, className, py = 'py-20', maxWidth = 'max-w-7xl' }) => {
    return (
        <section className={cn(py, "px-6 sm:px-10 lg:px-16 relative overflow-hidden", className)}>
            <div className={cn("mx-auto", maxWidth)}>
                {children}
            </div>
        </section>
    );
};

export default SectionContainer;
