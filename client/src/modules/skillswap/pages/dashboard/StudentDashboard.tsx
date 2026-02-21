import React, { useState, useEffect } from 'react';
import { PlayCircleIcon, CheckCircleIcon, LockClosedIcon, TrophyIcon, FireIcon, StarIcon } from '@heroicons/react/24/solid';
import { ArrowTrendingUpIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';
import { web3Service } from '../../../../services/web3Service';
import ActiveMissionsPanel from '../../components/ActiveMissionsPanel';
import TaskManagerPanel from '../../components/TaskManagerPanel';
import TeamChatPanel from '../../components/TeamChatPanel';

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'missions' | 'tasks' | 'chat'>('overview');
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnectWallet = async () => {
        setIsConnecting(true);
        try {
            const address = await web3Service.connectWallet();
            setWalletAddress(address);
        } catch (err) {
            console.error("Connection failed", err);
            alert("Please install MetaMask or a compatible wallet to claim badges on-chain.");
        } finally {
            setIsConnecting(false);
        }
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/learning/dashboard');
                setData(res.data);
            } catch (err: any) {
                console.error('Error fetching dashboard:', err);
                // Mock data for demo
                setData({
                    student: { name: 'Alex', xp: 2450, streak: 7, level: 12, badges: 8, title: 'Rising Star' },
                    learningPath: {
                        title: 'Full Stack Developer',
                        modules: [
                            {
                                id: '1', title: 'React Fundamentals', status: 'completed', progress: 100, xp: 500, lessons: [
                                    { id: 'l1', title: 'JSX Basics', completed: true, type: 'video', duration: '15m' },
                                    { id: 'l2', title: 'Components', completed: true, type: 'code', duration: '25m' },
                                ]
                            },
                            {
                                id: '2', title: 'Advanced Hooks', status: 'in-progress', progress: 60, xp: 750, lessons: [
                                    { id: 'l3', title: 'useState Deep Dive', completed: true, type: 'video', duration: '20m' },
                                    { id: 'l4', title: 'useEffect Patterns', completed: false, type: 'code', duration: '30m' },
                                ]
                            },
                            { id: '3', title: 'Node.js Backend', status: 'locked', progress: 0, xp: 1000, lessons: [] },
                        ]
                    },
                    skillDNA: { problemSolving: 75, creativity: 60, communication: 80, technicalSkill: 70, leadership: 45 }
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading your dashboard...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-8 text-center">
            <div className="text-red-500 font-bold mb-2">Error</div>
            <p className="text-gray-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Retry
            </button>
        </div>
    );

    if (!data) return null;

    const { student, learningPath, skillDNA } = data;
    const progressPercent = Math.round(
        (learningPath.modules.reduce((acc: number, m: any) => acc + (m.lessons?.filter((l: any) => l.completed).length || 0), 0) /
            Math.max(1, learningPath.modules.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0))) * 100
    );

    const xpToNextLevel = (student.level + 1) * 500;
    const currentLevelProgress = ((student.xp % 500) / 500) * 100;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 space-y-6">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">Level {student.level}</span>
                            <span className="text-white/80 text-sm">{student.title}</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Welcome back, {student.name}! 👋</h1>
                        <p className="text-white/80">Continue your journey to becoming a {learningPath.title}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3">
                            <TrophyIcon className="w-8 h-8 text-amber-300" />
                            <div>
                                <p className="text-xs text-white/70">Total XP</p>
                                <p className="text-2xl font-bold">{student.xp.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3">
                            <FireIcon className="w-8 h-8 text-orange-400" />
                            <div>
                                <p className="text-xs text-white/70">Streak</p>
                                <p className="text-2xl font-bold">{student.streak} Days</p>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3 relative group">
                            <StarIcon className="w-8 h-8 text-yellow-300" />
                            <div>
                                <p className="text-xs text-white/70">Badges</p>
                                <p className="text-2xl font-bold">{student.badges}</p>
                            </div>
                            {!walletAddress ? (
                                <button
                                    onClick={handleConnectWallet}
                                    disabled={isConnecting}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm"
                                >
                                    {isConnecting ? 'Linking...' : 'Link Wallet'}
                                </button>
                            ) : (
                                <div className="absolute -top-2 -right-2 bg-green-500 p-1 rounded-full shadow-lg border-2 border-white">
                                    <CheckCircleIcon className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Level Progress */}
                <div className="mt-4 relative z-10 flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                            <span>Level {student.level}</span>
                            <span>{xpToNextLevel - (student.xp % 500)} XP to Level {student.level + 1}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div className="bg-white h-full rounded-full transition-all" style={{ width: `${currentLevelProgress}%` }}></div>
                        </div>
                    </div>
                    {walletAddress && (
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-mono">
                            Linked: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm w-fit">
                {[
                    { id: 'overview', label: '📊 Overview' },
                    { id: 'missions', label: '🚀 Active Missions' },
                    { id: 'tasks', label: '📋 Task Manager' },
                    { id: 'chat', label: '💬 Team Chat' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Course Progress */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-600" />
                                    Course Progress
                                </h2>
                                <span className="text-2xl font-bold text-indigo-600">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                                />
                            </div>
                        </div>

                        {/* Modules */}
                        <div className="space-y-4">
                            {learningPath.modules.map((module: any) => (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-white dark:bg-gray-800 rounded-xl p-5 border shadow-sm transition-all ${module.status === 'locked' ? 'opacity-60' :
                                        module.status === 'completed' ? 'border-green-200 dark:border-green-900' : 'border-indigo-200 dark:border-indigo-900'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 p-2 rounded-lg ${module.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                module.status === 'locked' ? 'bg-gray-100 text-gray-400' : 'bg-indigo-100 text-indigo-600'
                                                }`}>
                                                {module.status === 'completed' ? <CheckCircleIcon className="w-6 h-6" /> :
                                                    module.status === 'locked' ? <LockClosedIcon className="w-6 h-6" /> : <PlayCircleIcon className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{module.title}</h3>
                                                <p className="text-sm text-gray-500">{module.lessons?.length || 0} Lessons • {module.xp} XP</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {module.status !== 'locked' && (
                                                <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                                                    {Math.round(module.progress)}%
                                                </span>
                                            )}
                                            {module.status !== 'locked' && module.status !== 'completed' && (
                                                <button
                                                    onClick={() => {
                                                        const firstIncomplete = module.lessons?.find((l: any) => !l.completed) || module.lessons?.[0];
                                                        if (firstIncomplete) {
                                                            navigate(`/skillswap/learning/${module.id}/${firstIncomplete.id}`);
                                                        }
                                                    }}
                                                    className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
                                                >
                                                    Resume
                                                </button>
                                            )}
                                            {module.status === 'completed' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/skillswap/learning/${module.id}/${module.lessons?.[0]?.id}`)}
                                                        className="px-4 py-1.5 border border-green-200 text-green-600 text-xs font-bold rounded-lg hover:bg-green-50 transition"
                                                    >
                                                        Review
                                                    </button>
                                                    {walletAddress ? (
                                                        <button
                                                            onClick={async () => {
                                                                const res: any = await web3Service.claimBadgeOnChain(module.id, student.name);
                                                                if (res.success) {
                                                                    alert(`Success! Your Skill Badge has been minted on Polygon.\nTx: ${res.txHash}`);
                                                                }
                                                            }}
                                                            className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-lg hover:shadow-lg transition flex items-center gap-1"
                                                        >
                                                            <SparklesIcon className="w-3 h-3 text-yellow-300" />
                                                            Claim NFT
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={handleConnectWallet}
                                                            className="px-4 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
                                                        >
                                                            Link Wallet to Claim
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Stats & Daily Challenge */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <SparklesIcon className="w-5 h-5 text-purple-600" />
                                Your Skill DNA
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(skillDNA).map(([skill, val]: [string, any]) => (
                                    <div key={skill}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="capitalize text-gray-500">{skill.replace(/([A-Z])/g, ' $1')}</span>
                                            <span className="font-bold text-gray-700 dark:text-gray-300">{val}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${val}%` }}
                                                transition={{ duration: 0.8 }}
                                                className={`h-full rounded-full ${val > 70 ? 'bg-green-500' : val > 50 ? 'bg-purple-500' : 'bg-indigo-400'}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <FireIcon className="w-32 h-32" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">⚡ Daily Challenge</h3>
                            <p className="text-indigo-100 text-sm mb-4 relative z-10">Build a responsive navbar using CSS Flexbox.</p>
                            <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-bold transition-colors relative z-10">
                                Start Challenge (+75 XP)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'missions' && <ActiveMissionsPanel />}
            {activeTab === 'tasks' && <TaskManagerPanel />}
            {activeTab === 'chat' && <TeamChatPanel />}
        </div>
    );
};

export default StudentDashboard;
