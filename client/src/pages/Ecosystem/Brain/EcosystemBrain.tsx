import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SignalIcon, GlobeAsiaAustraliaIcon, BoltIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';

const EcosystemBrain: React.FC = () => {
    const [activeView, setActiveView] = useState('signals');

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-4">
            <header className="mb-8 border-b border-green-900 pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-green-400 tracking-tighter flex items-center">
                        <GlobeAsiaAustraliaIcon className="w-8 h-8 mr-3 animate-pulse" />
                        ECOSYSTEM_BRAIN
                    </h1>
                    <p className="text-xs text-green-700 mt-1">QUANTUM SIGNAL PROCESSING // ACTIVE</p>
                </div>
                <div className="flex space-x-4 text-xs">
                    <div className="bg-green-900/20 px-3 py-1 border border-green-800 rounded">
                        <span className="text-green-600">LIVESTREAM:</span> 4.2TB/s
                    </div>
                    <div className="bg-green-900/20 px-3 py-1 border border-green-800 rounded">
                        <span className="text-green-600">NODES:</span> 14,203
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Signal Map */}
                <div className="md:col-span-2 bg-black border border-green-800 rounded-xl p-6 relative overflow-hidden min-h-[500px]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit.png')] opacity-10" />
                    <div className="absolute top-4 right-4 flex space-x-2">
                        {['signals', 'heatmaps', 'predictions'].map(view => (
                            <button
                                key={view}
                                onClick={() => setActiveView(view)}
                                className={`px-3 py-1 text-xs uppercase border ${activeView === view ? 'bg-green-900 border-green-500 text-white' : 'border-green-900 text-green-700 hover:text-green-500'}`}
                            >
                                {view}
                            </button>
                        ))}
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 flex items-center justify-center h-full">
                        {activeView === 'signals' && (
                            <div className="text-center">
                                <SignalIcon className="w-32 h-32 mx-auto text-green-900 animate-ping absolute" />
                                <SignalIcon className="w-32 h-32 mx-auto text-green-500 relative" />
                                <h3 className="mt-8 text-2xl font-bold text-white">DETECTING EMERGENCE</h3>
                                <div className="mt-4 space-y-2 text-sm text-green-400">
                                    <p>&gt; Signal Detected: "Generative Bio-Design" (+450% mentions)</p>
                                    <p>&gt; Anomaly: Talent migration from FinTech to AgTech</p>
                                    <p>&gt; Prediction: "Carbon Accounting" saturation in 3 months</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Intelligence */}
                <div className="space-y-6">
                    <div className="bg-black border border-green-800 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center">
                            <BoltIcon className="w-4 h-4 mr-2 text-yellow-500" />
                            OPPORTUNITY_RADAR
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b border-green-900 pb-2">
                                <div>
                                    <p className="text-xs text-green-300">Space Logistics</p>
                                    <p className="text-[10px] text-green-700">Early Stage • High Risk</p>
                                </div>
                                <span className="px-2 py-0.5 bg-green-900 text-green-400 text-[10px] font-bold rounded">92% GROWTH</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-green-900 pb-2">
                                <div>
                                    <p className="text-xs text-green-300">Neuro-Marketing</p>
                                    <p className="text-[10px] text-green-700">Mainstream • Med Risk</p>
                                </div>
                                <span className="px-2 py-0.5 bg-green-900 text-green-400 text-[10px] font-bold rounded">67% GROWTH</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black border border-green-800 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center">
                            <PresentationChartLineIcon className="w-4 h-4 mr-2 text-blue-500" />
                            COLLECTIVE_LEARNING
                        </h3>
                        <div className="text-xs text-green-600 space-y-2">
                            <p>
                                <span className="text-white">ALERT:</span> 14 startups reported increased CAC on LinkedIn Ads. Recommendation: Shift to organic community growth.
                            </p>
                            <p>
                                <span className="text-white">INSIGHT:</span> Haskell developers are completing projects 30% faster than average.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EcosystemBrain;
