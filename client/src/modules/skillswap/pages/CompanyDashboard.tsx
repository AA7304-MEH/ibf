import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BuildingOfficeIcon,
    UserGroupIcon,
    ChartBarIcon,
    GlobeAltIcon,
    ArrowUpRightIcon,
    PlusIcon,
    BriefcaseIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import api from '../../../services/api';

const CompanyDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [gigs, setGigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [csrRes, listingsRes] = await Promise.all([
                    api.get('/skillswap/csr-impact'),
                    api.get('/skillswap/my-listings')
                ]);

                setStats(csrRes.data);
                setGigs(listingsRes.data);

            } catch (err) {
                console.error('Failed to fetch company data', err);
                // Fallback to mock for robustness in demo
                setStats({
                    totalImpactScore: 8450,
                    studentsReached: 124,
                    hoursVolunteered: 450,
                    carbonOffsetEquivalent: 12.5,
                    impactGrowth: [
                        { month: 'Jan', score: 1200 },
                        { month: 'Feb', score: 1900 },
                        { month: 'Mar', score: 2400 },
                        { month: 'Apr', score: 3800 },
                        { month: 'May', score: 5200 },
                        { month: 'Jun', score: 8450 },
                    ],
                    skillDistribution: [
                        { name: 'Coding', value: 45 },
                        { name: 'Design', value: 25 },
                        { name: 'Marketing', value: 20 },
                        { name: 'Leadership', value: 10 },
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">Crunching CSR data...</div>;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <BuildingOfficeIcon className="w-8 h-8 text-indigo-600" />
                        CSR Command Center
                    </h1>
                    <p className="text-gray-500 mt-1">Measuring your company's impact on the next generation of talent.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
                        <PlusIcon className="w-5 h-5" />
                        New Opportunity
                    </button>
                    <button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                        <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Impact Score', value: stats.totalImpactScore, icon: ChartBarIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Students Mentored', value: stats.studentsReached, icon: UserGroupIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Volunteer Hours', value: stats.hoursVolunteered, icon: GlobeAltIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'CSR Ranking', value: '#12', icon: GlobeAltIcon, color: 'text-pink-600', bg: 'bg-pink-50' },
                ].map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                        <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center mb-4`}>
                            <m.icon className={`w-6 h-6 ${m.color}`} />
                        </div>
                        <p className="text-sm font-medium text-gray-500">{m.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{m.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-6">Impact Growth Velocity</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.impactGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Distribution */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-6">Talent Pipeline Focus</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.skillDistribution} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {stats.skillDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-4">Top skills being fostered by your programs.</p>
                </div>
            </div>

            {/* Active Opportunities */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Live Opportunities</h3>
                    <button className="text-sm text-indigo-600 font-bold hover:underline">View All</button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {gigs.map(gig => (
                        <div key={gig.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
                                    {gig.type === 'internship' ? '💼' : gig.type === 'mentorship' ? '👨‍🏫' : '🎭'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{gig.title}</h4>
                                    <p className="text-sm text-gray-500 capitalize">{gig.type} • {gig.status}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{gig.applicants}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Applicants</p>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-indigo-600">
                                    <ArrowUpRightIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
