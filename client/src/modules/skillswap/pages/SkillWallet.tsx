import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    WalletIcon,
    SparklesIcon,
    CheckBadgeIcon,
    TrophyIcon,
    AcademicCapIcon,
    StarIcon,
    ShieldCheckIcon,
    ClockIcon,
    ArrowUpIcon,
    DocumentDuplicateIcon,
    ShareIcon,
    XMarkIcon,
    FireIcon
} from '@heroicons/react/24/outline';

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xpValue: number;
    earnedAt?: Date;
    isOwned: boolean;
    progress?: number;
    requirement?: string;
    tokenId?: string;
}

interface Credential {
    id: string;
    name: string;
    issuer: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    endorsements: number;
    projects: number;
    verified: boolean;
    earnedAt: Date;
}

const SkillWallet: React.FC = () => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
    const [loading, setLoading] = useState(true);
    const [totalXP, setTotalXP] = useState(0);
    const [claimingBadge, setClaimingBadge] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const rarityColors: Record<string, string> = {
        common: 'from-gray-400 to-gray-500',
        rare: 'from-blue-400 to-blue-600',
        epic: 'from-purple-400 to-purple-600',
        legendary: 'from-amber-400 to-orange-500'
    };

    const rarityBgColors: Record<string, string> = {
        common: 'bg-gray-500/20 border-gray-500/30',
        rare: 'bg-blue-500/20 border-blue-500/30',
        epic: 'bg-purple-500/20 border-purple-500/30',
        legendary: 'bg-amber-500/20 border-amber-500/30'
    };

    const levelColors: Record<string, string> = {
        beginner: 'text-green-400',
        intermediate: 'text-blue-400',
        advanced: 'text-purple-400',
        expert: 'text-amber-400'
    };

    useEffect(() => {
        // Load mock data
        setTimeout(() => {
            setBadges([
                { id: '1', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', rarity: 'common', xpValue: 50, earnedAt: new Date('2024-01-15'), isOwned: true, tokenId: '0x1a2b3c' },
                { id: '2', name: 'Code Warrior', description: 'Complete 10 coding challenges', icon: '⚔️', rarity: 'rare', xpValue: 200, earnedAt: new Date('2024-02-01'), isOwned: true, tokenId: '0x4d5e6f' },
                { id: '3', name: 'Team Player', description: 'Collaborate on 5 projects', icon: '🤝', rarity: 'epic', xpValue: 500, earnedAt: new Date('2024-02-20'), isOwned: true, tokenId: '0x7g8h9i' },
                { id: '4', name: 'Mentor Master', description: 'Help 20 students', icon: '🎓', rarity: 'legendary', xpValue: 1000, isOwned: false, progress: 65, requirement: 'Help 13 more students' },
                { id: '5', name: 'Streak Legend', description: 'Maintain 30 day streak', icon: '🔥', rarity: 'epic', xpValue: 750, isOwned: false, progress: 80, requirement: '6 more days' },
                { id: '6', name: 'Hackathon Hero', description: 'Win a hackathon', icon: '🏆', rarity: 'legendary', xpValue: 1500, isOwned: false, progress: 0, requirement: 'Enter and win a hackathon' }
            ]);
            setCredentials([
                { id: 'c1', name: 'React Development', issuer: 'SkillSwap Academy', level: 'advanced', endorsements: 12, projects: 8, verified: true, earnedAt: new Date('2024-02-15') },
                { id: 'c2', name: 'UI/UX Design', issuer: 'Design Guild', level: 'intermediate', endorsements: 8, projects: 5, verified: true, earnedAt: new Date('2024-01-20') },
                { id: 'c3', name: 'Project Management', issuer: 'Agile Institute', level: 'beginner', endorsements: 3, projects: 2, verified: true, earnedAt: new Date('2024-03-01') }
            ]);
            setTotalXP(2450);
            setLoading(false);
        }, 500);
    }, []);

    const handleClaimBadge = (badge: Badge) => {
        if (badge.progress === 100) {
            setClaimingBadge(badge.id);
            setTimeout(() => {
                setBadges(prev => prev.map(b =>
                    b.id === badge.id
                        ? { ...b, isOwned: true, earnedAt: new Date(), tokenId: `0x${Math.random().toString(16).slice(2, 8)}` }
                        : b
                ));
                setTotalXP(prev => prev + badge.xpValue);
                setClaimingBadge(null);
                setSelectedBadge(null);
            }, 2000);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading Skill Wallet...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <WalletIcon className="w-12 h-12" />
                            <div>
                                <h1 className="text-4xl font-bold">Skill Wallet</h1>
                                <p className="text-white/70">Your verified credentials & NFT badges</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-white/70">Total Value</p>
                            <p className="text-3xl font-bold">{totalXP.toLocaleString()} XP</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-2xl font-bold">{badges.filter(b => b.isOwned).length}</p>
                            <p className="text-sm text-white/70">Badges Owned</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-2xl font-bold">{credentials.length}</p>
                            <p className="text-sm text-white/70">Credentials</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-2xl font-bold">{credentials.reduce((a, c) => a + c.endorsements, 0)}</p>
                            <p className="text-sm text-white/70">Endorsements</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-2xl font-bold text-amber-400">
                                {badges.filter(b => b.rarity === 'legendary' && b.isOwned).length}
                            </p>
                            <p className="text-sm text-white/70">Legendary</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* NFT Badges Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <SparklesIcon className="w-7 h-7 text-purple-400" />
                    NFT Badges
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {badges.map((badge, idx) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            onClick={() => setSelectedBadge(badge)}
                            className={`relative rounded-2xl p-4 cursor-pointer border ${badge.isOwned ? rarityBgColors[badge.rarity] : 'bg-gray-800/50 border-gray-700'
                                } ${!badge.isOwned && 'opacity-60'}`}
                        >
                            {badge.isOwned && (
                                <div className="absolute -top-2 -right-2">
                                    <CheckBadgeIcon className="w-6 h-6 text-green-400" />
                                </div>
                            )}
                            <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center text-3xl mb-3`}>
                                {badge.icon}
                            </div>
                            <p className="font-bold text-center text-sm">{badge.name}</p>
                            <p className={`text-xs text-center mt-1 capitalize ${badge.rarity === 'legendary' ? 'text-amber-400' :
                                    badge.rarity === 'epic' ? 'text-purple-400' :
                                        badge.rarity === 'rare' ? 'text-blue-400' : 'text-gray-400'
                                }`}>
                                {badge.rarity}
                            </p>
                            {!badge.isOwned && badge.progress !== undefined && (
                                <div className="mt-2">
                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                            style={{ width: `${badge.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 text-center">{badge.progress}%</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Credentials Section */}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <AcademicCapIcon className="w-7 h-7 text-blue-400" />
                    Skill Credentials
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {credentials.map((cred, idx) => (
                        <motion.div
                            key={cred.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setSelectedCredential(cred)}
                            className="bg-gray-800 rounded-2xl p-5 cursor-pointer hover:bg-gray-750 transition-colors border border-gray-700 hover:border-indigo-500/50"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{cred.name}</h3>
                                    <p className="text-sm text-gray-400">{cred.issuer}</p>
                                </div>
                                {cred.verified && (
                                    <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                                )}
                            </div>
                            <div className="flex items-center gap-4 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[cred.level]} bg-gray-700`}>
                                    {cred.level.charAt(0).toUpperCase() + cred.level.slice(1)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <StarIcon className="w-4 h-4" />
                                    <span>{cred.endorsements} endorsements</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <TrophyIcon className="w-4 h-4" />
                                    <span>{cred.projects} projects</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Badge Detail Modal */}
            <AnimatePresence>
                {selectedBadge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedBadge(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-800 rounded-3xl max-w-md w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`bg-gradient-to-br ${rarityColors[selectedBadge.rarity]} p-8 text-center relative`}>
                                <button
                                    onClick={() => setSelectedBadge(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/40"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                                <div className="text-7xl mb-4">{selectedBadge.icon}</div>
                                <h2 className="text-2xl font-bold">{selectedBadge.name}</h2>
                                <p className="text-white/70 capitalize">{selectedBadge.rarity} Badge</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <p className="text-gray-300">{selectedBadge.description}</p>

                                <div className="flex items-center justify-between py-3 border-t border-gray-700">
                                    <span className="text-gray-400">XP Value</span>
                                    <span className="font-bold text-indigo-400">+{selectedBadge.xpValue} XP</span>
                                </div>

                                {selectedBadge.isOwned ? (
                                    <>
                                        <div className="flex items-center justify-between py-3 border-t border-gray-700">
                                            <span className="text-gray-400">Earned</span>
                                            <span>{selectedBadge.earnedAt?.toLocaleDateString()}</span>
                                        </div>
                                        {selectedBadge.tokenId && (
                                            <div className="flex items-center justify-between py-3 border-t border-gray-700">
                                                <span className="text-gray-400">Token ID</span>
                                                <button
                                                    onClick={() => copyToClipboard(selectedBadge.tokenId!, selectedBadge.id)}
                                                    className="flex items-center gap-2 text-sm font-mono bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600"
                                                >
                                                    {selectedBadge.tokenId}
                                                    <DocumentDuplicateIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {copiedId === selectedBadge.id && (
                                            <p className="text-green-400 text-sm text-center">Copied to clipboard!</p>
                                        )}
                                        <button className="w-full py-3 bg-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700">
                                            <ShareIcon className="w-5 h-5" />
                                            Share Badge
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="py-3 border-t border-gray-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-400">Progress</span>
                                                <span className="font-bold">{selectedBadge.progress}%</span>
                                            </div>
                                            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${selectedBadge.progress}%` }}
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                ></motion.div>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-2">{selectedBadge.requirement}</p>
                                        </div>
                                        <button
                                            onClick={() => handleClaimBadge(selectedBadge)}
                                            disabled={selectedBadge.progress !== 100 || claimingBadge === selectedBadge.id}
                                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${selectedBadge.progress === 100
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {claimingBadge === selectedBadge.id ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Claiming...
                                                </>
                                            ) : selectedBadge.progress === 100 ? (
                                                <>
                                                    <FireIcon className="w-5 h-5" />
                                                    Claim Badge
                                                </>
                                            ) : (
                                                <>
                                                    <ClockIcon className="w-5 h-5" />
                                                    In Progress
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Credential Detail Modal */}
            <AnimatePresence>
                {selectedCredential && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedCredential(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-800 rounded-3xl max-w-md w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center relative">
                                <button
                                    onClick={() => setSelectedCredential(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/40"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                                <AcademicCapIcon className="w-16 h-16 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold">{selectedCredential.name}</h2>
                                <p className="text-white/70">{selectedCredential.issuer}</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-center">
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${levelColors[selectedCredential.level]} bg-gray-700`}>
                                        {selectedCredential.level.charAt(0).toUpperCase() + selectedCredential.level.slice(1)} Level
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                                        <StarIcon className="w-8 h-8 mx-auto text-amber-400 mb-2" />
                                        <p className="text-2xl font-bold">{selectedCredential.endorsements}</p>
                                        <p className="text-sm text-gray-400">Endorsements</p>
                                    </div>
                                    <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                                        <TrophyIcon className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
                                        <p className="text-2xl font-bold">{selectedCredential.projects}</p>
                                        <p className="text-sm text-gray-400">Projects</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-3 border-t border-gray-700">
                                    <span className="text-gray-400">Earned</span>
                                    <span>{selectedCredential.earnedAt.toLocaleDateString()}</span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-t border-gray-700">
                                    <span className="text-gray-400">Verified</span>
                                    <span className="flex items-center gap-2 text-green-400">
                                        <ShieldCheckIcon className="w-5 h-5" />
                                        Blockchain Verified
                                    </span>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 bg-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700">
                                        <ShareIcon className="w-5 h-5" />
                                        Share
                                    </button>
                                    <button className="flex-1 py-3 bg-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-600">
                                        <ArrowUpIcon className="w-5 h-5" />
                                        Upgrade
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SkillWallet;
