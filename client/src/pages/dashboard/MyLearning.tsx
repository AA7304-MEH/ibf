import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

// Mock Data (Replace with real API later)
const MOCK_BADGES = [
    { id: '1', name: 'First Step', icon: '🚀', description: 'Joined SkillSwap' },
    { id: '2', name: 'Fast Learner', icon: '⚡', description: 'Completed 5 lessons' },
    { id: '3', name: 'Team Player', icon: '🤝', description: 'Joined a project' }
];

const MyLearning: React.FC = () => {
    const { user } = useAuth();

    // Fallback values if backend hasn't updated user object yet
    const xp = (user as any)?.xp || 150;
    const level = (user as any)?.level || 2;
    const streak = (user as any)?.loginStreak || 3;
    const badges = (user as any)?.badges || MOCK_BADGES;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Learning Path</h1>
                    <p className="text-gray-500">Track your skills, unlock badges, and level up!</p>
                </div>
                <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
                    <div className="flex flex-col items-center px-4 border-r border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-gray-500 uppercase">Current Level</span>
                        <span className="text-2xl font-bold text-ibf-primary">{level}</span>
                    </div>
                    <div className="flex flex-col items-center px-4 border-r border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-gray-500 uppercase">Total XP</span>
                        <span className="text-2xl font-bold text-ibf-secondary">{xp}</span>
                    </div>
                    <div className="flex flex-col items-center px-4">
                        <span className="text-xs text-gray-500 uppercase">Streak</span>
                        <div className="flex items-center space-x-1">
                            <span className="text-2xl font-bold text-orange-500">{streak}</span>
                            <span className="text-xl">🔥</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Level Progress */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">Level Progress</span>
                    <span className="text-sm text-gray-500">{xp} / 300 XP (Next Level)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden">
                    <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(xp / 300) * 100}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Learning Path */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Current Path: Full Stack Hero</h3>

                    <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-8">
                        {/* Timeline Item 1 */}
                        <div className="relative pl-8">
                            <div className="absolute -left-2.5 top-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-gray-800" />
                            <h4 className="font-bold text-gray-900 dark:text-white">HTML & CSS Mastery</h4>
                            <p className="text-sm text-gray-500 mb-2">Completed 2 days ago</p>
                            <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">Done</span>
                        </div>
                        {/* Timeline Item 2 */}
                        <div className="relative pl-8">
                            <div className="absolute -left-2.5 top-0 w-5 h-5 bg-blue-500 rounded-full border-4 border-white dark:border-gray-800 animate-pulse" />
                            <h4 className="font-bold text-gray-900 dark:text-white">JavaScript Basics</h4>
                            <p className="text-sm text-gray-500 mb-2">In Progress - 60%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
                            </div>
                        </div>
                        {/* Timeline Item 3 */}
                        <div className="relative pl-8">
                            <div className="absolute -left-2.5 top-0 w-5 h-5 bg-gray-300 rounded-full border-4 border-white dark:border-gray-800" />
                            <h4 className="font-bold text-gray-400">React Components</h4>
                            <p className="text-sm text-gray-400 mb-2">Locked</p>
                        </div>
                    </div>
                </div>

                {/* Badge Showcase */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Trophy Case</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {badges.map((badge: any, i: number) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700"
                            >
                                <span className="text-4xl mb-2 filter drop-shadow-md">{badge.icon}</span>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{badge.name}</span>
                            </motion.div>
                        ))}
                        {/* Locked Slot */}
                        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 opacity-50">
                            <span className="text-2xl mb-1">🔒</span>
                            <span className="text-xs text-gray-500">Next Badge</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyLearning;
