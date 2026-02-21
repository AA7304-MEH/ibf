import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircleIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    ArrowUpTrayIcon,
    FlagIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';

interface Milestone {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'pending' | 'in-review' | 'completed' | 'overdue';
    xpReward: number;
    submissionUrl?: string;
    feedback?: string;
}

interface InternshipProject {
    id: string;
    title: string;
    company: string;
    mentor: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'completed';
    overallProgress: number;
    milestones: Milestone[];
}

const InternshipWorkflow: React.FC = () => {
    const [project, setProject] = useState<InternshipProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

    useEffect(() => {
        // Mock data - in production, fetch from API
        setProject({
            id: '1',
            title: 'Build Landing Page for TechStartup Inc.',
            company: 'TechStartup Inc.',
            mentor: 'Sarah Chen',
            startDate: '2026-01-20',
            endDate: '2026-02-03',
            status: 'active',
            overallProgress: 65,
            milestones: [
                {
                    id: 'm1',
                    title: 'Project Kickoff & Requirements',
                    description: 'Meet with mentor, understand project scope, and create a wireframe.',
                    dueDate: '2026-01-22',
                    status: 'completed',
                    xpReward: 50,
                    feedback: 'Great job on the wireframes! Clear understanding of requirements.'
                },
                {
                    id: 'm2',
                    title: 'Hero Section Development',
                    description: 'Build the hero section with responsive design and animations.',
                    dueDate: '2026-01-26',
                    status: 'completed',
                    xpReward: 100,
                    feedback: 'Excellent work! Animations are smooth and responsive design is perfect.'
                },
                {
                    id: 'm3',
                    title: 'Features & Pricing Sections',
                    description: 'Implement features grid and pricing cards with proper styling.',
                    dueDate: '2026-01-30',
                    status: 'in-review',
                    xpReward: 150,
                    submissionUrl: 'https://github.com/alex/project/pr/3'
                },
                {
                    id: 'm4',
                    title: 'Mobile Optimization & Testing',
                    description: 'Ensure all sections work perfectly on mobile devices.',
                    dueDate: '2026-02-01',
                    status: 'pending',
                    xpReward: 100
                },
                {
                    id: 'm5',
                    title: 'Final Review & Deployment',
                    description: 'Final mentor review, bug fixes, and deployment to production.',
                    dueDate: '2026-02-03',
                    status: 'pending',
                    xpReward: 100
                }
            ]
        });
        setLoading(false);
    }, []);

    const getStatusIcon = (status: Milestone['status']) => {
        switch (status) {
            case 'completed': return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
            case 'in-review': return <ClockIcon className="w-6 h-6 text-yellow-500 animate-pulse" />;
            case 'overdue': return <FlagIcon className="w-6 h-6 text-red-500" />;
            default: return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
        }
    };

    const getStatusColor = (status: Milestone['status']) => {
        switch (status) {
            case 'completed': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
            case 'in-review': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'overdue': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
            default: return 'border-gray-200 dark:border-gray-700';
        }
    };

    const getDaysRemaining = (dueDate: string) => {
        const diff = new Date(dueDate).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    if (loading || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;
    const totalXP = project.milestones.filter(m => m.status === 'completed').reduce((acc, m) => acc + m.xpReward, 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            {/* Project Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden mb-8"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="text-white/70 text-sm mb-1">Active Project</p>
                            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                            <div className="flex items-center gap-4 text-white/80">
                                <span>🏢 {project.company}</span>
                                <span>👨‍🏫 Mentor: {project.mentor}</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl text-center">
                                <p className="text-2xl font-bold">{completedMilestones}/{project.milestones.length}</p>
                                <p className="text-sm text-white/70">Milestones</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl text-center">
                                <p className="text-2xl font-bold text-amber-300">{totalXP}</p>
                                <p className="text-sm text-white/70">XP Earned</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Overall Progress</span>
                            <span>{project.overallProgress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                            <div
                                className="bg-white h-full rounded-full transition-all"
                                style={{ width: `${project.overallProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Milestones Timeline */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <FlagIcon className="w-6 h-6 text-indigo-600" />
                        Project Milestones
                    </h2>

                    <div className="space-y-4">
                        {project.milestones.map((milestone, idx) => (
                            <motion.div
                                key={milestone.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 ${getStatusColor(milestone.status)} shadow-sm cursor-pointer hover:shadow-md transition-all`}
                                onClick={() => setSelectedMilestone(milestone)}
                            >
                                <div className="flex items-start gap-4">
                                    {getStatusIcon(milestone.status)}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{milestone.title}</h3>
                                            <span className="text-amber-600 font-bold text-sm">+{milestone.xpReward} XP</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                                        <div className="flex items-center gap-4 mt-3 text-sm">
                                            <span className={`${getDaysRemaining(milestone.dueDate) < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                                📅 Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                            </span>
                                            {milestone.status === 'in-review' && (
                                                <span className="text-yellow-600">🔍 Under Review</span>
                                            )}
                                            {milestone.status === 'completed' && milestone.feedback && (
                                                <span className="text-green-600">✅ Feedback Available</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                                <ArrowUpTrayIcon className="w-5 h-5" />
                                Submit Work
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                Message Mentor
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
                                <DocumentTextIcon className="w-5 h-5" />
                                View Brief
                            </button>
                        </div>
                    </div>

                    {/* XP Progress */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <TrophyIcon className="w-8 h-8" />
                            <div>
                                <p className="text-sm text-white/80">Project XP</p>
                                <p className="text-3xl font-bold">{totalXP} / 500</p>
                            </div>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                            <div
                                className="bg-white h-full rounded-full"
                                style={{ width: `${(totalXP / 500) * 100}%` }}
                            />
                        </div>
                        <p className="text-sm text-white/80">Complete all milestones to earn full XP!</p>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Project Timeline</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Start Date</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {new Date(project.startDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">End Date</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {new Date(project.endDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Days Remaining</span>
                                <span className="font-medium text-indigo-600">
                                    {getDaysRemaining(project.endDate)} days
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternshipWorkflow;
