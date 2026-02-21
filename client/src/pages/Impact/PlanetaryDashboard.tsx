import React from 'react';
import { motion } from 'framer-motion';
import { GlobeAmericasIcon, SparklesIcon, FireIcon, UserGroupIcon } from '@heroicons/react/24/solid';

const PlanetaryDashboard: React.FC = () => {
    // Mock Aggregated Data
    const stats = [
        { label: 'Learning Hours', value: '12,450', icon: ClockIcon, color: 'text-blue-500' },
        { label: 'Micro-Internships', value: '842', icon: FireIcon, color: 'text-orange-500' },
        { label: 'Startups Supported', value: '156', icon: SparklesIcon, color: 'text-purple-500' },
        { label: 'Global Students', value: '3,200', icon: UserGroupIcon, color: 'text-green-500' },
    ];

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://cdn.pixabay.com/photo/2016/10/20/18/35/earth-1756274_1280.jpg')] bg-cover bg-center opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="inline-block p-4 rounded-full bg-blue-900/30 mb-6 backdrop-blur-md"
                    >
                        <GlobeAmericasIcon className="w-16 h-16 text-blue-400 animate-pulse" />
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-green-400 to-emerald-400 mb-6">
                        Planetary Impact
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Tracking the collective intelligence and contribution of the SkillSwap Generation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-gray-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl text-center hover:bg-gray-800/50 transition-colors"
                        >
                            <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                            <h3 className="text-4xl font-bold font-mono mb-2">{stat.value}</h3>
                            <p className="text-gray-400 uppercase tracking-widest text-xs">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 p-8 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-3xl border border-white/10 backdrop-blur-lg">
                    <h2 className="text-2xl font-bold mb-4">Latest Global Actions</h2>
                    <div className="space-y-4">
                        {[
                            "Sarah (US) completed 'Sustainable Energy Research' for GreenTech Inc.",
                            "Raj (India) earned the 'Python Master' Badge.",
                            "Team Alpha (UK) deployed a new 'Food Rescue App' prototype.",
                        ].map((action, i) => (
                            <div key={i} className="flex items-center gap-4 text-gray-300">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                                <p>{action}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for Icon (since I can't import ClockIcon from outline in the solid import line easily without aliasing)
import { ClockIcon } from '@heroicons/react/24/outline';

export default PlanetaryDashboard;
