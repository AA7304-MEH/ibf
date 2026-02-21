import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShareIcon, ChartBarIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';

const StartupMultiverse: React.FC = () => {
    const [scenario, setScenario] = useState('Optimistic');

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <header className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Startup Multiverse
                    </h1>
                    <p className="text-gray-400 mt-2">Simulating 1,000+ Quantum Futures for <span className="text-white font-bold">Project Alpha</span></p>
                </div>
                <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition">
                        Run New Simulation
                    </button>
                    <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        <span className="text-xs font-mono">Quantum Core: ONLINE</span>
                    </div>
                </div>
            </header>

            {/* Monte Carlo Simulation Engine */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center">
                            <ChartBarIcon className="w-6 h-6 mr-2 text-purple-400" />
                            Monte Carlo Decision Engine
                        </h3>
                        <span className="text-xs bg-purple-900 text-purple-200 px-2 py-1 rounded">1,000 RUNS</span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2 text-gray-400">
                                <span>Market Volatility</span>
                                <span>High (Crypto Winter)</span>
                            </div>
                            <input type="range" className="w-full accent-purple-500 bg-gray-700 h-2 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2 text-gray-400">
                                <span>Burn Rate Multiplier</span>
                                <span>1.5x (Aggressive Hiring)</span>
                            </div>
                            <input type="range" className="w-full accent-purple-500 bg-gray-700 h-2 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 mt-4">
                            <p className="text-sm font-bold text-gray-400 mb-2">Simulated Outcome Distribution</p>
                            <div className="flex items-end space-x-1 h-32">
                                {[10, 25, 40, 65, 80, 95, 60, 40, 20, 10].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        className={`flex-1 rounded-t-sm ${i > 6 ? 'bg-red-500/50' : 'bg-green-500/50'}`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Bankruptcy</span>
                                <span>IPO</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Runway Optimizer */}
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center">
                            <ClockIcon className="w-6 h-6 mr-2 text-yellow-400" />
                            Runway Optimizer
                        </h3>
                        <span className="text-xs font-mono text-yellow-400">14 MONTHS LEFT</span>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 border border-yellow-500/30 bg-yellow-900/10 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="font-bold text-white">Scenario A: Status Quo</p>
                                <p className="text-xs text-gray-400">Survival Probability: 65%</p>
                            </div>
                            <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">Active</button>
                        </div>
                        <div className="p-4 border border-green-500/30 bg-green-900/10 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="font-bold text-white">Scenario B: Pivot to SaaS</p>
                                <p className="text-xs text-gray-400">Survival Probability: <span className="text-green-400 font-bold">88%</span></p>
                            </div>
                            <button className="text-xs bg-green-700 hover:bg-green-600 px-3 py-1 rounded text-white font-bold">Switch</button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <p className="text-sm text-gray-400 mb-2">Optimal Fundraising Window</p>
                            <div className="w-full bg-gray-900 h-8 rounded-full relative overflow-hidden">
                                <div className="absolute left-[40%] w-[20%] h-full bg-green-500/20 border-x border-green-500 flex items-center justify-center text-xs text-green-400 font-bold">
                                    Q3 2026
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1 text-center">Based on market liquidity forecasts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Branching Visualizer (Legacy) */}
            <div className="relative mb-12 bg-gray-800/50 rounded-2xl p-8 border border-gray-700 overflow-hidden opacity-50 pointer-events-none grayscale">
                <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                    <span className="bg-black border border-gray-500 px-3 py-1 text-xs text-gray-400 rounded">Legacy View Archived</span>
                </div>

                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center">
                        <ShareIcon className="w-6 h-6 mr-2 text-purple-400" />
                        Timeline Probability Flux
                    </h3>
                    <select
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-1"
                    >
                        <option>Optimistic (Bull Market)</option>
                        <option>Realistic (Base Case)</option>
                        <option>Pessimistic (Recession)</option>
                        <option>Black Swan Event</option>
                    </select>
                </div>

                <div className="relative h-64 flex items-center">
                    {/* Main Timeline */}
                    <div className="absolute left-0 right-0 h-1 bg-gray-700 top-1/2 transform -translate-y-1/2" />

                    {/* Nodes */}
                    <div className="absolute left-[10%] top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-center group cursor-pointer z-10">
                        <div className="w-6 h-6 bg-white rounded-full border-4 border-purple-600 group-hover:scale-125 transition" />
                        <p className="mt-4 text-xs text-gray-400 group-hover:text-white">Now</p>
                    </div>

                    <div className="absolute left-[30%] top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-center group cursor-pointer z-10">
                        <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-400 group-hover:bg-purple-500 transition" />
                        <p className="mt-4 text-xs text-gray-500 w-24 mx-auto opacity-0 group-hover:opacity-100 transition">Seed Round</p>
                    </div>

                    <div className="absolute left-[50%] top-1/3 transform -translate-y-1/2 -translate-x-1/2 text-center group cursor-pointer">
                        <div className="relative">
                            <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-green-300 animate-pulse" />
                            <div className="absolute top-0 left-0 w-8 h-8 bg-green-500 rounded-full animate-ping opacity-20" />
                        </div>
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-green-500 p-2 rounded w-48 hidden group-hover:block z-20">
                            <p className="font-bold text-green-400">Product Market Fit</p>
                            <p className="text-xs text-gray-300">Probability: 64%</p>
                            <p className="text-xs text-gray-400 mt-1">Key Driver: Viral Loop</p>
                        </div>
                    </div>

                    {/* Divergent Path (Failure) */}
                    <motion.div
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        className="absolute left-[30%] top-1/2 w-[30%] h-32 border-t-2 border-r-2 border-dotted border-red-500/50 rounded-tr-3xl"
                        style={{ transform: 'translateY(-1px)' }}
                    />
                    <div className="absolute left-[60%] top-[calc(50%+8rem)] transform -translate-y-1/2 -translate-x-1/2 text-center">
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <p className="text-xs text-red-400">Cash Crunch (22%)</p>
                    </div>

                    {/* Success Path */}
                    <div className="absolute right-[10%] top-1/4 transform -translate-y-1/2 -translate-x-1/2 text-center">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full border-4 border-yellow-200 shadow-glow-yellow flex items-center justify-center text-black font-bold text-xl">
                            🦄
                        </div>
                        <p className="mt-4 font-bold text-yellow-400">Unicorn Status</p>
                        <p className="text-xs text-gray-500">Year 5 Forecast</p>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                    <h3 className="text-gray-400 font-bold mb-4 flex items-center">
                        <ChartBarIcon className="w-5 h-5 mr-2" />
                        Survival Probability
                    </h3>
                    <div className="relative pt-4">
                        <div className="flex items-end space-x-2 h-32">
                            <div className="w-1/3 bg-red-900/50 h-[30%] rounded-t relative group">
                                <div className="absolute bottom-0 w-full bg-red-500 h-[80%] rounded-t transition-all group-hover:h-full" />
                                <p className="absolute -top-6 text-xs text-center w-full">Year 1</p>
                            </div>
                            <div className="w-1/3 bg-yellow-900/50 h-[50%] rounded-t relative group">
                                <div className="absolute bottom-0 w-full bg-yellow-500 h-[60%] rounded-t transition-all group-hover:h-full" />
                                <p className="absolute -top-6 text-xs text-center w-full">Year 3</p>
                            </div>
                            <div className="w-1/3 bg-green-900/50 h-[80%] rounded-t relative group">
                                <div className="absolute bottom-0 w-full bg-green-500 h-[45%] rounded-t transition-all group-hover:h-full" />
                                <p className="absolute -top-6 text-xs text-center w-full">Year 5</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                    <h3 className="text-gray-400 font-bold mb-4 flex items-center">
                        Competitor Simulation
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg border border-red-900/30">
                            <div>
                                <p className="font-bold text-red-400">Nemesis Corp</p>
                                <p className="text-xs text-gray-500">Aggressive Strategy</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">+12% Share</p>
                                <p className="text-xs text-red-500">Disruption Risk: High</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-900 rounded-lg border border-blue-900/30">
                            <div>
                                <p className="font-bold text-blue-400">Clone Inc</p>
                                <p className="text-xs text-gray-500">Fast Follower</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">+5% Share</p>
                                <p className="text-xs text-yellow-500">Nuisance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupMultiverse;
