import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    GlobeAltIcon,
    HeartIcon,
    AcademicCapIcon,
    UserGroupIcon,
    SparklesIcon,
    ArrowTrendingUpIcon,
    MapPinIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';

interface ImpactMetric {
    label: string;
    value: number;
    unit: string;
    icon: string;
    color: string;
    trend: number;
}

interface RegionalImpact {
    region: string;
    students: number;
    projects: number;
    xpGenerated: number;
}

interface SDGProgress {
    id: number;
    name: string;
    progress: number;
    color: string;
}

const GlobalImpactDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
    const [regions, setRegions] = useState<RegionalImpact[]>([]);
    const [sdgProgress, setSdgProgress] = useState<SDGProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

    useEffect(() => {
        // Mock data - in production, fetch from API
        setMetrics([
            { label: 'Students Empowered', value: 12847, unit: '', icon: '🎓', color: 'from-blue-500 to-indigo-600', trend: 12 },
            { label: 'Skills Learned', value: 45623, unit: '', icon: '💡', color: 'from-amber-500 to-orange-600', trend: 23 },
            { label: 'Internships Completed', value: 3284, unit: '', icon: '💼', color: 'from-green-500 to-emerald-600', trend: 18 },
            { label: 'Mentor Hours', value: 8942, unit: 'hrs', icon: '👨‍🏫', color: 'from-purple-500 to-pink-600', trend: 15 },
            { label: 'Career Readiness', value: 89, unit: '%', icon: '🚀', color: 'from-cyan-500 to-blue-600', trend: 8 },
            { label: 'Community Impact', value: 156, unit: 'projects', icon: '🌍', color: 'from-rose-500 to-red-600', trend: 31 }
        ]);

        setRegions([
            { region: 'North America', students: 4521, projects: 892, xpGenerated: 2340000 },
            { region: 'Europe', students: 3892, projects: 756, xpGenerated: 1980000 },
            { region: 'Asia Pacific', students: 2834, projects: 634, xpGenerated: 1560000 },
            { region: 'Latin America', students: 1234, projects: 312, xpGenerated: 890000 },
            { region: 'Africa', students: 366, projects: 98, xpGenerated: 320000 }
        ]);

        setSdgProgress([
            { id: 4, name: 'Quality Education', progress: 78, color: 'bg-red-500' },
            { id: 8, name: 'Decent Work', progress: 65, color: 'bg-amber-600' },
            { id: 9, name: 'Innovation', progress: 54, color: 'bg-orange-500' },
            { id: 10, name: 'Reduced Inequalities', progress: 42, color: 'bg-pink-500' },
            { id: 17, name: 'Partnerships', progress: 71, color: 'bg-blue-500' }
        ]);

        setLoading(false);

        // Animate numbers
        const timers: NodeJS.Timeout[] = [];
        [12847, 45623, 3284, 8942, 89, 156].forEach((target, idx) => {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                setAnimatedValues(prev => ({ ...prev, [idx]: Math.floor(current) }));
            }, 30);
            timers.push(timer);
        });

        return () => timers.forEach(t => clearInterval(t));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            {/* Hero Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl mb-8"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600">
                    {/* Animated Globe Background */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                    }}></div>
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full"
                            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
                            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                        />
                    ))}
                </div>

                <div className="relative z-10 p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <GlobeAltIcon className="w-14 h-14" />
                        <div>
                            <h1 className="text-4xl font-bold">Global Impact Dashboard</h1>
                            <p className="text-white/80">Measuring our contribution to a better future</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm mt-6">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Live Data</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="w-5 h-5" />
                            <span>42 Countries</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrophyIcon className="w-5 h-5" />
                            <span>Top 10 EdTech Platform</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Impact Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {metrics.map((metric, idx) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-gradient-to-br ${metric.color} rounded-2xl p-5 relative overflow-hidden`}
                    >
                        <div className="absolute top-2 right-2 text-3xl opacity-30">{metric.icon}</div>
                        <p className="text-3xl font-bold mb-1">
                            {(animatedValues[idx] || 0).toLocaleString()}{metric.unit}
                        </p>
                        <p className="text-sm text-white/80">{metric.label}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-green-300">
                            <ArrowTrendingUpIcon className="w-4 h-4" />
                            +{metric.trend}% this month
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Regional Impact */}
                <div className="bg-gray-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <MapPinIcon className="w-6 h-6 text-cyan-400" />
                        Regional Impact
                    </h2>
                    <div className="space-y-4">
                        {regions.map((region, idx) => {
                            const maxStudents = Math.max(...regions.map(r => r.students));
                            const percentage = (region.students / maxStudents) * 100;
                            return (
                                <motion.div
                                    key={region.region}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">{region.region}</span>
                                        <span className="text-sm text-gray-400">
                                            {region.students.toLocaleString()} students
                                        </span>
                                    </div>
                                    <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ delay: idx * 0.1 + 0.5, duration: 0.8 }}
                                            className="absolute h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>{region.projects} projects</span>
                                        <span>{(region.xpGenerated / 1000000).toFixed(1)}M XP</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* UN SDG Alignment */}
                <div className="bg-gray-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <HeartIcon className="w-6 h-6 text-pink-400" />
                        UN Sustainable Development Goals
                    </h2>
                    <div className="space-y-5">
                        {sdgProgress.map((sdg, idx) => (
                            <motion.div
                                key={sdg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${sdg.color} rounded-lg flex items-center justify-center font-bold text-sm`}>
                                            {sdg.id}
                                        </div>
                                        <span className="font-medium">{sdg.name}</span>
                                    </div>
                                    <span className="text-lg font-bold">{sdg.progress}%</span>
                                </div>
                                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${sdg.progress}%` }}
                                        transition={{ delay: idx * 0.1 + 0.5, duration: 0.8 }}
                                        className={`absolute h-full ${sdg.color} rounded-full`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-green-900/30 rounded-xl border border-green-500/30">
                        <p className="text-sm text-green-300">
                            🌱 Your contributions help achieve global education goals. Every skill learned matters!
                        </p>
                    </div>
                </div>
            </div>

            {/* Live Activity Feed */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-gray-800 rounded-2xl p-6"
            >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-amber-400" />
                    Live Global Activity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { text: 'Alex in 🇺🇸 completed React course', time: '2s ago' },
                        { text: 'Maya in 🇮🇳 earned "Code Warrior" badge', time: '5s ago' },
                        { text: 'Team in 🇬🇧 submitted internship project', time: '12s ago' },
                        { text: 'Jordan in 🇨🇦 reached Level 15!', time: '18s ago' }
                    ].map((activity, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.2 + 1 }}
                            className="bg-gray-700/50 rounded-xl p-4"
                        >
                            <p className="text-sm">{activity.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default GlobalImpactDashboard;
