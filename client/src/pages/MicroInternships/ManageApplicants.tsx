import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import {
    BriefcaseIcon,
    UserGroupIcon,
    CheckCircleIcon,
    ClockIcon,
    XMarkIcon,
    ChatBubbleLeftRightIcon,
    StarIcon,
    EyeIcon,
    ChartBarIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';


interface Applicant {
    id: string; // This is the internship ID
    student: {
        _id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        level: number;
        xp: number;
    };
    internshipId: string;
    internshipTitle: string;
    matchScore: number;
    status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'closed';
    appliedAt: string;
    parentApproved: boolean;
    skills: string[];
    compensation?: {
        type: string;
        amount: number;
        currency: string;
    };
}

interface Internship {
    _id: string;
    title: string;
    status: string;
}

const ManageApplicants: React.FC = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [myInternships, setMyInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterInternship, setFilterInternship] = useState<string>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [applicantsRes, internshipsRes] = await Promise.all([
                api.get('/skillswap/applicants'),
                api.get('/skillswap/my-listings')
            ]);
            setApplicants(applicantsRes.data);
            setMyInternships(internshipsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (internshipId: string, newStatus: Applicant['status']) => {
        try {
            await api.patch(`/skillswap/applicants/${internshipId}`, { status: newStatus === 'pending' ? 'pending_parent' : newStatus });
            alert(`Status updated to ${newStatus}`);
            fetchData();
            setSelectedApplicant(null);
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status: Applicant['status']) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const filteredApplicants = applicants.filter(a => {
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'pending' && a.status === 'pending') ||
            a.status === filterStatus;
        const matchesInternship = filterInternship === 'all' || a.internshipId === filterInternship;
        return matchesStatus && matchesInternship;
    });

    const stats = {
        total: applicants.length,
        pending: applicants.filter(a => a.status === 'pending').length,
        approved: applicants.filter(a => a.status === 'approved').length,
        inProgress: applicants.filter(a => a.status === 'in_progress').length,
    };



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden mb-8"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <UserGroupIcon className="w-10 h-10" />
                        <h1 className="text-4xl font-bold">Manage Applicants</h1>
                    </div>
                    <p className="text-white/80 text-lg">Review and manage applications for your micro-internships</p>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Applicants', value: stats.total, icon: UserGroupIcon, color: 'indigo' },
                    { label: 'Pending Review', value: stats.pending, icon: ClockIcon, color: 'yellow' },
                    { label: 'Approved', value: stats.approved, icon: CheckCircleIcon, color: 'green' },
                    { label: 'In Progress', value: stats.inProgress, icon: BriefcaseIcon, color: 'blue' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <stat.icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    value={filterInternship}
                    onChange={(e) => setFilterInternship(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                >
                    <option value="all">All Internships</option>
                    {myInternships.map((i) => (
                        <option key={i._id} value={i._id}>{i.title}</option>
                    ))}
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Applicants Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Applicant</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Internship</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Match</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Parent</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredApplicants.map((applicant) => (
                                <motion.tr
                                    key={applicant.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {applicant.student.firstName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {applicant.student.firstName} {applicant.student.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500">Level {applicant.student.level} • {applicant.student.xp} XP</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 line-clamp-1 max-w-[200px]">{applicant.internshipTitle}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-lg font-bold text-green-600">{applicant.matchScore}%</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(applicant.status)}`}>
                                            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1).replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {applicant.parentApproved ? (
                                            <span className="text-green-600 flex items-center gap-1">
                                                <CheckCircleIcon className="w-5 h-5" /> Approved
                                            </span>
                                        ) : (
                                            <span className="text-yellow-600 flex items-center gap-1">
                                                <ClockIcon className="w-5 h-5" /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedApplicant(applicant)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600"
                                            >
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Applicant Detail Modal */}
            <AnimatePresence>
                {selectedApplicant && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedApplicant(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {selectedApplicant.student.firstName.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {selectedApplicant.student.firstName} {selectedApplicant.student.lastName}
                                        </h2>
                                        <p className="text-gray-500">Level {selectedApplicant.student.level} • {selectedApplicant.student.xp} XP</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedApplicant(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-medium text-gray-500 mb-2">Applied For</h3>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedApplicant.internshipTitle}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Match Score</p>
                                    <p className="text-2xl font-bold text-green-600">{selectedApplicant.matchScore}%</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <p className={`text-lg font-bold ${getStatusColor(selectedApplicant.status)} bg-transparent border-none p-0`}>
                                        {selectedApplicant.status.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-medium text-gray-500 mb-2">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedApplicant.skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {selectedApplicant.status === 'pending' && selectedApplicant.parentApproved && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleStatusChange(selectedApplicant.id, 'approved')}
                                            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20"
                                        >
                                            ✅ Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(selectedApplicant.id, 'rejected')}
                                            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-600/20"
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                )}

                                {selectedApplicant.status === 'approved' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedApplicant.id, 'in_progress')}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                                    >
                                        🚀 Start Internship
                                    </button>
                                )}

                                {selectedApplicant.status === 'in_progress' && (
                                    <button
                                        onClick={() => handleStatusChange(selectedApplicant.id, 'completed')}
                                        className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-600/20"
                                    >
                                        ✨ Mark as Completed
                                    </button>
                                )}



                                <button
                                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
                                >
                                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                    Message Student
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageApplicants;
