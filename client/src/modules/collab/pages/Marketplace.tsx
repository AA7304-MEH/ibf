import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    BriefcaseIcon,
    CurrencyDollarIcon,
    ClockIcon,
    SparklesIcon,
    XMarkIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
    PaintBrushIcon,
    ChartBarIcon,
    EllipsisHorizontalCircleIcon,
    BookmarkIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import api from '../../../services/api';
import Card from '../../../components/ui/Card';
import { useAuth } from '../../../context/AuthContext';

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
    collabDetails?: {
        platform: string;
        experienceLevel: string;
        paymentType: string;
        budgetRange?: { min: number; max: number };
    };
    duration: string;
    status: string;
    metadata: {
        applicationsCount: number;
        viewsCount: number;
    };
    createdAt: string;
}

const platformConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
    web: { icon: ComputerDesktopIcon, label: 'Web', color: 'text-blue-500' },
    mobile: { icon: DevicePhoneMobileIcon, label: 'Mobile', color: 'text-green-500' },
    design: { icon: PaintBrushIcon, label: 'Design', color: 'text-pink-500' },
    marketing: { icon: ChartBarIcon, label: 'Marketing', color: 'text-orange-500' },
    other: { icon: EllipsisHorizontalCircleIcon, label: 'Other', color: 'text-gray-500' }
};

const Marketplace: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [savedProjects, setSavedProjects] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/collab/projects');
                setProjects(res.data);
                setFilteredProjects(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        let result = projects;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.skillsRequired.some(s => s.toLowerCase().includes(query))
            );
        }

        if (selectedPlatform) {
            result = result.filter(p => p.collabDetails?.platform === selectedPlatform);
        }

        if (selectedExperience) {
            result = result.filter(p => p.collabDetails?.experienceLevel === selectedExperience);
        }

        setFilteredProjects(result);
    }, [searchQuery, selectedPlatform, selectedExperience, projects]);

    const toggleSaved = (projectId: string) => {
        setSavedProjects(prev => {
            const newSet = new Set(prev);
            if (newSet.has(projectId)) {
                newSet.delete(projectId);
            } else {
                newSet.add(projectId);
            }
            return newSet;
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedPlatform(null);
        setSelectedExperience(null);
    };

    const hasActiveFilters = searchQuery || selectedPlatform || selectedExperience;

    const formatBudget = (project: Project) => {
        if (project.collabDetails?.budgetRange) {
            const { min, max } = project.collabDetails.budgetRange;
            if (project.collabDetails.paymentType === 'hourly') {
                return `$${min}-$${max}/hr`;
            }
            return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
        }
        return 'TBD';
    };

    const getTimeSince = (date: string) => {
        const now = new Date();
        const posted = new Date(date);
        const days = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <BriefcaseIcon className="w-8 h-8 text-purple-600" />
                        Collab Marketplace
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Find work, join teams, and build your portfolio with {projects.length} active projects
                    </p>
                </div>
                <Link
                    to="/collab/post"
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
                >
                    <SparklesIcon className="w-5 h-5" />
                    Post a Project
                </Link>
            </header>

            {/* Search & Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search projects or skills..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${showFilters || hasActiveFilters
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <FunnelIcon className="w-5 h-5" />
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-1 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                !
                            </span>
                        )}
                    </button>
                </div>

                {/* Expanded Filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Platform Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Platform
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(platformConfig).map(([key, config]) => {
                                                const Icon = config.icon;
                                                return (
                                                    <button
                                                        key={key}
                                                        onClick={() => setSelectedPlatform(selectedPlatform === key ? null : key)}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedPlatform === key
                                                                ? 'bg-purple-600 text-white'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        <Icon className={`w-4 h-4 ${selectedPlatform === key ? 'text-white' : config.color}`} />
                                                        {config.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Experience Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Experience Level
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {['beginner', 'intermediate', 'expert'].map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => setSelectedExperience(selectedExperience === level ? null : level)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${selectedExperience === level
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-gray-500 dark:text-gray-400">
                    Showing <strong>{filteredProjects.length}</strong> of {projects.length} projects
                </p>
                {savedProjects.size > 0 && (
                    <p className="text-purple-600 dark:text-purple-400 font-medium">
                        {savedProjects.size} saved
                    </p>
                )}
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <BriefcaseIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-500 mb-2">No projects found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredProjects.map((project, index) => {
                        const platform = platformConfig[project.collabDetails?.platform || 'other'];
                        const PlatformIcon = platform.icon;
                        const isSaved = savedProjects.has(project._id);

                        return (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-shadow border-l-4 border-purple-500">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${platform.color}`}>
                                                <PlatformIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500">{platform.label}</span>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                                                    {project.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleSaved(project._id)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            {isSaved ? (
                                                <BookmarkSolidIcon className="w-5 h-5 text-purple-600" />
                                            ) : (
                                                <BookmarkIcon className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-1">
                                        {project.description}
                                    </p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.skillsRequired.slice(0, 4).map(skill => (
                                            <span
                                                key={skill}
                                                className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-lg text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {project.skillsRequired.length > 4 && (
                                            <span className="text-xs text-gray-500">
                                                +{project.skillsRequired.length - 4} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 py-3 border-y border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-1">
                                            <CurrencyDollarIcon className="w-4 h-4" />
                                            <span className="font-medium text-green-600">{formatBudget(project)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ClockIcon className="w-4 h-4" />
                                            <span>{project.duration}</span>
                                        </div>
                                        <span className="ml-auto">{getTimeSince(project.createdAt)}</span>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                {project.postedBy?.name?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {project.postedBy?.name || 'Anonymous'}
                                            </span>
                                        </div>
                                        <Link
                                            to={`/collab/project/${project._id}`}
                                            className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 transition-colors"
                                        >
                                            View Details
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Marketplace;
