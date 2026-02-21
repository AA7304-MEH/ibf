import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
// CheckBadgeIcon, BoltIcon were unused

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'growth' | 'comfort'>('all');

    // Application Modal State
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [applyMessage, setApplyMessage] = useState('');
    const [applying, setApplying] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
            const res = await api.get('/skillswap/internships/feed');
            // Assuming the feed returns objects with gig/score, we might need to map them if Projects.tsx expects a direct array
            const projectsData = res.data.map((item: any) => ({
                ...item.gig,
                matchData: { score: item.score, category: item.score > 85 ? 'Perfect Match' : 'Growth Opportunity', breakdown: { skillMatch: item.score, interestMatch: 80, styleMatch: 75 } }
            }));
            setProjects(projectsData);
            setFilteredProjects(projectsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyClick = (project: any) => {
        setSelectedProject(project);
        setApplyMessage(`I am interested in this ${project.title} project because...`);
        setShowModal(true);
    };

    const submitApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProject) return;
        setApplying(true);
        try {
            await api.post(`/skillswap/internships/${selectedProject._id}/apply`, {
                message: applyMessage
            });
            alert('Application submitted successfully! Your parent has been notified for consent.');
            setShowModal(false);
            setApplyMessage('');
        } catch (error) {
            console.error(error);
            alert('Failed to submit application.');
        } finally {
            setApplying(false);
        }
    };

    const getMatchColor = (score: number) => {
        if (score >= 85) return 'text-green-500 border-green-500';
        if (score >= 70) return 'text-blue-500 border-blue-500';
        return 'text-yellow-500 border-yellow-500';
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your personalized matches...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
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
                                    {project.skillsRequired?.map((skill: any, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200">
                                            {typeof skill === 'string' ? skill : skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                    {project.estimatedHours ? `${project.estimatedHours} hrs` : ''}
                                    {project.duration ? ` • ${project.duration}` : ''}
                                </div>
                                <button
                                    onClick={() => handleApplyClick(project)}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    Apply Now
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

            {/* Application Modal */}
            <AnimatePresence>
                {showModal && selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900">Apply to {selectedProject.title}</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={submitApplication} className="p-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message to Mentor</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={applyMessage}
                                        onChange={e => setApplyMessage(e.target.value)}
                                        placeholder="Explain why you are a good fit..."
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={applying}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                                    >
                                        {applying ? 'Sending...' : 'Send Application'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Projects;
