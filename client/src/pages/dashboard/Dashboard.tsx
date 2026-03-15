import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { 
    BanknotesIcon, 
    CursorArrowRaysIcon, 
    UserGroupIcon, 
    TrophyIcon,
    GiftIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user, login } = useAuth(); // We might need to refresh user data
    const { showToast } = useToast();
    const [claiming, setClaiming] = useState(false);

    const handleClaimDailyBonus = async () => {
        setClaiming(true);
        try {
            const res = await api.post('/gamification/daily-bonus');
            if (res.data.success) {
                showToast(`Success! ₹${(res.data.amount/100).toFixed(2)} added to your wallet.`, 'success');
                // Refresh local user state if possible or just rely on next login/refresh
                // For a better UX, we'd have a 'refreshUser' method in AuthContext
            } else {
                showToast(res.data.message, 'info');
            }
        } catch (err) {
            showToast('Failed to claim bonus', 'error');
        } finally {
            setClaiming(false);
        }
    };

    const stats = [
        { name: 'Current Balance', value: `₹${(user?.balance / 100 || 0).toFixed(2)}`, icon: BanknotesIcon, color: 'text-teal' },
        { name: 'Total Earned', value: `₹${(user?.totalEarned / 100 || 0).toFixed(2)}`, icon: TrophyIcon, color: 'text-amber' },
        { name: 'Tasks Completed', value: user?.totalTasksCompleted || 0, icon: CheckCircleIcon, color: 'text-indigo-400' },
        { name: 'Referral Earnings', value: `₹${(user?.referralEarnings / 100 || 0).toFixed(2)}`, icon: UserGroupIcon, color: 'text-pink-400' },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                        User <span className="text-teal not-italic">Dashboard</span>
                    </h1>
                    <p className="text-muted text-sm mt-1">Track your earnings and discover new missions.</p>
                </div>
                
                <button 
                    onClick={handleClaimDailyBonus}
                    disabled={claiming}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-6 py-3 rounded-2xl hover:from-amber-500/30 hover:to-orange-500/30 transition-all group disabled:opacity-50"
                >
                    <GiftIcon className="w-5 h-5 text-amber-500 group-hover:bounce" />
                    <span className="text-sm font-bold text-amber-200">
                        {claiming ? 'Claiming...' : 'Claim Daily Bonus'}
                    </span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                            <stat.icon className="w-16 h-16" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">{stat.name}</p>
                        <p className={`text-2xl font-black mt-1 ${stat.color} italic`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Missions Card */}
                    <div className="bg-gradient-to-br from-teal-500/10 to-transparent p-1 rounded-[2.5rem]">
                        <div className="glass h-full rounded-[2.4rem] p-8 border border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-teal/20 flex items-center justify-center">
                                        <CursorArrowRaysIcon className="w-6 h-6 text-teal" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Available Tasks</h2>
                                </div>
                                <Link to="/marketplace" className="text-xs font-bold text-teal hover:underline flex items-center gap-1">
                                    View All <ArrowRightIcon className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Captcha Verification', reward: '₹2.50', type: 'Incubator', time: '1m' },
                                    { title: 'Brand Identity Survey', reward: '₹15.00', type: 'Collab', time: '5m' },
                                    { title: 'Mobile App Testing', reward: '₹250.00', type: 'SkillSwap', time: '20m' },
                                ].map((task, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-navy-card flex items-center justify-center font-black text-teal italic">
                                                {task.reward.split('₹')[1][0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{task.title}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-bold text-teal uppercase tracking-widest">{task.type}</span>
                                                    <span className="flex items-center gap-1 text-[10px] text-muted">
                                                        <ClockIcon className="w-3 h-3" /> {task.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-teal italic">{task.reward}</p>
                                            <button className="text-[10px] font-black uppercase tracking-tighter text-muted hover:text-white mt-1">Start →</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Glimpse */}
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrophyIcon className="w-5 h-5 text-amber-500" /> Top Earners
                            </h2>
                            <Link to="/leaderboard/market" className="text-xs font-bold text-muted hover:text-white">Full Board</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2].map(rank => (
                                <div key={rank} className="flex items-center gap-4 p-4 rounded-2xl bg-navy-card/50 border border-white/5">
                                    <span className="text-2xl font-black italic text-teal/40">#0{rank}</span>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-indigo-500" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Alex Johnson</p>
                                        <p className="text-xs text-teal font-black italic">₹12,450.00</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info Area */}
                <div className="space-y-8">
                    {/* Referral Card */}
                    <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-8 rounded-[2.5rem] border border-indigo-500/20 relative overflow-hidden group">
                        <UserGroupIcon className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500/10 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Invite & Earn</h3>
                        <p className="text-white/60 text-sm mt-3 leading-relaxed">
                            Get <span className="text-white font-bold">5% commission</span> on all earnings from friends you invite. Forever.
                        </p>
                        <div className="mt-6 p-3 bg-navy/50 rounded-xl border border-white/10 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-indigo-300 truncate mr-2">ibf.com/ref?id={user?._id?.slice(-6)}</span>
                            <button className="text-[10px] font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg">Copy</button>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5">
                        <h3 className="text-sm font-black text-muted uppercase tracking-widest mb-6">Your Evolution</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-white font-bold italic">Level {user?.level || 1}</span>
                                    <span className="text-muted">75% to Level { (user?.level || 1) + 1}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal w-3/4 rounded-full shadow-[0_0_10px_rgba(0,245,212,0.5)]" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-navy-card border-2 border-navy flex items-center justify-center text-xs">
                                            🏆
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs text-muted font-bold tracking-tight">+12 Badges Earned</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
