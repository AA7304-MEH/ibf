import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserGroupIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    BellIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    AcademicCapIcon,
    TrophyIcon,
    FireIcon,
    ChartBarIcon,
    EyeIcon,
    Cog6ToothIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Child {
    id: string;
    name: string;
    avatar: string;
    level: number;
    xp: number;
    xpToNext: number;
    streak: number;
    grade: string;
    lastActive: Date;
    badges: number;
}

interface PendingApproval {
    id: string;
    childId: string;
    childName: string;
    type: 'internship' | 'course' | 'mentor';
    title: string;
    description: string;
    requestedAt: Date;
    details?: Record<string, string>;
}

interface ActivityLog {
    id: string;
    childName: string;
    action: string;
    timestamp: Date;
    xpEarned?: number;
}

const ParentDashboard: React.FC = () => {
    const [children, setChildren] = useState<Child[]>([]);
    const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
    const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [loading, setLoading] = useState(true);

    const [processingApproval, setProcessingApproval] = useState<string | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setChildren([
                { id: '1', name: 'Alex Johnson', avatar: '👦', level: 12, xp: 2450, xpToNext: 3000, streak: 15, grade: 'A', lastActive: new Date(Date.now() - 1800000), badges: 8 },
                { id: '2', name: 'Emma Johnson', avatar: '👧', level: 8, xp: 1200, xpToNext: 1500, streak: 7, grade: 'A-', lastActive: new Date(Date.now() - 7200000), badges: 5 }
            ]);
            setPendingApprovals([
                { id: 'a1', childId: '1', childName: 'Alex', type: 'internship', title: 'UI Design Internship at TechCorp', description: '2-week virtual internship with real-world projects', requestedAt: new Date(Date.now() - 3600000), details: { duration: '2 weeks', compensation: 'Unpaid (500 XP)', company: 'TechCorp Inc.' } },
                { id: 'a2', childId: '2', childName: 'Emma', type: 'course', title: 'Advanced Python Programming', description: 'In-depth course covering advanced programming concepts', requestedAt: new Date(Date.now() - 7200000), details: { duration: '4 weeks', instructor: 'Dr. Smith' } },
                { id: 'a3', childId: '1', childName: 'Alex', type: 'mentor', title: 'Mentor Request: Sarah Chen', description: 'Request to connect with industry mentor for guidance', requestedAt: new Date(Date.now() - 10800000), details: { specialty: 'Frontend Development', experience: '8 years', sessions: '4 weekly calls' } }
            ]);
            setActivityLog([
                { id: 'l1', childName: 'Alex', action: 'Completed "React Hooks" lesson', timestamp: new Date(Date.now() - 1800000), xpEarned: 50 },
                { id: 'l2', childName: 'Emma', action: 'Earned "Fast Learner" badge', timestamp: new Date(Date.now() - 3600000), xpEarned: 100 },
                { id: 'l3', childName: 'Alex', action: 'Submitted project for review', timestamp: new Date(Date.now() - 5400000) },
                { id: 'l4', childName: 'Emma', action: 'Started "Python Basics" course', timestamp: new Date(Date.now() - 7200000) },
                { id: 'l5', childName: 'Alex', action: 'Achieved 15-day streak!', timestamp: new Date(Date.now() - 10800000), xpEarned: 150 }
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const handleApproval = (approvalId: string, approved: boolean) => {
        setProcessingApproval(approvalId);
        setTimeout(() => {
            if (approved) {
                // Add to activity log
                const approval = pendingApprovals.find(a => a.id === approvalId);
                if (approval) {
                    setActivityLog(prev => [{
                        id: `l_${Date.now()}`,
                        childName: approval.childName,
                        action: `${approval.title} approved by parent`,
                        timestamp: new Date()
                    }, ...prev]);
                }
            }
            setPendingApprovals(prev => prev.filter(a => a.id !== approvalId));
            setProcessingApproval(null);
        }, 1000);
    };

    const getApprovalIcon = (type: string) => {
        switch (type) {
            case 'internship': return '💼';
            case 'course': return '📚';
            case 'mentor': return '👨‍🏫';

            default: return '📋';
        }
    };

    const getApprovalColor = (type: string) => {
        switch (type) {
            case 'internship': return 'border-blue-500 bg-blue-500/10';
            case 'course': return 'border-green-500 bg-green-500/10';
            case 'mentor': return 'border-purple-500 bg-purple-500/10';

            default: return 'border-gray-500';
        }
    };

    const formatTime = (date: Date) => {
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-white text-lg">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <ShieldCheckIcon className="w-12 h-12" />
                            <div>
                                <h1 className="text-3xl font-bold">Parent Dashboard</h1>
                                <p className="text-white/70">Monitor, approve, and support your child's learning journey</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-white/70">Platform Status</p>
                            <p className="text-2xl font-bold uppercase tracking-widest italic">Free</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Children Overview */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <UserGroupIcon className="w-6 h-6 text-indigo-500" />
                        My Children
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {children.map((child) => (
                            <motion.div
                                key={child.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedChild(selectedChild?.id === child.id ? null : child)}
                                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer border-2 transition-all ${selectedChild?.id === child.id
                                    ? 'border-indigo-500 shadow-lg'
                                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-5xl">{child.avatar}</div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{child.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>Level {child.level}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <FireIcon className="w-4 h-4 text-orange-500" />
                                                {child.streak} day streak
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-600">{child.grade}</div>
                                        <div className="text-xs text-gray-400">Grade</div>
                                    </div>
                                </div>

                                {/* XP Progress */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Progress to Level {child.level + 1}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{child.xp}/{child.xpToNext} XP</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                            style={{ width: `${(child.xp / child.xpToNext) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <TrophyIcon className="w-4 h-4" />
                                        <span>{child.badges} badges</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <ClockIcon className="w-4 h-4" />
                                        <span>Active {formatTime(child.lastActive)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pending Approvals */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <BellIcon className="w-6 h-6 text-amber-500" />
                        Pending Approvals
                        {pendingApprovals.length > 0 && (
                            <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                                {pendingApprovals.length}
                            </span>
                        )}
                    </h2>
                    <div className="space-y-4">
                        {pendingApprovals.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                                <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <p className="text-gray-500">All caught up! No pending approvals.</p>
                            </div>
                        ) : (
                            pendingApprovals.map((approval) => (
                                <motion.div
                                    key={approval.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border-l-4 ${getApprovalColor(approval.type)}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">{getApprovalIcon(approval.type)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{approval.childName}</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-xs text-gray-500">{formatTime(approval.requestedAt)}</span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{approval.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{approval.description}</p>

                                            {approval.details && (
                                                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                                    {Object.entries(approval.details).map(([key, value]) => (
                                                        <div key={key} className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                                                            <span className="text-gray-400 capitalize">{key}</span>
                                                            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApproval(approval.id, true)}
                                                disabled={processingApproval === approval.id}
                                                className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-50"
                                            >
                                                {processingApproval === approval.id ? (
                                                    <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <CheckCircleIcon className="w-6 h-6" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleApproval(approval.id, false)}
                                                disabled={processingApproval === approval.id}
                                                className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50"
                                            >
                                                <XCircleIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Activity Log Sidebar */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <ChartBarIcon className="w-6 h-6 text-green-500" />
                        Recent Activity
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 space-y-4 max-h-[600px] overflow-y-auto">
                        {activityLog.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {log.childName.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-white">{log.action}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-400">{log.childName}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-xs text-gray-400">{formatTime(log.timestamp)}</span>
                                    </div>
                                </div>
                                {log.xpEarned && (
                                    <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                        +{log.xpEarned} XP
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 space-y-3">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Actions</h3>

                        <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <div className="flex items-center gap-3">
                                <EyeIcon className="w-5 h-5 text-blue-500" />
                                <span className="text-gray-900 dark:text-white">View Reports</span>
                            </div>
                            <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <div className="flex items-center gap-3">
                                <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-900 dark:text-white">Settings</span>
                            </div>
                            <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
