import React, { useState } from 'react';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const IncubatorDashboard: React.FC = () => {
    // Mock Data - In real app fetch from /incubator/me
    const application = {
        startupName: 'TechFlow',
        status: 'accepted', // applied, review, interview, accepted, rejected
        submissionDate: '2026-01-20',
        nextStep: 'Onboarding Call',
        timeline: [
            { step: 'Applied', date: 'Jan 20', status: 'completed' },
            { step: 'Under Review', date: 'Jan 22', status: 'completed' },
            { step: 'Interview', date: 'Jan 24', status: 'completed' },
            { step: 'Decision', date: 'Jan 25', status: 'completed' },
            { step: 'Accepted', date: 'Jan 25', status: 'current' }
        ]
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Incubator Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Track your application and access resources.</p>
            </header>

            {/* Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Application Status:
                            <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm uppercase">
                                {application.status}
                            </span>
                        </h2>
                        <p className="text-gray-500 mt-1">Startup: <strong>{application.startupName}</strong></p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Next Action</p>
                        <p className="font-bold text-ibf-primary text-lg">{application.nextStep}</p>
                    </div>
                </div>

                {/* Visual Timeline */}
                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 hidden md:block" />
                    <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                        {application.timeline.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${item.status === 'completed' ? 'bg-green-500 border-green-200 text-white' :
                                        item.status === 'current' ? 'bg-ibf-primary border-blue-200 text-white animate-pulse' :
                                            'bg-white border-gray-200 text-gray-300'
                                    } shadow-sm transition-colors duration-300`}>
                                    {item.status === 'completed' ? <CheckCircleIcon className="w-6 h-6" /> :
                                        item.status === 'current' ? <ClockIcon className="w-6 h-6" /> :
                                            <div className="w-3 h-3 rounded-full bg-gray-300" />}
                                </div>
                                <div className="mt-4 bg-white dark:bg-gray-800 px-2">
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{item.step}</p>
                                    <p className="text-xs text-gray-500">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Communications */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" /> Communications
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm">IBF Admin</span>
                                <span className="text-xs text-gray-400">Today</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Congratulations on your acceptance! Please check your email for the onboarding kit.
                            </p>
                        </div>
                        <button className="w-full text-center text-sm text-ibf-primary font-medium hover:underline">View All Messages</button>
                    </div>
                </div>

                {/* Profile Management */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-gray-400" /> Manage Profile
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center group">
                            <span className="text-sm font-medium">Edit Application Info</span>
                            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center group">
                            <span className="text-sm font-medium">Update Pitch Deck</span>
                            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center group">
                            <span className="text-sm font-medium">Manage Team</span>
                            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>

                {/* Resources (If Accepted) */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-900 dark:text-purple-100">
                        <UserGroupIcon className="w-5 h-5" /> Founder Resources
                    </h3>
                    <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
                        Exclusive perks for accepted founders.
                    </p>
                    <div className="space-y-3">
                        <button className="w-full bg-white dark:bg-gray-800 text-purple-700 font-medium py-2 rounded-lg shadow-sm hover:shadow transition-shadow">
                            Book Mentor Hours
                        </button>
                        <button className="w-full bg-white dark:bg-gray-800 text-purple-700 font-medium py-2 rounded-lg shadow-sm hover:shadow transition-shadow">
                            Legal Templates
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncubatorDashboard;
