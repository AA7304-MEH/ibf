import React, { useState, useEffect } from 'react';
import { TrophyIcon, FireIcon, SparklesIcon, ChartBarIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import api from '../../../../services/api';

interface LeaderboardUser {
    rank: number;
    user: {
        firstName: string;
        lastName: string;
        avatar?: string;
    };
    xp: number;
    level: number;
    streak: number;
    badgeCount: number;
}

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [scope, setScope] = useState<'global' | 'school' | 'regional'>('global');

    useEffect(() => {
        fetchLeaderboard();
    }, [scope]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/gamification/leaderboard?scope=${scope}&limit=50`);
            setLeaderboard(res.data);
        } catch (error) {
            // Mock data for demo
            setLeaderboard([
                { rank: 1, user: { firstName: 'Alex', lastName: 'Chen' }, xp: 12500, level: 25, streak: 45, badgeCount: 18 },
                { rank: 2, user: { firstName: 'Maya', lastName: 'Patel' }, xp: 11200, level: 23, streak: 30, badgeCount: 15 },
                { rank: 3, user: { firstName: 'Jordan', lastName: 'Lee' }, xp: 10800, level: 22, streak: 28, badgeCount: 14 },
                { rank: 4, user: { firstName: 'Sam', lastName: 'Taylor' }, xp: 9500, level: 20, streak: 21, badgeCount: 12 },
                { rank: 5, user: { firstName: 'Riley', lastName: 'Smith' }, xp: 8900, level: 19, streak: 15, badgeCount: 11 },
                { rank: 6, user: { firstName: 'Casey', lastName: 'Brown' }, xp: 8200, level: 18, streak: 12, badgeCount: 10 },
                { rank: 7, user: { firstName: 'Morgan', lastName: 'Davis' }, xp: 7800, level: 17, streak: 10, badgeCount: 9 },
                { rank: 8, user: { firstName: 'Quinn', lastName: 'Wilson' }, xp: 7200, level: 16, streak: 8, badgeCount: 8 },
                { rank: 9, user: { firstName: 'Blake', lastName: 'Anderson' }, xp: 6800, level: 15, streak: 7, badgeCount: 7 },
                { rank: 10, user: { firstName: 'Avery', lastName: 'Thomas' }, xp: 6500, level: 14, streak: 5, badgeCount: 6 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getRankStyle = (rank: number) => {
        switch (rank) {
            case 1: return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-amber-200/50';
            case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
            case 3: return 'bg-gradient-to-r from-orange-400 to-amber-600 text-white';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return '👑';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden mb-8"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <TrophyIcon className="w-10 h-10 text-amber-300" />
                            <h1 className="text-4xl font-bold">Leaderboard</h1>
                        </div>
                        <p className="text-white/80 text-lg">Top performers across the SkillSwap community</p>
                    </div>

                    {/* Scope Selector */}
                    <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-sm rounded-xl">
                        {(['global', 'school', 'regional'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setScope(s)}
                                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${scope === s
                                    ? 'bg-white text-indigo-600 shadow-md'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {s === 'global' ? '🌍 Global' : s === 'school' ? '🏫 School' : '📍 Regional'}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                {/* 2nd Place */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="order-1 self-end"
                >
                    {leaderboard[1] && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-lg border-2 border-gray-300 dark:border-gray-600">
                            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl">
                                🥈
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white">
                                {leaderboard[1].user.firstName}
                            </p>
                            <p className="text-sm text-gray-500">Level {leaderboard[1].level}</p>
                            <p className="text-lg font-bold text-indigo-600">{leaderboard[1].xp.toLocaleString()} XP</p>
                        </div>
                    )}
                </motion.div>

                {/* 1st Place */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="order-2"
                >
                    {leaderboard[0] && (
                        <div className="bg-gradient-to-b from-amber-400 to-yellow-500 rounded-2xl p-6 text-center shadow-xl transform scale-110 relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl">👑</div>
                            <div className="w-20 h-20 bg-white rounded-full mx-auto mt-4 mb-2 flex items-center justify-center text-4xl shadow-lg">
                                🏆
                            </div>
                            <p className="font-bold text-xl text-amber-900">
                                {leaderboard[0].user.firstName}
                            </p>
                            <p className="text-sm text-amber-800/70">Level {leaderboard[0].level}</p>
                            <p className="text-2xl font-bold text-amber-900">{leaderboard[0].xp.toLocaleString()} XP</p>
                            <div className="flex justify-center gap-4 mt-2 text-amber-800">
                                <span className="flex items-center gap-1 text-sm">
                                    <FireIcon className="w-4 h-4" /> {leaderboard[0].streak}d
                                </span>
                                <span className="flex items-center gap-1 text-sm">
                                    <SparklesIcon className="w-4 h-4" /> {leaderboard[0].badgeCount}
                                </span>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* 3rd Place */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="order-3 self-end"
                >
                    {leaderboard[2] && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-lg border-2 border-orange-400">
                            <div className="w-16 h-16 bg-gradient-to-b from-orange-400 to-amber-600 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl">
                                🥉
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white">
                                {leaderboard[2].user.firstName}
                            </p>
                            <p className="text-sm text-gray-500">Level {leaderboard[2].level}</p>
                            <p className="text-lg font-bold text-indigo-600">{leaderboard[2].xp.toLocaleString()} XP</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Full Leaderboard Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ChartBarIcon className="w-5 h-5 text-indigo-600" />
                        Full Rankings
                    </h2>
                    <span className="text-sm text-gray-500">{leaderboard.length} players</span>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {leaderboard.slice(3).map((entry, idx) => (
                            <motion.div
                                key={entry.rank}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyle(entry.rank)}`}>
                                        #{entry.rank}
                                    </span>
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {entry.user.firstName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            {entry.user.firstName} {entry.user.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">Level {entry.level}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 uppercase">XP</p>
                                        <p className="font-bold text-indigo-600">{entry.xp.toLocaleString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 uppercase">Streak</p>
                                        <p className="font-bold text-orange-500 flex items-center gap-1">
                                            <FireIcon className="w-4 h-4" /> {entry.streak}d
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 uppercase">Badges</p>
                                        <p className="font-bold text-purple-500 flex items-center gap-1">
                                            <SparklesIcon className="w-4 h-4" /> {entry.badgeCount}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
