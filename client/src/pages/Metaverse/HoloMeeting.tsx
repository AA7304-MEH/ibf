import React from 'react';
import { motion } from 'framer-motion';
import { MicrophoneIcon, VideoCameraIcon, HandRaisedIcon, FaceSmileIcon } from '@heroicons/react/24/solid';

const HoloMeeting: React.FC = () => {
    const participants = [
        { name: 'You', role: 'Dev Lead', color: 'bg-blue-500', speaking: true },
        { name: 'Sarah (AI)', role: 'Designer', color: 'bg-pink-500', speaking: false },
        { name: 'Alex (Mentor)', role: 'Advisor', color: 'bg-green-500', speaking: false },
        { name: 'Sam', role: 'Data Scientist', color: 'bg-purple-500', speaking: false },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 relative overflow-hidden">
            {/* 3D Room Grid */}
            <div className="absolute inset-0 perspective-1000">
                <div className="w-full h-full border-t border-b border-blue-500/30 transform rotate-x-12 translate-z-10" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/20" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-blue-500/20" />
            </div>

            <header className="relative z-10 flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-2xl font-bold flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse" />
                        Daily Standup • Project Alpha
                    </h1>
                    <p className="text-gray-400 text-sm ml-6">Holo-Bridge Active | Latency: 12ms</p>
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 flex items-center space-x-4">
                    <span className="font-mono text-cyan-400">00:14:32</span>
                    <button onClick={() => alert("Ghost Session Activated: Replaying yesterday's brainstorming")} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded border border-gray-600">
                        👻 Play Ghost Session
                    </button>
                </div>
            </header>

            {/* Main Stage */}
            <div className="relative z-10 flex items-center justify-center h-[60vh]">
                {/* Central Object (Hologram) */}
                <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full border border-blue-400/30 backdrop-blur-sm animate-spin-slow flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-4xl">📦</div>
                        <p className="text-xs text-blue-300 mt-2 tracking-widest">PROTOTYPE V2</p>
                    </div>
                </div>

                {/* Avatar Circle */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-5xl">
                    {participants.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <div className={`relative w-24 h-24 rounded-full ${p.color} bg-opacity-20 border-2 ${p.speaking ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : `border-${p.color.split('-')[1]}-500/50`} flex items-center justify-center`}>
                                <div className={`w-20 h-20 rounded-full ${p.color} flex items-center justify-center text-xl font-bold shadow-inner`}>
                                    {p.name.charAt(0)}
                                </div>
                                {p.speaking && (
                                    <div className="absolute -bottom-2 bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">
                                        SPEAKING
                                    </div>
                                )}
                            </div>
                            <h3 className="mt-3 font-bold">{p.name}</h3>
                            <p className="text-xs text-gray-400">{p.role}</p>

                            {/* Audio Wave */}
                            {p.speaking && (
                                <div className="flex space-x-1 mt-2 h-4 items-end">
                                    {[1, 2, 3, 4, 3, 2].map((_, k) => (
                                        <motion.div
                                            key={k}
                                            animate={{ height: [4, 12, 4] }}
                                            transition={{ repeat: Infinity, duration: 0.5, delay: k * 0.1 }}
                                            className="w-1 bg-green-400 rounded-full"
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="relative z-10 mx-auto max-w-xl bg-gray-800/80 backdrop-blur border border-gray-700 rounded-full p-4 flex justify-between items-center shadow-2xl">
                <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
                    <MicrophoneIcon className="w-6 h-6" />
                </button>
                <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
                    <VideoCameraIcon className="w-6 h-6" />
                </button>
                <button className="p-3 bg-red-600 rounded-full hover:bg-red-700 px-8 font-bold">
                    LEAVE
                </button>
                <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
                    <HandRaisedIcon className="w-6 h-6" />
                </button>
                <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
                    <FaceSmileIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default HoloMeeting;
