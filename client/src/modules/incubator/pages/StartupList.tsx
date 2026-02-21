import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    BuildingOfficeIcon,
    RocketLaunchIcon,
    UserGroupIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    SparklesIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../../../services/api';
import Card from '../../../components/ui/Card';

interface TeamMember {
    name: string;
    role: string;
}

interface Startup {
    _id: string;
    name: string;
    tagline: string;
    description: string;
    industry?: string;
    stage: 'idea' | 'prototype' | 'mvp' | 'launched' | 'scaling';
    team: TeamMember[];
    metrics?: {
        users?: number;
        revenue?: number;
        growthRate?: number;
    };
    cohort?: string;
    incubatorStatus: string;
    website?: string;
    logo?: string;
    funding?: {
        amount?: number;
    };
}

const stageConfig: Record<string, { label: string; color: string; icon: string }> = {
    idea: { label: 'Idea', color: 'bg-gray-100 text-gray-800', icon: '💡' },
    prototype: { label: 'Prototype', color: 'bg-yellow-100 text-yellow-800', icon: '🔧' },
    mvp: { label: 'MVP', color: 'bg-blue-100 text-blue-800', icon: '🚀' },
    launched: { label: 'Launched', color: 'bg-green-100 text-green-800', icon: '✅' },
    scaling: { label: 'Scaling', color: 'bg-purple-100 text-purple-800', icon: '📈' }
};

const StartupList: React.FC = () => {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStage, setSelectedStage] = useState<string | null>(null);
    const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const res = await api.get('/incubator/startups');
                setStartups(res.data);
                setFilteredStartups(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStartups();
    }, []);

    useEffect(() => {
        let result = startups;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.tagline?.toLowerCase().includes(query) ||
                s.industry?.toLowerCase().includes(query)
            );
        }

        if (selectedStage) {
            result = result.filter(s => s.stage === selectedStage);
        }

        if (selectedCohort) {
            result = result.filter(s => s.cohort === selectedCohort);
        }

        setFilteredStartups(result);
    }, [searchQuery, selectedStage, selectedCohort, startups]);

    const cohorts = [...new Set(startups.map(s => s.cohort).filter(Boolean))] as string[];

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedStage(null);
        setSelectedCohort(null);
    };

    const hasActiveFilters = searchQuery || selectedStage || selectedCohort;

    const formatNumber = (num?: number) => {
        if (!num) return '—';
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
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
                        <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
                        Startup Directory
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Discover {startups.length} innovative startups in our incubator
                    </p>
                </div>
                <Link
                    to="/incubator/apply"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                    <SparklesIcon className="w-5 h-5" />
                    Register Your Startup
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
                            placeholder="Search startups..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${showFilters || hasActiveFilters
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <FunnelIcon className="w-5 h-5" />
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
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
                                    {/* Stage Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Stage
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(stageConfig).map(([key, config]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setSelectedStage(selectedStage === key ? null : key)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStage === key
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                >
                                                    {config.icon} {config.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Cohort Filter */}
                                    {cohorts.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Cohort
                                            </label>
                                            <select
                                                value={selectedCohort || ''}
                                                onChange={(e) => setSelectedCohort(e.target.value || null)}
                                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                            >
                                                <option value="">All Cohorts</option>
                                                {cohorts.map(cohort => (
                                                    <option key={cohort} value={cohort}>{cohort}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
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
                    Showing <strong>{filteredStartups.length}</strong> of {startups.length} startups
                </p>
            </div>

            {/* Startup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStartups.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <RocketLaunchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-500 mb-2">No startups found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredStartups.map((startup, index) => (
                        <motion.div
                            key={startup._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-shadow border-l-4 border-blue-500">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                                            {startup.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {startup.name}
                                            </h3>
                                            {startup.industry && (
                                                <p className="text-sm text-gray-500">{startup.industry}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Tagline */}
                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-1">
                                    {startup.tagline}
                                </p>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${stageConfig[startup.stage]?.color}`}>
                                        {stageConfig[startup.stage]?.icon} {stageConfig[startup.stage]?.label}
                                    </span>
                                    {startup.cohort && (
                                        <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-lg text-xs font-medium">
                                            {startup.cohort}
                                        </span>
                                    )}
                                </div>

                                {/* Metrics */}
                                {startup.metrics && (
                                    <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gray-100 dark:border-gray-700">
                                        <div className="text-center">
                                            <UserGroupIcon className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                {formatNumber(startup.metrics.users)}
                                            </p>
                                            <p className="text-xs text-gray-500">Users</p>
                                        </div>
                                        <div className="text-center">
                                            <ChartBarIcon className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                ${formatNumber(startup.metrics.revenue)}
                                            </p>
                                            <p className="text-xs text-gray-500">Revenue</p>
                                        </div>
                                        <div className="text-center">
                                            <ArrowTrendingUpIcon className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                                            <p className="text-sm font-bold text-green-600">
                                                {startup.metrics.growthRate ? `+${startup.metrics.growthRate}%` : '—'}
                                            </p>
                                            <p className="text-xs text-gray-500">Growth</p>
                                        </div>
                                    </div>
                                )}

                                {/* Team */}
                                {startup.team && startup.team.length > 0 && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex -space-x-2">
                                            {startup.team.slice(0, 3).map((member, i) => (
                                                <div
                                                    key={i}
                                                    className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300"
                                                    title={member.name}
                                                >
                                                    {member.name.charAt(0)}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {startup.team.length} team member{startup.team.length > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}

                                {/* Action */}
                                <Link
                                    to={`/incubator/startups/${startup._id}`}
                                    className="inline-flex items-center justify-center w-full py-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    View Details →
                                </Link>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StartupList;
