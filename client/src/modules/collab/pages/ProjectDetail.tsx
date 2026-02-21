import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeftIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    BriefcaseIcon,
    CalendarIcon,
    EyeIcon,
    SparklesIcon,
    PaperAirplaneIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

interface Milestone {
    title: string;
    amount: number;
    dueDate?: string;
    completed: boolean;
}

interface Project {
    _id: string;
    title: string;
    description: string;
    postedBy: {
        _id: string;
        name?: string;
        company?: string;
    };
    skillsRequired: string[];
    projectType: string;
    collabDetails?: {
        platform: string;
        experienceLevel: string;
        paymentType: string;
        budgetRange?: { min: number; max: number };
        milestones?: Milestone[];
    };
    duration: string;
    estimatedHours?: number;
    compensation?: {
        type: string;
        amount?: number;
        currency?: string;
        hourlyRate?: number;
    };
    status: string;
    applicationDeadline?: string;
    tags: string[];
    metadata: {
        applicationsCount: number;
        viewsCount: number;
    };
    createdAt: string;
}

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/collab/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                console.error(err);
                setError('Project not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProject();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setApplying(true);
        try {
            await api.post('/collab/apply', {
                projectId: id,
                coverLetter
            });
            setApplied(true);
            setIsApplyModalOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setApplying(false);
        }
    };

    const formatBudget = (project: Project) => {
        if (project.compensation?.amount) {
            return `$${project.compensation.amount.toLocaleString()}`;
        }
        if (project.collabDetails?.budgetRange) {
            const { min, max } = project.collabDetails.budgetRange;
            if (project.collabDetails.paymentType === 'hourly') {
                return `$${min} - $${max}/hr`;
            }
            return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
        }
        return 'Budget TBD';
    };

    const getPlatformIcon = (platform?: string) => {
        switch (platform) {
            case 'web': return '🌐';
            case 'mobile': return '📱';
            case 'design': return '🎨';
            case 'marketing': return '📈';
            default: return '💼';
        }
    };

    const getExperienceBadgeColor = (level?: string) => {
        switch (level) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'expert': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
                <ExclamationCircleIcon className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Not Found</h2>
                <p className="text-gray-500 mb-6">{error || 'This project may have been removed.'}</p>
                <Link
                    to="/collab"
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link
                        to="/collab"
                        className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Marketplace
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{getPlatformIcon(project.collabDetails?.platform)}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${project.status === 'open' ? 'bg-green-500' : 'bg-gray-500'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
                            <p className="text-purple-100 text-lg max-w-2xl">{project.description}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {!applied ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsApplyModalOpen(true)}
                                    className="flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <SparklesIcon className="w-5 h-5" />
                                    Apply Now
                                </motion.button>
                            ) : (
                                <div className="flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-bold">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    Application Sent!
                                </div>
                            )}
                            <div className="text-purple-200 text-sm text-center">
                                {project.metadata.applicationsCount} applications • {project.metadata.viewsCount} views
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <CurrencyDollarIcon className="w-8 h-8 mx-auto text-green-500 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatBudget(project)}</p>
                                    <p className="text-sm text-gray-500">{project.collabDetails?.paymentType || 'Fixed'}</p>
                                </div>
                                <div className="text-center">
                                    <ClockIcon className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{project.duration}</p>
                                    <p className="text-sm text-gray-500">Duration</p>
                                </div>
                                <div className="text-center">
                                    <BriefcaseIcon className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{project.collabDetails?.experienceLevel || 'Any'}</p>
                                    <p className="text-sm text-gray-500">Experience</p>
                                </div>
                                <div className="text-center">
                                    <UserGroupIcon className="w-8 h-8 mx-auto text-orange-500 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{project.metadata.applicationsCount}</p>
                                    <p className="text-sm text-gray-500">Applicants</p>
                                </div>
                            </div>
                        </div>

                        {/* Skills Required */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Skills Required</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.skillsRequired.map((skill, index) => (
                                    <motion.span
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-lg font-medium"
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Milestones */}
                        {project.collabDetails?.milestones && project.collabDetails.milestones.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Milestones</h3>
                                <div className="space-y-4">
                                    {project.collabDetails.milestones.map((milestone, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 ${milestone.completed
                                                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                                                    : 'border-gray-200 dark:border-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {milestone.completed ? (
                                                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                                                )}
                                                <span className="font-medium text-gray-900 dark:text-white">{milestone.title}</span>
                                            </div>
                                            <span className="font-bold text-green-600">${milestone.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Posted By */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Posted By</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                    {project.postedBy?.name?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {project.postedBy?.name || 'Anonymous'}
                                    </p>
                                    {project.postedBy?.company && (
                                        <p className="text-sm text-gray-500">{project.postedBy.company}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        Posted
                                    </span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {project.applicationDeadline && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 flex items-center gap-2">
                                            <ExclamationCircleIcon className="w-4 h-4" />
                                            Deadline
                                        </span>
                                        <span className="text-red-500 font-medium">
                                            {new Date(project.applicationDeadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <EyeIcon className="w-4 h-4" />
                                        Views
                                    </span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {project.metadata.viewsCount}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Platform</span>
                                    <span className="text-gray-900 dark:text-white font-medium capitalize">
                                        {project.collabDetails?.platform || 'General'}
                                    </span>
                                </div>
                                {project.collabDetails?.experienceLevel && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Experience Level</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getExperienceBadgeColor(project.collabDetails.experienceLevel)}`}>
                                            {project.collabDetails.experienceLevel}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            <AnimatePresence>
                {isApplyModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                        onClick={() => setIsApplyModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Apply to Project</h2>
                                <button
                                    onClick={() => setIsApplyModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Why are you a great fit for this project?
                                </label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    placeholder="Share your relevant experience, portfolio links, and why you're excited about this project..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsApplyModalOpen(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
                                >
                                    {applying ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                    ) : (
                                        <>
                                            <PaperAirplaneIcon className="w-5 h-5" />
                                            Submit Application
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectDetail;
