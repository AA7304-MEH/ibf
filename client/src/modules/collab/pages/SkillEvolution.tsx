import React from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, ArrowTrendingUpIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const SkillEvolution: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <header className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center">
                        <ArrowTrendingUpIcon className="w-8 h-8 mr-3 text-cyan-400" />
                        Skill Evolution
                    </h1>
                    <p className="text-gray-400 mt-2">Predictive growth trajectories based on current project velocity.</p>
                </div>
                <div className="flex space-x-4">
                    <div className="bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 flex flex-col items-center">
                        <span className="text-xs text-gray-500">Current Velocity</span>
                        <span className="font-bold text-cyan-400 text-lg">2.4x</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Main Trajectory Chart */}
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 h-[400px] flex flex-col relative overflow-hidden">
                    <h3 className="font-bold text-lg mb-4">Mastery Projection: Full Stack AI</h3>

                    <div className="flex-1 flex items-end justify-between px-4 relative z-10">
                        {/* Month Labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pb-2 px-8">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        </div>

                        {/* Bars / Lines */}
                        <div className="flex items-end space-x-4 w-full h-[80%] mb-6">
                            <motion.div initial={{ height: '20%' }} animate={{ height: '25%' }} className="flex-1 bg-gray-700 rounded-t-lg" />
                            <motion.div initial={{ height: '25%' }} animate={{ height: '35%' }} className="flex-1 bg-gray-700 rounded-t-lg" />
                            <motion.div initial={{ height: '35%' }} animate={{ height: '42%' }} className="flex-1 bg-cyan-900/50 border-t-2 border-cyan-500 rounded-t-lg relative group">
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100">You Are Here</div>
                            </motion.div>
                            <motion.div initial={{ height: '42%' }} animate={{ height: '55%' }} className="flex-1 bg-gray-700/50 border-t border-dashed border-gray-500 rounded-t-lg" />
                            <motion.div initial={{ height: '55%' }} animate={{ height: '70%' }} className="flex-1 bg-gray-700/50 border-t border-dashed border-gray-500 rounded-t-lg" />
                            <motion.div initial={{ height: '70%' }} animate={{ height: '88%' }} className="flex-1 bg-gray-700/50 border-t border-dashed border-gray-500 rounded-t-lg" />
                        </div>
                    </div>

                    {/* Milestone Marker */}
                    <div className="absolute top-20 right-10">
                        <div className="flex items-center space-x-2">
                            <TrophyIcon className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm font-bold text-yellow-400">Expert Level</span>
                        </div>
                        <p className="text-xs text-gray-500 text-right">Predicted by June</p>
                    </div>
                </div>

                {/* Micro-Actions Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-2xl border border-indigo-700">
                        <h3 className="font-bold text-lg mb-2 flex items-center">
                            <RocketLaunchIcon className="w-5 h-5 mr-2 text-white" />
                            Accelerator Detected
                        </h3>
                        <p className="text-sm text-indigo-200 mb-4">
                            Completing the "Vector Database Integration" task in your current project will increase your Backend Score by <span className="text-white font-bold">+15 points</span>.
                        </p>
                        <button className="bg-white text-indigo-900 font-bold py-2 px-4 rounded-lg text-sm hover:bg-indigo-50 transition">
                            Start Micro-Module: Vector DBs
                        </button>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                        <h3 className="font-bold text-white mb-4">Skill Portfolio Value</h3>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-3xl font-bold text-white">$145/hr</span>
                            <span className="text-green-500 font-bold text-sm">+12% this month</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Your "System Architecture" skills are trending up in the Global Market Pulse.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillEvolution;
