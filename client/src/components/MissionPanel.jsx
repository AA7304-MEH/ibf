import React from 'react';
import { motion } from 'framer-motion';

const MissionPanel = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-background-card rounded-xl border border-gray-700 p-6 w-full max-w-md mx-auto mt-12 shadow-2xl relative overflow-hidden"
        >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-green" />

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-text-primary font-semibold text-sm tracking-widest uppercase">Execute Mission</h3>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-xs text-text-secondary">System Online</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs text-text-secondary font-medium ml-1">Identify.</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="New node detected? Create ID"
                            className="w-full bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-600"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-text-secondary font-medium ml-1">Network Endpoint</label>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            className="w-full bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-600"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <a href="#" className="text-xs text-accent-green hover:underline">Recover?</a>
                    <button className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors shadow-lg shadow-primary-600/20">
                        Initialize
                    </button>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-dark border border-gray-800">
                    <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" /></svg>
                    <span className="text-[10px] text-gray-500 font-medium tracking-wide">Secured by Integrity Framework</span>
                </div>
            </div>
        </motion.div>
    );
};

export default MissionPanel;
