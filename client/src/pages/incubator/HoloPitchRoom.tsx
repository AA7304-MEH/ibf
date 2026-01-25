import React from 'react';
import { motion } from 'framer-motion';
import { VideoCameraIcon, MicrophoneIcon, SignalIcon } from '@heroicons/react/24/outline';

const HoloPitchRoom: React.FC = () => {
    const investors = [
        { name: "Sarah 'The Shark'", style: "Aggressive", sentiment: 35, feedback: "Numbers seem inflated." },
        { name: "Marcus Vision", style: "Visionary", sentiment: 85, feedback: "Love the moonshot potential." },
        { name: "Dr. Chen", style: "Technical", sentiment: 60, feedback: "Explain the stack again." },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

            <header className="relative z-10 flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-500 font-bold tracking-widest text-xs uppercase">Recording Live</span>
                    </div>
                    <h1 className="text-3xl font-bold mt-2">Simulation: Series A Pitch</h1>
                </div>
                <div className="flex space-x-4">
                    <div className="bg-gray-800 px-4 py-2 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Pacing</p>
                        <p className="font-bold text-green-400">145 wpm</p>
                    </div>
                    <div className="bg-gray-800 px-4 py-2 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Confidence</p>
                        <p className="font-bold text-blue-400">High</p>
                    </div>
                </div>
            </header>

            {/* Investor Avatars (The Stage) */}
            <div className="relative z-10 grid grid-cols-3 gap-8 mb-12 h-[50vh] items-end pb-12">
                {investors.map((inv, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="relative group text-center"
                    >
                        {/* Avatar Hologram */}
                        <div className="mx-auto w-48 h-64 bg-gradient-to-t from-blue-500/10 to-transparent border border-blue-500/30 rounded-t-full relative backdrop-blur-sm">
                            {/* Face Placeholder */}
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-24 h-32 bg-blue-400/20 rounded-full blur-md" />
                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <p className="font-bold text-lg text-blue-100">{inv.name}</p>
                                <p className="text-xs text-blue-300">{inv.style}</p>
                            </div>
                        </div>

                        {/* Sentiment Meter (Floating) */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900/80 border border-gray-700 px-3 py-1 rounded-full flex items-center mb-2 whitespace-nowrap">
                            <SignalIcon className={`w-4 h-4 mr-2 ${inv.sentiment > 50 ? 'text-green-500' : 'text-red-500'}`} />
                            <span className="text-xs font-mono">{inv.sentiment}% Interest</span>
                        </div>

                        {/* Real-time Feedback Bubble */}
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.2 + 1, repeat: Infinity, repeatDelay: 5, repeatType: 'reverse' }}
                            className="absolute -top-32 left-1/2 transform -translate-x-1/2 bg-white text-black p-3 rounded-xl rounded-b-none shadow-lg max-w-[200px]"
                        >
                            <p className="text-xs font-bold">"{inv.feedback}"</p>
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="relative z-10 max-w-2xl mx-auto">
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center space-x-6">
                        <button className="flex flex-col items-center group">
                            <div className="w-12 h-12 rounded-full bg-gray-700 group-hover:bg-red-500 transition flex items-center justify-center">
                                <MicrophoneIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs text-gray-400 mt-2">Mute</span>
                        </button>
                        <button className="flex flex-col items-center group">
                            <div className="w-12 h-12 rounded-full bg-gray-700 group-hover:bg-blue-500 transition flex items-center justify-center">
                                <VideoCameraIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs text-gray-400 mt-2">Camera</span>
                        </button>
                    </div>

                    <div className="h-12 w-px bg-gray-700" />

                    <div className="text-center flex-1 mx-6">
                        <p className="text-gray-400 text-xs mb-1">AI Coach Suggestion</p>
                        <p className="text-white font-bold text-sm">"Slow down. You're rushing the GTM strategy. Pause for effect."</p>
                    </div>

                    <div className="h-12 w-px bg-gray-700" />

                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold">
                        End Pitch
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HoloPitchRoom;
