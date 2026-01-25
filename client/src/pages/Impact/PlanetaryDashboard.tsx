import React from 'react';
import { motion } from 'framer-motion';
import { GlobeAmericasIcon, CloudIcon, BoltIcon, HeartIcon } from '@heroicons/react/24/outline';

const PlanetaryDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="mb-12 border-b border-gray-800 pb-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                            Planetary Impact Network
                        </h1>
                        <p className="text-gray-400 mt-2">Real-time telemetry of student contributions to UN Sustainable Development Goals.</p>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400 animate-pulse">
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-xs font-mono">LIVE FEED ACTIVE</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* 3D Globe Placeholder */}
                <div className="lg:col-span-3 bg-gray-900 rounded-3xl border border-gray-800 min-h-[500px] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover opacity-10 grayscale"></div>

                    {/* Pulsing Hotspots */}
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-500 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="absolute top-1/2 left-1/2 w-6 h-6 bg-blue-500 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-full"
                    />

                    <div className="relative z-10 text-center">
                        <GlobeAmericasIcon className="w-32 h-32 mx-auto text-gray-700 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-500">Global Project Map</h3>
                        <p className="text-gray-600">Visualizing 12,450 active student projects</p>
                    </div>
                </div>

                {/* SDG Metrics */}
                <div className="space-y-6">
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <div className="flex items-center mb-4">
                            <CloudIcon className="w-6 h-6 text-blue-400 mr-3" />
                            <h3 className="font-bold text-lg">Goal 13: Climate</h3>
                        </div>
                        <div className="text-3xl font-bold mb-1">8,921</div>
                        <p className="text-sm text-gray-500">kg CO2 Offset by Algo-Efficiency</p>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full mt-4">
                            <div className="h-full bg-blue-500 w-[70%]" />
                        </div>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <div className="flex items-center mb-4">
                            <BoltIcon className="w-6 h-6 text-yellow-400 mr-3" />
                            <h3 className="font-bold text-lg">Goal 7: Energy</h3>
                        </div>
                        <div className="text-3xl font-bold mb-1">142</div>
                        <p className="text-sm text-gray-500">Smart Grid Prototypes Deployed</p>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full mt-4">
                            <div className="h-full bg-yellow-400 w-[45%]" />
                        </div>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <div className="flex items-center mb-4">
                            <HeartIcon className="w-6 h-6 text-red-400 mr-3" />
                            <h3 className="font-bold text-lg">Goal 3: Health</h3>
                        </div>
                        <div className="text-3xl font-bold mb-1">54</div>
                        <p className="text-sm text-gray-500">Mental Health Apps Launched</p>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full mt-4">
                            <div className="h-full bg-red-400 w-[60%]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Feed Ticker */}
            <div className="mt-8 bg-gray-900 border border-gray-800 py-3 px-6 rounded-full flex items-center overflow-hidden">
                <span className="text-xs font-bold text-green-500 mr-4 whitespace-nowrap">LATEST IMPACT</span>
                <div className="flex space-x-12 animate-marquee whitespace-nowrap text-sm text-gray-400">
                    <span>🌱 Class 10B deployed Soil Sensor Array in Mumbai</span>
                    <span>⚡ Team Volt optimized solar algorithms (Efficiency +4%)</span>
                    <span>💧 WaterViz dashboard adopted by Local NGO</span>
                </div>
            </div>
        </div>
    );
};

export default PlanetaryDashboard;
