import React from 'react';
import { motion } from 'framer-motion';

const DigitalTwinWorkspace: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden perspective-1000">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070')] bg-cover bg-center blur-sm opacity-30" />

            <div className="relative z-10 w-full max-w-5xl aspect-video bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
                {/* HUD Header */}
                <div className="h-16 border-b border-white/10 flex items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-blue-400 font-mono text-sm tracking-widest">DIGITAL TWIN HQ // ONLINE</div>
                </div>

                {/* Main Workspace Area */}
                <div className="flex-1 flex">
                    {/* Sidebar / Tools */}
                    <div className="w-20 border-r border-white/10 flex flex-col items-center py-6 gap-6">
                        {['💻', '🎨', '🚀', '💬', '⚙️'].map(icon => (
                            <motion.button
                                key={icon}
                                whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-colors"
                            >
                                {icon}
                            </motion.button>
                        ))}
                    </div>

                    {/* Central View */}
                    <div className="flex-1 p-8 grid grid-cols-2 gap-8">
                        {/* Holo Screen 1 */}
                        <motion.div
                            initial={{ rotateY: 10, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 relative group"
                        >
                            <div className="absolute top-2 right-2 text-blue-400 text-xs font-mono">TASK_MANAGER.exe</div>
                            <h3 className="text-white font-bold text-xl mb-4">Active Missions</h3>
                            <ul className="space-y-2 text-blue-100 text-sm">
                                <li className="flex justify-between">
                                    <span>Build Website</span>
                                    <span className="text-yellow-400">In Progress</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>AI Research</span>
                                    <span className="text-green-400">Done</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Holo Screen 2 */}
                        <motion.div
                            initial={{ rotateY: -10, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6 relative"
                        >
                            <div className="absolute top-2 right-2 text-purple-400 text-xs font-mono">COMMS_LINK</div>
                            <h3 className="text-white font-bold text-xl mb-4">Team Chat</h3>
                            <div className="space-y-3">
                                <div className="bg-white/5 p-2 rounded text-sm text-gray-300">
                                    <span className="text-purple-400 font-bold">Alex:</span> Deployment checking out?
                                </div>
                                <div className="bg-white/5 p-2 rounded text-sm text-gray-300">
                                    <span className="text-pink-400 font-bold">Sam:</span> All systems go! 🚀
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute bottom-10 right-10 text-6xl opacity-50 pointer-events-none"
            >
                👾
            </motion.div>
        </div>
    );
};

export default DigitalTwinWorkspace;
