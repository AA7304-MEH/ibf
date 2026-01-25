import React from 'react';
import Container from '../ui/Container';

const Footer = () => {
    return (
        <footer className="bg-background-dark border-t border-gray-800 py-12">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="text-xl font-bold text-white tracking-tight">
                        SkillBridge.
                    </span>
                    <p className="text-text-muted text-sm">
                        © 2026 SkillBridge. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
