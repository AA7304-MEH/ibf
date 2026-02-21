import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    RocketLaunchIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    ClockIcon,
    AcademicCapIcon,
    SparklesIcon,
    ShieldCheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface Internship {
    _id: string;
    title: string;
    description: string;
    company: { firstName: string; lastName: string; companyName?: string };
    category: string;
    duration: string;
    skillsRequired: { name: string; level: string }[];
    xpReward: number;
    compensation?: { type: string; amount: number; currency: string };
    status: string;
    applicantCount?: number;
}

const InternshipMarketplace: React.FC = () => {
    const [internships, setInternships] = useState<{ gig: Internship; score: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
    const [applyingId, setApplyingId] = useState<string | null>(null);
    const [parentalApprovalRequired, setParentalApprovalRequired] = useState(false);
    const navigate = useNavigate();

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [durationFilter, setDurationFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const categories = ['all', 'Tech', 'Marketing', 'Design', 'Data', 'Business', 'Creative'];
    const durations = ['all', '1 week', '2 weeks', '3 weeks', '4 weeks'];

    useEffect(() => {
        fetchFeed();
    }, []);

    const fetchFeed = async () => {
        try {
            const res = await api.get('/skillswap/internships/feed');
            setInternships(res.data);
        } catch (err) {
            // Mock data for demo
            setInternships([
                {
                    gig: {
                        _id: '1',
                        title: 'Build a Landing Page',
                        description: 'Create a modern, responsive landing page for our SaaS product using React and Tailwind CSS.',
                        company: { firstName: 'Sarah', lastName: 'Chen', companyName: 'TechStartup Inc.' },
                        category: 'Tech',
                        duration: '2 weeks',
                        skillsRequired: [{ name: 'React', level: 'intermediate' }, { name: 'CSS', level: 'beginner' }],
                        xpReward: 500,
                        status: 'open',
                        applicantCount: 12
                    },
                    score: 92
                },
                {
                    gig: {
                        _id: '2',
                        title: 'Social Media Campaign',
                        description: 'Design and execute a 2-week social media campaign for brand awareness.',
                        company: { firstName: 'Mike', lastName: 'Ross', companyName: 'Creative Agency' },
                        category: 'Marketing',
                        duration: '2 weeks',
                        skillsRequired: [{ name: 'Social Media', level: 'beginner' }, { name: 'Copywriting', level: 'beginner' }],
                        xpReward: 400,
                        status: 'open',
                        applicantCount: 8
                    },
                    score: 85
                },
                {
                    gig: {
                        _id: '3',
                        title: 'Data Analysis Dashboard',
                        description: 'Create interactive data visualizations using Python and Plotly.',
                        company: { firstName: 'Emily', lastName: 'Zhang', companyName: 'Analytics Co.' },
                        category: 'Data',
                        duration: '3 weeks',
                        skillsRequired: [{ name: 'Python', level: 'intermediate' }, { name: 'Data Viz', level: 'beginner' }],
                        xpReward: 750,
                        status: 'open',
                        applicantCount: 5
                    },
                    score: 78
                },
                {
                    gig: {
                        _id: '4',
                        title: 'UI/UX Redesign',
                        description: 'Redesign the mobile app interface for better user experience.',
                        company: { firstName: 'Alex', lastName: 'Kim', companyName: 'DesignLab' },
                        category: 'Design',
                        duration: '4 weeks',
                        skillsRequired: [{ name: 'Figma', level: 'intermediate' }, { name: 'UI Design', level: 'beginner' }],
                        xpReward: 800,
                        status: 'open',
                        applicantCount: 15
                    },
                    score: 88
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (internship: Internship) => {
        setApplyingId(internship._id);
        try {
            const res = await api.post(`/skillswap/internships/${internship._id}/apply`);

            if (res.data.requiresParentalApproval) {
                setParentalApprovalRequired(true);
                setSelectedInternship(internship);
            } else {
                alert(`🎉 Application sent! Match Score: ${res.data.score}%\n\nYou'll hear back within 48 hours.`);
                setSelectedInternship(null);
            }
        } catch (err: any) {
            if (err.response?.data?.requiresParentalApproval) {
                setParentalApprovalRequired(true);
                setSelectedInternship(internship);
            } else {
                alert('Failed to apply. Please try again.');
            }
        } finally {
            setApplyingId(null);
        }
    };

    const filteredInternships = internships.filter(({ gig }) => {
        const matchesSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            gig.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || gig.category === categoryFilter;
        const matchesDuration = durationFilter === 'all' || gig.duration === durationFilter;
        return matchesSearch && matchesCategory && matchesDuration;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Finding opportunities matched to your skills...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden mb-8"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <RocketLaunchIcon className="w-10 h-10" />
                        <h1 className="text-4xl font-bold">Micro-Internships</h1>
                    </div>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Short-term, high-impact projects matched to your skills. Build your portfolio, earn XP, and get real-world experience.
                    </p>
                </div>
            </motion.div>

            {/* Search & Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search internships..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${showFilters ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                    <FunnelIcon className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex flex-wrap gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategoryFilter(cat)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${categoryFilter === cat
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                                }`}
                                        >
                                            {cat === 'all' ? 'All' : cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Duration</label>
                                <div className="flex flex-wrap gap-2">
                                    {durations.map((dur) => (
                                        <button
                                            key={dur}
                                            onClick={() => setDurationFilter(dur)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${durationFilter === dur
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                                }`}
                                        >
                                            {dur === 'all' ? 'All' : dur}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Count */}
            <p className="text-gray-500 mb-4">{filteredInternships.length} opportunities found</p>

            {/* Internship Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.map(({ gig, score }) => (
                    <motion.div
                        key={gig._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                        onClick={() => setSelectedInternship(gig)}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-block px-3 py-1 text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full">
                                    {gig.category}
                                </span>
                                <div className="flex flex-col items-end">
                                    <span className="text-xl font-bold text-green-600">{score}%</span>
                                    <span className="text-xs text-gray-500">Match</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{gig.title}</h3>
                            <p className="text-sm text-gray-500 mb-3">{gig.company.companyName || `${gig.company.firstName} ${gig.company.lastName}`}</p>

                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                {gig.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {gig.skillsRequired?.slice(0, 3).map((skill, idx) => (
                                    <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <ClockIcon className="w-4 h-4" />
                                        {gig.duration}
                                    </span>
                                </div>
                                <span className="font-bold text-amber-600">+{gig.xpReward} XP</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Internship Detail Modal */}
            <AnimatePresence>
                {selectedInternship && !parentalApprovalRequired && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedInternship(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inline-block px-3 py-1 text-sm font-bold bg-indigo-100 text-indigo-800 rounded-full">
                                        {selectedInternship.category}
                                    </span>
                                    <button
                                        onClick={() => setSelectedInternship(null)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedInternship.title}</h2>
                                <p className="text-gray-500 mb-4">
                                    {selectedInternship.company.companyName || `${selectedInternship.company.firstName} ${selectedInternship.company.lastName}`}
                                </p>

                                <p className="text-gray-600 dark:text-gray-300 mb-6">{selectedInternship.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <ClockIcon className="w-4 h-4" />
                                            <span className="text-sm">Duration</span>
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white">{selectedInternship.duration}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <SparklesIcon className="w-4 h-4" />
                                            <span className="text-sm">XP Reward</span>
                                        </div>
                                        <p className="font-bold text-amber-600">{selectedInternship.xpReward} XP</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <AcademicCapIcon className="w-4 h-4" />
                                            <span className="text-sm">Applicants</span>
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white">{selectedInternship.applicantCount || 0}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">Required Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedInternship.skillsRequired?.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-sm">
                                                {skill.name} • {skill.level}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-6">
                                    <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-800 dark:text-green-300">Parent-Approved Platform</p>
                                        <p className="text-sm text-green-700 dark:text-green-400">Your parent/guardian will be notified and must approve your application.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleApply(selectedInternship)}
                                    disabled={applyingId === selectedInternship._id}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {applyingId === selectedInternship._id ? 'Sending Application...' : 'Apply Now'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Parental Approval Modal */}
            <AnimatePresence>
                {parentalApprovalRequired && selectedInternship && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Parental Approval Required</h2>
                            <p className="text-gray-500 mb-6">
                                Your application for "<strong>{selectedInternship.title}</strong>" has been submitted!
                                Your parent/guardian will receive a notification to approve this internship.
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    ✅ Application received<br />
                                    ⏳ Waiting for parent approval<br />
                                    📧 Notification sent to: parent@email.com
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setParentalApprovalRequired(false);
                                    setSelectedInternship(null);
                                }}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700"
                            >
                                Got It!
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InternshipMarketplace;
