import React, { useState, useEffect } from 'react';
import { RocketLaunchIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

interface Mission {
    id: string;
    title: string;
    company: string;
    deadline: string;
    progress: number;
    status: 'in-progress' | 'review' | 'completed' | 'overdue';
    xpReward: number;
}

const ActiveMissionsPanel: React.FC = () => {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        try {
            const res = await api.get('/internships/my-active');
            setMissions(res.data);
        } catch (error) {
            // Mock data for demo
            setMissions([
                {
                    id: '1',
                    title: 'Build Landing Page',
                    company: 'TechStartup Inc.',
                    deadline: '2026-02-05',
                    progress: 65,
                    status: 'in-progress',
                    xpReward: 500
                },
                {
                    id: '2',
                    title: 'Data Analysis Report',
                    company: 'Analytics Co.',
                    deadline: '2026-02-10',
                    progress: 30,
                    status: 'in-progress',
                    xpReward: 750
                },
                {
                    id: '3',
                    title: 'Logo Design Sprint',
                    company: 'Creative Agency',
                    deadline: '2026-02-01',
                    progress: 100,
                    status: 'review',
                    xpReward: 300
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: Mission['status']) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getDaysRemaining = (deadline: string) => {
        const diff = new Date(deadline).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-2xl" />;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <RocketLaunchIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Missions</h2>
                        <p className="text-sm text-gray-500">{missions.length} ongoing micro-internships</p>
                    </div>
                </div>
                <button className="text-sm text-indigo-600 hover:underline font-medium">View All</button>
            </div>

            <div className="space-y-4">
                {missions.map((mission) => (
                    <div
                        key={mission.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                    {mission.title}
                                </h3>
                                <p className="text-sm text-gray-500">{mission.company}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getStatusColor(mission.status)}`}>
                                {mission.status === 'in-progress' ? 'In Progress' : mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Progress</span>
                                <span className="font-bold text-gray-700 dark:text-gray-300">{mission.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                    className={`h-full rounded-full transition-all ${mission.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                                    style={{ width: `${mission.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-1 text-gray-500">
                                <ClockIcon className="w-4 h-4" />
                                <span>
                                    {getDaysRemaining(mission.deadline) > 0
                                        ? `${getDaysRemaining(mission.deadline)} days left`
                                        : 'Due today'}
                                </span>
                            </div>
                            <span className="font-bold text-amber-600">+{mission.xpReward} XP</span>
                        </div>
                    </div>
                ))}
            </div>

            {missions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <RocketLaunchIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No active missions. Browse internships to get started!</p>
                </div>
            )}
        </div>
    );
};

export default ActiveMissionsPanel;
