import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    UsersIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    BuildingOfficeIcon,
    AcademicCapIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    FlagIcon,
    Cog6ToothIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface PlatformMetrics {
    users: {
        total: number;
        founders: number;
        talent: number;
        students: number;
        admins: number;
        newThisMonth: number;
    };
    revenue: {
        total: number;
        thisMonth: number;
        lastMonth: number;
        platformFees: number;
    };
    modules: {
        incubator: { startups: number; cohorts: number };
        collab: { projects: number; applications: number };
        skillswap: { students: number; projectsCompleted: number };
    };
    safety: {
        pendingFlags: number;
        activeDisputes: number;
        resolvedToday: number;
    };
}

const AdminDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            // Try to fetch from API, fallback to mock data
            // const res = await api.get('/admin/metrics');
            // setMetrics(res.data);

            // Mock data for now
            setMetrics({
                users: {
                    total: 1247,
                    founders: 312,
                    talent: 678,
                    students: 245,
                    admins: 12,
                    newThisMonth: 89
                },
                revenue: {
                    total: 125000,
                    thisMonth: 18500,
                    lastMonth: 15200,
                    platformFees: 8250
                },
                modules: {
                    incubator: { startups: 48, cohorts: 4 },
                    collab: { projects: 156, applications: 423 },
                    skillswap: { students: 245, projectsCompleted: 78 }
                },
                safety: {
                    pendingFlags: 12,
                    activeDisputes: 3,
                    resolvedToday: 5
                }
            });

            setRecentActivity([
                { id: 1, type: 'user_signup', message: 'New founder registered: TechStartup Inc', time: '5 min ago' },
                { id: 2, type: 'payment', message: 'Payment processed: $2,500 escrow released', time: '12 min ago' },
                { id: 3, type: 'flag', message: 'Content flagged for review in SkillSwap', time: '25 min ago' },
                { id: 4, type: 'project', message: 'New project posted: AI Dashboard Design', time: '1 hour ago' },
                { id: 5, type: 'dispute', message: 'Dispute resolved by admin', time: '2 hours ago' }
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = metrics ? [
        {
            title: 'Total Users',
            value: metrics.users.total.toLocaleString(),
            change: `+${metrics.users.newThisMonth} this month`,
            positive: true,
            icon: UsersIcon,
            color: 'blue'
        },
        {
            title: 'Revenue',
            value: `$${metrics.revenue.thisMonth.toLocaleString()}`,
            change: `${((metrics.revenue.thisMonth - metrics.revenue.lastMonth) / metrics.revenue.lastMonth * 100).toFixed(1)}% vs last month`,
            positive: metrics.revenue.thisMonth > metrics.revenue.lastMonth,
            icon: CurrencyDollarIcon,
            color: 'green'
        },
        {
            title: 'Active Projects',
            value: metrics.modules.collab.projects.toString(),
            change: `${metrics.modules.collab.applications} applications`,
            positive: true,
            icon: ChartBarIcon,
            color: 'purple'
        },
        {
            title: 'Pending Flags',
            value: metrics.safety.pendingFlags.toString(),
            change: `${metrics.safety.resolvedToday} resolved today`,
            positive: metrics.safety.pendingFlags < 20,
            icon: FlagIcon,
            color: metrics.safety.pendingFlags > 0 ? 'red' : 'green'
        }
    ] : [];

    const quickActions = [
        { title: 'User Management', href: '/admin/users', icon: UsersIcon, desc: 'Manage all users' },
        { title: 'Content Moderation', href: '/admin/moderation', icon: ShieldCheckIcon, desc: 'Review flagged content' },
        { title: 'Disputes', href: '/admin/disputes', icon: ExclamationTriangleIcon, desc: 'Resolve payment disputes' },
        { title: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, desc: 'Platform configuration' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Platform overview and management
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleTimeString()}
                        </span>
                        <button
                            onClick={fetchMetrics}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ClockIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                                {stat.positive ? (
                                    <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                                ) : (
                                    <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
                                )}
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                            <p className={`text-sm mt-2 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.change}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Module Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Module Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Incubator */}
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                                        <span className="font-bold text-gray-900 dark:text-white">Incubator</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Startups</span>
                                            <span className="font-medium">{metrics?.modules.incubator.startups}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Cohorts</span>
                                            <span className="font-medium">{metrics?.modules.incubator.cohorts}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Collab */}
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <UsersIcon className="w-6 h-6 text-purple-600" />
                                        <span className="font-bold text-gray-900 dark:text-white">Collab</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Projects</span>
                                            <span className="font-medium">{metrics?.modules.collab.projects}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Applications</span>
                                            <span className="font-medium">{metrics?.modules.collab.applications}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* SkillSwap */}
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <AcademicCapIcon className="w-6 h-6 text-green-600" />
                                        <span className="font-bold text-gray-900 dark:text-white">SkillSwap</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Students</span>
                                            <span className="font-medium">{metrics?.modules.skillswap.students}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Completed</span>
                                            <span className="font-medium">{metrics?.modules.skillswap.projectsCompleted}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Distribution */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">User Distribution</h2>
                            <div className="space-y-4">
                                {[
                                    { role: 'Founders', count: metrics?.users.founders || 0, color: 'blue' },
                                    { role: 'Talent', count: metrics?.users.talent || 0, color: 'purple' },
                                    { role: 'Students', count: metrics?.users.students || 0, color: 'green' },
                                    { role: 'Admins', count: metrics?.users.admins || 0, color: 'red' }
                                ].map(item => {
                                    const percentage = ((item.count / (metrics?.users.total || 1)) * 100).toFixed(1);
                                    return (
                                        <div key={item.role}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600 dark:text-gray-300">{item.role}</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {item.count} ({percentage}%)
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 0.5, delay: 0.2 }}
                                                    className={`h-full bg-${item.color}-500`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                {quickActions.map(action => (
                                    <Link
                                        key={action.href}
                                        to={action.href}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            <action.icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                                            <p className="text-sm text-gray-500">{action.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                            <div className="space-y-4">
                                {recentActivity.map(activity => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'flag' ? 'bg-red-500' :
                                                activity.type === 'payment' ? 'bg-green-500' :
                                                    'bg-blue-500'
                                            }`} />
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{activity.message}</p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
