import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { FunnelIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, boltIcon } from '@heroicons/react/24/solid';

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'growth' | 'comfort'>('all');

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (activeFilter === 'all') {
            setFilteredProjects(projects);
        } else if (activeFilter === 'growth') {
            setFilteredProjects(projects.filter(p =>
                p.matchData?.category === 'Growth Opportunity' ||
                p.matchData?.category === 'Stretch'
            ));
        } else if (activeFilter === 'comfort') {
            setFilteredProjects(projects.filter(p =>
                p.matchData?.category === 'Comfort Zone' ||
                p.matchData?.category === 'Perfect Match'
            ));
        }
    }, [activeFilter, projects]);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects?type=skillswap');
            setProjects(res.data);
            setFilteredProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getMatchColor = (score: number) => {
        if (score >= 85) return 'text-green-500 border-green-500';
        if (score >= 70) return 'text-blue-500 border-blue-500';
        return 'text-yellow-500 border-yellow-500';
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your personalized matches...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Project Discovery</h1>
                    <p className="mt-2 text-gray-600">AI-curated opportunities matched to your Skill DNA.</p>
                </div>

                <div className="mt-4 md:mt-0 flex space-x-2">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                    >
                        All Matches
                    </button>
                    <button
                        onClick={() => setActiveFilter('growth')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${activeFilter === 'growth' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                    >
                        <SparklesIcon className="w-4 h-4 mr-1" />
                        Growth Zone
                    </button>
                    <button
                        onClick={() => setActiveFilter('comfort')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'comfort' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                    >
                        High Match
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                            ${project.skillswapDetails?.difficultyTier === 'Explorer' ? 'bg-green-100 text-green-800' :
                                                project.skillswapDetails?.difficultyTier === 'Builder' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                            {project.skillswapDetails?.difficultyTier}
                                        </span>
                                        {project.isRemote && (
                                            <span className="text-gray-500 text-xs flex items-center">
                                                Remote
                                            </span>
                                        )}
                                    </div>

                                    {/* Match Score Badge */}
                                    {project.matchData && (
                                        <div className="relative group cursor-help">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold text-sm ${getMatchColor(project.matchData.score)}`}>
                                                {project.matchData.score}%
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute right-0 top-14 w-48 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                                <div className="font-bold mb-1 border-b border-gray-700 pb-1">{project.matchData.category}</div>
                                                <div className="flex justify-between"><span>Skills:</span> <span>{project.matchData.breakdown.skillMatch}%</span></div>
                                                <div className="flex justify-between"><span>Interest:</span> <span>{project.matchData.breakdown.interestMatch}%</span></div>
                                                <div className="flex justify-between"><span>Style:</span> <span>{project.matchData.breakdown.styleMatch}%</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{project.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.skillsRequired?.map((skill: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                    {project.estimatedHours} hrs • {project.duration}
                                </div>
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                    View Details →
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No projects found matching your criteria.</p>
                    <button onClick={() => setActiveFilter('all')} className="mt-4 text-blue-600 hover:underline">Clear filters</button>
                </div>
            )}
        </div>
    );
};

export default Projects;
