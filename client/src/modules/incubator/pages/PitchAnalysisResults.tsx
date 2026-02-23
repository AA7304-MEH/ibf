import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    Cell, PieChart, Pie
} from 'recharts';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ChatBubbleBottomCenterTextIcon,
    PresentationChartLineIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

// --- Mock Data ---
const confidenceData = [
    { time: '0:00', confidence: 65 },
    { time: '0:30', confidence: 72 },
    { time: '1:00', confidence: 85 },
    { time: '1:30', confidence: 60 }, // Stumble
    { time: '2:00', confidence: 78 },
    { time: '2:30', confidence: 92 },
    { time: '3:00', confidence: 88 },
];

const sentimentData = [
    { name: 'Sarah (Shark)', value: 45, color: '#ef4444' },
    { name: 'Marcus (Vision)', value: 88, color: '#10b981' },
    { name: 'Dr. Chen (Tech)', value: 62, color: '#3b82f6' },
];

const pacingData = [
    { subject: 'Speed', A: 120, fullMark: 150 },
    { subject: 'Clarity', A: 98, fullMark: 150 },
    { subject: 'Volume', A: 86, fullMark: 150 },
    { subject: 'Pauses', A: 140, fullMark: 150 },
    { subject: 'Confidence', A: 110, fullMark: 150 },
];

const PitchAnalysisResults: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/incubator/pitch-room')}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Pitch Analysis</h1>
                            <p className="text-slate-500">Series A Simulation • Today at 2:45 PM</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5" />
                            Ready for Series A
                        </div>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
                            Book Real Mentor
                        </button>
                    </div>
                </div>

                {/* Score Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
                    >
                        <p className="text-sm font-medium text-slate-500 mb-1">Overall Score</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-4xl font-bold text-slate-900">84</h2>
                            <span className="text-slate-400 mb-1">/ 100</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-green-600 text-xs font-bold">
                            <ArrowUpIcon className="w-3 h-3" />
                            12% vs last pitch
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
                    >
                        <p className="text-sm font-medium text-slate-500 mb-1">Average Pacing</p>
                        <h2 className="text-4xl font-bold text-slate-900">138</h2>
                        <p className="text-xs text-slate-400 mt-1">Words per minute</p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
                    >
                        <p className="text-sm font-medium text-slate-500 mb-1">Investor Interest</p>
                        <h2 className="text-4xl font-bold text-slate-900">65%</h2>
                        <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
                    >
                        <p className="text-sm font-medium text-slate-500 mb-1">Top Strength</p>
                        <h2 className="text-lg font-bold text-indigo-600">Vision Clarity</h2>
                        <p className="text-xs text-slate-400 mt-1">High emotional resonance</p>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Confidence Chart */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                                <PresentationChartLineIcon className="w-6 h-6 text-indigo-500" />
                                Confidence Timeline
                            </h3>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                    Performance
                                </span>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={confidenceData}>
                                    <defs>
                                        <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis hide domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="confidence" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorConf)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sentiment Breakdown */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-xl text-slate-900 mb-8 flex items-center gap-2">
                            <UserGroupIcon className="w-6 h-6 text-emerald-500" />
                            Investor Interest
                        </h3>
                        <div className="space-y-6">
                            {sentimentData.map((inv, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-700">{inv.name}</span>
                                        <span className="text-sm font-bold" style={{ color: inv.color }}>{inv.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${inv.value}%` }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: inv.color }}
                                        ></motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-xs text-slate-500 leading-relaxed italic">
                                "Sarah was critical of the valuation, but Marcus was highly engaged during the technology demo."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Radar & AI Feedback */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Performance Radar */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-xl text-slate-900 mb-8 tracking-tight">Vocal Analysis</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={pacingData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <PolarRadiusAxis hide />
                                    <Radar
                                        name="Pitcher"
                                        dataKey="A"
                                        stroke="#6366f1"
                                        fill="#6366f1"
                                        fillOpacity={0.3}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Detailed AI Feedback */}
                    <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white">
                        <h3 className="font-bold text-xl mb-8 flex items-center gap-2">
                            <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-indigo-400" />
                            AI Coach Deep-Dive
                        </h3>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="p-2 bg-green-500/20 rounded-xl h-fit">
                                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-green-400 text-sm mb-1 uppercase tracking-wider">Strength: Problem Narrative</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Your opening anecdote created high dopamine levels in the virtual audience. Retention was at 98% during the first 2 minutes.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-2 bg-amber-500/20 rounded-xl h-fit">
                                    <ExclamationTriangleIcon className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-amber-400 text-sm mb-1 uppercase tracking-wider">Opportunity: GTM Details</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Your pacing increased to 160 wpm during the channel strategy section. Investors flagged this as "unclear". Slow down here.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-800">
                                <h4 className="font-bold text-sm mb-4">Recommended Next Step</h4>
                                <div className="p-4 bg-slate-800 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-750 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                                            A
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Series A Module 4: GTM</p>
                                            <p className="text-xs text-slate-500">Refine your acquisition model</p>
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-full border border-slate-700 group-hover:bg-slate-700 transition-colors">
                                        <ArrowUpIcon className="w-4 h-4 rotate-45" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PitchAnalysisResults;
