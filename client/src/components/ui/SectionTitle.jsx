import React from 'react';

const SectionTitle = ({ title, subtitle, centered = false }) => {
    return (
        <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionTitle;
