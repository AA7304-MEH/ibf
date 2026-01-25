import React from 'react';
import { motion } from 'framer-motion';
import MissionPanel from './MissionPanel';

const Hero = () => {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 relative overflow-hidden bg-background-dark">

            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-green/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center z-10">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-bold text-text-primary tracking-tight mb-6"
                >
                    Redefine Proof of Work.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-light"
                >
                    High-Fidelity Integration
                    <span className="block text-sm mt-2 opacity-70">Connecting specialized nodes to optimal missions.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-4 mb-16"
                >
                    <div className="bg-background-card/50 border border-gray-700/50 rounded-full px-5 py-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        <span className="text-xs font-medium text-text-secondary">Encrypted Trust Layers</span>
                    </div>
                    <div className="bg-background-card/50 border border-gray-700/50 rounded-full px-5 py-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                        <span className="text-xs font-medium text-text-secondary">Safety-first protocols</span>
                    </div>
                </motion.div>

                <MissionPanel />
            </div>
        </section>
    );
};

export default Hero;
