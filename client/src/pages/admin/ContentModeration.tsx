import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheckIcon,
    FlagIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    UserIcon,
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    PhotoIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

interface FlaggedContent {
    _id: string;
    type: 'project' | 'message' | 'profile' | 'review';
    contentId: string;
    contentPreview: string;
    reportedBy: { _id: string; email: string };
    reportedUser: { _id: string; email: string; name?: string };
    reason: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
    createdAt: string;
}

const severityConfig: Record<string, { bg: string; text: string; label: string }> = {
    low: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Low' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' },
    high: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'High' },
    critical: { bg: 'bg-red-100', text: 'text-red-800', label: 'Critical' }
};

const typeIcons: Record<string, React.ElementType> = {
    project: DocumentTextIcon,
    message: ChatBubbleLeftRightIcon,
    profile: UserIcon,
    review: PhotoIcon
};

const ContentModeration: React.FC = () => {
    const [flaggedItems, setFlaggedItems] = useState<FlaggedContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing'>('pending');
    const [selectedItem, setSelectedItem] = useState<FlaggedContent | null>(null);
    const [resolution, setResolution] = useState('');

    useEffect(() => {
        fetchFlaggedContent();
    }, []);

    const fetchFlaggedContent = async () => {
        try {
            // Mock data since this endpoint doesn't exist yet
            const mockItems: FlaggedContent[] = [
                {
                    _id: 'flag_1',
                    type: 'message',
                    contentId: 'msg_123',
                    contentPreview: 'This message contained inappropriate language and was flagged automatically...',
                    reportedBy: { _id: 'user_1', email: 'reporter@example.com' },
                    reportedUser: { _id: 'user_2', email: 'offender@example.com', name: 'John Doe' },
                    reason: 'Inappropriate language',
                    severity: 'high',
                    status: 'pending',
                    createdAt: new Date().toISOString()
                },
                {
                    _id: 'flag_2',
                    type: 'project',
                    contentId: 'proj_456',
                    contentPreview: 'Project posting with misleading information about payment terms...',
                    reportedBy: { _id: 'user_3', email: 'user3@example.com' },
                    reportedUser: { _id: 'user_4', email: 'founder@startup.com', name: 'Jane Smith' },
                    reason: 'Misleading information',
                    severity: 'medium',
                    status: 'pending',
                    createdAt: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    _id: 'flag_3',
                    type: 'profile',
                    contentId: 'profile_789',
                    contentPreview: 'Profile contains fake credentials and misleading work history...',
                    reportedBy: { _id: 'user_5', email: 'user5@example.com' },
                    reportedUser: { _id: 'user_6', email: 'fake@talent.com', name: 'Fake Profile' },
                    reason: 'Fake credentials',
                    severity: 'critical',
                    status: 'reviewing',
                    createdAt: new Date(Date.now() - 7200000).toISOString()
                }
            ];
            setFlaggedItems(mockItems);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (itemId: string, action: 'approve' | 'remove' | 'dismiss') => {
        try {
            // API call would go here
            setFlaggedItems(prev => prev.map(item =>
                item._id === itemId ? { ...item, status: 'resolved' as const } : item
            ));
            setSelectedItem(null);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredItems = flaggedItems.filter(item => {
        if (filter === 'all') return true;
        return item.status === filter;
    });

    const pendingCount = flaggedItems.filter(i => i.status === 'pending').length;
    const reviewingCount = flaggedItems.filter(i => i.status === 'reviewing').length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <ShieldCheckIcon className="w-8 h-8 text-red-600" />
                            Content Moderation
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Review and manage flagged content
                        </p>
                    </div>
                    <button
                        onClick={fetchFlaggedContent}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                        Refresh
                    </button>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        onClick={() => setFilter('pending')}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${filter === 'pending' ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500' : 'bg-white dark:bg-gray-800'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <ClockIcon className="w-8 h-8 text-red-500" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
                                <p className="text-sm text-gray-500">Pending Review</p>
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => setFilter('reviewing')}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${filter === 'reviewing' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500' : 'bg-white dark:bg-gray-800'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <EyeIcon className="w-8 h-8 text-yellow-500" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reviewingCount}</p>
                                <p className="text-sm text-gray-500">Under Review</p>
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => setFilter('all')}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${filter === 'all' ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500' : 'bg-white dark:bg-gray-800'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <FlagIcon className="w-8 h-8 text-blue-500" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{flaggedItems.length}</p>
                                <p className="text-sm text-gray-500">Total Flags</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flagged Items List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    {filteredItems.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                            <CheckCircleIcon className="w-12 h-12 mx-auto mb-4 text-green-500" />
                            <p className="font-medium">All clear!</p>
                            <p className="text-sm">No content requires moderation</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredItems.map(item => {
                                const TypeIcon = typeIcons[item.type];
                                const severity = severityConfig[item.severity];

                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${severity.bg}`}>
                                                <TypeIcon className={`w-5 h-5 ${severity.text}`} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${severity.bg} ${severity.text}`}>
                                                        {severity.label}
                                                    </span>
                                                    <span className="text-sm text-gray-500 capitalize">{item.type}</span>
                                                </div>

                                                <p className="font-medium text-gray-900 dark:text-white mb-1">
                                                    {item.reason}
                                                </p>

                                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                                                    {item.contentPreview}
                                                </p>

                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>Reported: {item.reportedUser.name || item.reportedUser.email}</span>
                                                    <span>•</span>
                                                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedItem(item)}
                                                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                                                >
                                                    Review
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Review Modal */}
                <AnimatePresence>
                    {selectedItem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                            onClick={() => setSelectedItem(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Review Flagged Content
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <p className="text-sm font-medium text-gray-500 mb-2">Content Preview</p>
                                        <p className="text-gray-900 dark:text-white">{selectedItem.contentPreview}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Reported User</p>
                                            <p className="font-medium">{selectedItem.reportedUser.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Reason</p>
                                            <p className="font-medium">{selectedItem.reason}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Resolution Notes
                                        </label>
                                        <textarea
                                            value={resolution}
                                            onChange={(e) => setResolution(e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="Add notes about this decision..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleResolve(selectedItem._id, 'dismiss')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <XCircleIcon className="w-5 h-5 text-gray-500" />
                                        Dismiss
                                    </button>
                                    <button
                                        onClick={() => handleResolve(selectedItem._id, 'approve')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
                                    >
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleResolve(selectedItem._id, 'remove')}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
                                    >
                                        <ExclamationTriangleIcon className="w-5 h-5" />
                                        Remove
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ContentModeration;
