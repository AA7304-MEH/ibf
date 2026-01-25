import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { ChartBarIcon, HeartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const ParentalInsight: React.FC = () => {
    // Mock Data for Demo (In real app, fetch connected child's data)
    const [childStats, setChildStats] = useState({
        name: "Ashwin",
        weeklyScreenTime: 1420, // minutes
        weeklyFocusTime: 450,
        moodTrend: "Happy",
        topInterests: ["React", "AI/ML"]
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Parent Insight Portal</h1>
                    <p className="text-gray-500">Monitoring {childStats.name}'s digital wellbeing & growth.</p>
                </div>
                <div className="flex space-x-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <ShieldCheckIcon className="w-4 h-4 mr-1" /> Safe Mode Active
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Balance Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-700">Digital Balance</h3>
                        <ChartBarIcon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {Math.round(childStats.weeklyScreenTime / 60)}h <span className="text-lg text-gray-400 font-normal">this week</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Within healthy limits (25h max)</p>
                </motion.div>

                {/* Focus Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-700">Learning Focus</h3>
                        <div className="bg-purple-100 p-1 rounded">
                            <ChartBarIcon className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        7.5h <span className="text-lg text-gray-400 font-normal">Deep Work</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Top Activity: <strong>Building "SkillBridge"</strong>
                    </p>
                </motion.div>

                {/* Mood Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-xl border border-pink-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-700">Wellbeing Pulse</h3>
                        <HeartIcon className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="flex items-center">
                        <span className="text-4xl mr-3">🤩</span>
                        <div>
                            <p className="font-bold text-gray-900">Feeling Great</p>
                            <p className="text-xs text-gray-500">Avg. mood this week</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 italic">
                        "Ashwin seems highly motivated by the recent React project!"
                    </p>
                </motion.div>
            </div>

            {/* Discussion Prompts */}
            <div className="bg-blue-900 text-white rounded-xl p-8">
                <h2 className="text-xl font-bold mb-4">💡 Discussion Starters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-800/50 p-4 rounded-lg">
                        <p className="font-medium">"I saw you spent 3 hours focused on React yesterday. What was the hardest part you solved?"</p>
                    </div>
                    <div className="bg-blue-800/50 p-4 rounded-lg">
                        <p className="font-medium">"Your mood tracked as 'Tired' on Tuesday. Do you need help adjusting your schedule?"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentalInsight;
