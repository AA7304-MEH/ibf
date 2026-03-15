import React, { useState, useEffect } from 'react';
import { 
    TrophyIcon, 
    BanknotesIcon, 
    UserGroupIcon, 
    ArrowTrendingUpIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const MarketLeaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await api.get('/gamification/leaderboard/market');
            setLeaderboard(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="relative p-10 rounded-[2.5rem] bg-gradient-to-br from-ibf-primary to-indigo-900 overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute top-0 right-0 p-40 bg-teal/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                            Global <span className="text-teal not-italic">Ranking.</span>
                        </h1>
                        <p className="text-blue-100 text-lg opacity-80 leading-relaxed font-medium max-w-xl">
                            The elite innovators and earners of IBF. Standings are based on total lifetime earnings from micro-tasks.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center">
                            <TrophyIcon className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                            <p className="text-white font-black italic text-xl">Top Erner</p>
                            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">₹15,400.00</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Rank</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted">User</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted">School/Org</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Total Earned</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted">Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leaderboard.map((user, idx) => (
                                <tr key={user.userId} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-6">
                                        <span className={`text-2xl font-black italic ${
                                            idx === 0 ? 'text-amber-500' : 
                                            idx === 1 ? 'text-gray-300' : 
                                            idx === 2 ? 'text-orange-500' : 'text-teal/40'
                                        }`}>
                                            #{(idx + 1).toString().padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal to-indigo-600 border border-white/10 flex-shrink-0 flex items-center justify-center font-bold text-white uppercase italic">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-teal transition-colors">{user.fullName}</p>
                                                <p className="text-[10px] text-muted flex items-center gap-1">
                                                    <ArrowTrendingUpIcon className="w-3 h-3 text-teal" /> {user.xp} XP
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-muted text-sm font-medium">
                                            <AcademicCapIcon className="w-4 h-4" />
                                            {user.school}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-lg font-black text-teal italic">₹{(user.earnings / 100).toFixed(2)}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-4 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase border border-indigo-500/20">
                                            Level {user.level}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {loading === false && leaderboard.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                    <p className="text-muted font-bold italic uppercase tracking-widest">No rankings available yet.</p>
                </div>
            )}
        </div>
    );
};

export default MarketLeaderboard;
