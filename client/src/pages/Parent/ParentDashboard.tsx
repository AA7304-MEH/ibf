import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    BellIcon,
    // AcademicCapIcon,
    // ClockIcon,
    // ChartBarIcon,
    // ShieldCheckIcon,
    // CheckCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

interface ChildProfile {
    _id: string;
    firstName: string;
    lastName: string;
    level: number;
    xp: number;
    loginStreak: number;
    safetyScore?: number; // Calculated or mock for now
    activeProject?: string;
}

interface ApprovalRequest {
    internshipId: string;
    internshipTitle: string;
    companyName: string;
    studentId: string;
    studentName: string;
    matchScore: number;
    appliedAt: string;
}

const ParentDashboard: React.FC = () => {
    const [children, setChildren] = useState<ChildProfile[]>([]);
    const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'settings'>('overview');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [childRes, approvalRes] = await Promise.all([
                api.get('/parent/children'),
                api.get('/parent/approvals')
            ]);

            // Map backend data to frontend interface
            const mappedApprovals = approvalRes.data.map((app: any) => ({
                ...app,
                matchScore: app.matchScore || 90, // Fallback mock score
                appliedAt: app.createdAt // Align field name
            }));

            setChildren(childRes.data);
            setApprovals(mappedApprovals);
        } catch (error) {
            console.error('Error fetching parent data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (internshipId: string, studentId: string, decision: 'approved' | 'rejected') => {
        try {
            await api.post('/parent/approve', {
                internshipId,
                studentId,
                decision
            });
            alert(`Application ${decision === 'approved' ? 'Approved' : 'Rejected'}!`);
            fetchData(); // Refresh list
        } catch (error) {
            alert('Error processing request');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <HomeIcon className="w-8 h-8 text-green-600" />
                            Parent Guardian Portal
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Monitoring {children.length} linked student accounts
                        </p>
                    </div>
                </header>

                {/* Approvals Alert */}
                {approvals.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <BellIcon className="w-6 h-6 text-yellow-600" />
                            <div>
                                <h3 className="font-bold text-yellow-800">Pending Approvals</h3>
                                <p className="text-yellow-700 text-sm">You have {approvals.length} internship application(s) waiting for consent.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveTab('approvals')}
                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 font-medium"
                        >
                            Review Now
                        </button>
                    </div>
                )}

                {/* Children Overview */}
                {children.map(child => (
                    <div key={child._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                                    {child.firstName.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{child.firstName} {child.lastName}</h2>
                                    <p className="text-gray-500">Level {child.level} {child.level > 5 ? 'Master' : 'Student'}</p>
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <span className="text-sm text-blue-600 font-semibold uppercase">Total XP</span>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{child.xp || 0}</p>
                                </div>
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                                    <span className="text-sm text-orange-600 font-semibold uppercase">Streak</span>
                                    <div className="flex items-center gap-1">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{child.loginStreak || 0}</p>
                                        <span className="text-xl">🔥</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                    <span className="text-sm text-green-600 font-semibold uppercase">Safety Score</span>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">98%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {(['overview', 'approvals', 'settings'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium capitalize transition-colors ${activeTab === tab
                                ? 'text-green-600 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/10'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'approvals' && (
                    <div className="space-y-4">
                        {approvals.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl">
                                No pending approvals. Good job!
                            </div>
                        ) : (
                            approvals.map((req, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">New Application</span>
                                            <span className="text-sm text-gray-500">{new Date(req.appliedAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{req.studentName} wants to join "{req.internshipTitle}"</h3>
                                        <p className="text-gray-600">Company: <span className="font-semibold">{req.companyName}</span></p>
                                        <p className="text-green-600 font-medium text-sm mt-1">AI Match Score: {req.matchScore}%</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleDecision(req.internshipId, req.studentId, 'rejected')}
                                            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleDecision(req.internshipId, req.studentId, 'approved')}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition-shadow"
                                        >
                                            Approve Request
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentDashboard;
