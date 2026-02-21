import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SignalIcon, GlobeAsiaAustraliaIcon, BoltIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { ecosystemService } from '../../../services/ecosystem.service';

const EcosystemBrain: React.FC = () => {
    const [activeView, setActiveView] = useState('signals');
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await ecosystemService.getStats();
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Failed to load ecosystem stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex items-center justify-center">INITIALIZING NEURAL LINK...</div>;

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
                        <span className="text-green-600">LIVESTREAM:</span> {stats?.livestream_rate || '0.0TB/s'}
                    </div>
                    <div className="bg-green-900/20 px-3 py-1 border border-green-800 rounded">
                        <span className="text-green-600">NODES:</span> {stats?.nodes?.toLocaleString() || 0}
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
                            <div className="text-center w-full max-w-lg">
                                <SignalIcon className="w-32 h-32 mx-auto text-green-900 animate-ping absolute left-0 right-0" />
                                <SignalIcon className="w-32 h-32 mx-auto text-green-500 relative" />
                                <h3 className="mt-8 text-2xl font-bold text-white">DETECTING EMERGENCE</h3>
                                <div className="mt-4 space-y-3 text-sm text-green-400 text-left bg-green-900/10 p-4 rounded-lg border border-green-900/50 backdrop-blur-sm">
                                    {stats?.signals?.map((s: any, i: number) => (
                                        <p key={i} className="flex justify-between">
                                            <span>&gt; Signal Detected: "{s.name}"</span>
                                            <span className="text-green-300">{s.trend} (Vol: {s.strength})</span>
                                        </p>
                                    ))}
                                    {(!stats?.signals || stats.signals.length === 0) && <p>&gt; Scanning for signals...</p>}
                                </div>
                            </div>
                        )}

                        {activeView === 'heatmaps' && (
                            <div className="w-full h-full p-4 flex flex-col items-center justify-center">
                                <h3 className="text-xl font-bold text-white mb-6">GLOBAL ACTIVITY ZONES</h3>
                                <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0.3 }}
                                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                                            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                                            className={`h-24 rounded-lg border border-green-500/30 flex items-center justify-center ${i % 3 === 0 ? 'bg-green-500/20' : i % 2 === 0 ? 'bg-blue-500/10' : 'bg-red-500/10'
                                                }`}
                                        >
                                            <span className="text-xs font-mono text-green-300">ZONE_{i < 10 ? '0' + i : i}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeView === 'predictions' && (
                            <div className="w-full max-w-2xl text-left">
                                <h3 className="text-xl font-bold text-white mb-6 text-center">QUANTUM FORECAST</h3>
                                <div className="space-y-4">
                                    {stats?.opportunities?.map((opp: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-green-900/10 border border-green-800 p-4 rounded-xl flex items-center gap-4 relative overflow-hidden"
                                        >
                                            {/* AI Confidence Bar Background */}
                                            <div
                                                className="absolute bottom-0 left-0 h-1 bg-green-500/50"
                                                style={{ width: opp.ai_confidence }}
                                            />

                                            <div className="w-2 h-12 bg-green-500 rounded-full" />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-green-400">{opp.sector} Boom</h4>
                                                    <span className="text-[10px] uppercase border border-green-500/30 px-2 py-0.5 rounded text-green-300">
                                                        AI Conf: {opp.ai_confidence}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-green-200 mt-1">
                                                    Probability of market dominance in {opp.sector} sector is increasing by {opp.growth}.
                                                    Recommended action: Allocate resources to {opp.risk === 'High Risk' ? 'experimental' : 'core'} teams.
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div className="p-4 rounded-xl border border-dashed border-green-700 text-center text-green-600 text-sm">
                                        &gt; PROCESSING NEXT QUARTER PROJECTIONS...
                                    </div>
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
                            {stats?.opportunities?.map((opp: any, i: number) => (
                                <div key={i} className="flex justify-between items-center border-b border-green-900 pb-2 last:border-0">
                                    <div>
                                        <p className="text-xs text-green-300">{opp.sector}</p>
                                        <p className="text-[10px] text-green-700">Early Stage • {opp.risk}</p>
                                    </div>
                                    <span className="px-2 py-0.5 bg-green-900 text-green-400 text-[10px] font-bold rounded">{opp.growth}</span>
                                </div>
                            )) || <p className="text-xs text-green-700">Calibrating radar...</p>}
                        </div>
                    </div>

                    <div className="bg-black border border-green-800 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center">
                            <PresentationChartLineIcon className="w-4 h-4 mr-2 text-blue-500" />
                            COLLECTIVE_LEARNING
                        </h3>
                        <div className="text-xs text-green-600 space-y-2">
                            <p>
                                <span className="text-white">VELOCITY:</span> System learning rate is {stats?.learning_velocity || 'NORMAL'}.
                            </p>
                            <p>
                                <span className="text-white">INSIGHT:</span> {stats?.nodes || 0} active nodes contributing to global intelligence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EcosystemBrain;
