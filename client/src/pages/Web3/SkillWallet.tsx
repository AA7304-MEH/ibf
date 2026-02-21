import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    QrCodeIcon,
    ShieldCheckIcon,
    AcademicCapIcon,
    ShareIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const SkillWallet: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-12 text-center">Loading Wallet...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <ShieldCheckIcon className="w-8 h-8 text-indigo-600" />
                            SkillWallet™
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">Verified Blockchain Credentials</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg">
                        <ShareIcon className="w-5 h-5" />
                        Share Profile
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Identity Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl"
                    >
                        <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-4xl font-bold">{user.firstName?.charAt(0)}</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-1">{user.firstName} {user.lastName}</h2>
                        <p className="text-indigo-100 mb-6 font-mono text-sm">ID: {user._id?.substring(0, 8)}...</p>

                        <div className="bg-white/10 rounded-xl p-4 mb-6">
                            <p className="text-sm text-indigo-200 uppercase tracking-wider mb-1">Total XP</p>
                            <p className="text-3xl font-bold">{user.xp || 0}</p>
                        </div>

                        <div className="flex justify-center">
                            <QrCodeIcon className="w-16 h-16 text-white/50" />
                        </div>
                    </motion.div>

                    {/* Credentials & Badges */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Verified Skills */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <AcademicCapIcon className="w-5 h-5 text-indigo-500" />
                                Verified Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skills?.length > 0 ? (
                                    user.skills.map((skill: any, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium border border-indigo-100 dark:border-indigo-800">
                                            {skill.name} • Lvl {skill.level}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic">No skills verified yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Badges / NFT Assets */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Earned Badges (NFTs)</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {user.badges?.map((badge: any, idx: number) => (
                                    <div key={idx} className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                                        <div className="text-2xl mb-2">{badge.icon || '🏅'}</div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{badge.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(badge.unlockedAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                                {(!user.badges || user.badges.length === 0) && (
                                    <p className="col-span-3 text-gray-400 italic text-center py-4">Complete missions to earn badges.</p>
                                )}
                            </div>
                        </div>

                        {/* Export Actions */}
                        <div className="flex gap-4">
                            <button className="flex-1 flex justify-center items-center gap-2 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Download Transcript (PDF)
                            </button>
                            <button className="flex-1 flex justify-center items-center gap-2 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-300 transition-colors">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Export JSON (Data)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillWallet;
