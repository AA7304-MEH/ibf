import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    ClipboardDocumentCheckIcon,
    CalendarDaysIcon,
    UserGroupIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const IncubatorManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'applications' | 'cohorts' | 'mentors'>('applications');
    const [applications, setApplications] = useState<any[]>([]);

    useEffect(() => {
        // Mock fetch applications
        // In real app: api.get('/incubator/applications')
        setApplications([
            { _id: '1', startupName: 'MediConnect', founder: 'Bob Founder', date: '2026-01-22', status: 'submitted', score: 24 },
            { _id: '2', startupName: 'EdVance', founder: 'Sarah Lee', date: '2026-01-23', status: 'interview', score: 28 },
            { _id: '3', startupName: 'GreenEnergy', founder: 'Tom Green', date: '2026-01-21', status: 'rejected', score: 15 }
        ]);
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Incubator Management</h1>
                <p className="text-gray-500">Manage applications, cohorts, and mentors.</p>
            </header>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`pb-4 px-6 font-medium text-sm transition-colors relative ${activeTab === 'applications' ? 'text-ibf-primary' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <ClipboardDocumentCheckIcon className="w-5 h-5 inline mr-2" />
                    Applications
                    {activeTab === 'applications' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ibf-primary" />}
                </button>
                <button
                    onClick={() => setActiveTab('cohorts')}
                    className={`pb-4 px-6 font-medium text-sm transition-colors relative ${activeTab === 'cohorts' ? 'text-ibf-primary' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <CalendarDaysIcon className="w-5 h-5 inline mr-2" />
                    Cohorts
                    {activeTab === 'cohorts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ibf-primary" />}
                </button>
                <button
                    onClick={() => setActiveTab('mentors')}
                    className={`pb-4 px-6 font-medium text-sm transition-colors relative ${activeTab === 'mentors' ? 'text-ibf-primary' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <UserGroupIcon className="w-5 h-5 inline mr-2" />
                    Mentors
                    {activeTab === 'mentors' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ibf-primary" />}
                </button>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">

                {activeTab === 'applications' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-4">Incoming Applications</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Startup</th>
                                        <th className="px-6 py-3">Founder</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Score</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {applications.map((app) => (
                                        <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{app.startupName}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{app.founder}</td>
                                            <td className="px-6 py-4 text-gray-500">{app.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${app.score >= 25 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {app.score}/30
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs uppercase font-bold ${app.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                                        app.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50" title="Accept">
                                                    <CheckIcon className="w-5 h-5" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50" title="Reject">
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'cohorts' && (
                    <div className="text-center py-12">
                        <CalendarDaysIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Batch Management</h3>
                        <p className="text-gray-500 mb-6">Manage application windows and demo days.</p>
                        <button className="bg-ibf-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600">Create New Cohort</button>
                    </div>
                )}

                {activeTab === 'mentors' && (
                    <div className="text-center py-12">
                        <UserGroupIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Mentor Network</h3>
                        <p className="text-gray-500 mb-6">Invite and assign mentors to startups.</p>
                        <button className="bg-ibf-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600">Invite Mentor</button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default IncubatorManager;
