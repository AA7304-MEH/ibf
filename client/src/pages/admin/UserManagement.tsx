import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    UserIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
    CheckCircleIcon,
    NoSymbolIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

interface User {
    _id: string;
    email: string;
    name?: string;
    role: 'founder' | 'talent' | 'student' | 'admin';
    isVerified: boolean;
    isProfileComplete: boolean;
    isSuspended?: boolean;
    createdAt: string;
    lastLogin?: string;
}

const roleColors: Record<string, string> = {
    founder: 'bg-blue-100 text-blue-800',
    talent: 'bg-purple-100 text-purple-800',
    student: 'bg-green-100 text-green-800',
    admin: 'bg-red-100 text-red-800'
};

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [page, setPage] = useState(1);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState<'suspend' | 'delete' | 'verify' | null>(null);

    const itemsPerPage = 15;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data || []);
            setFilteredUsers(res.data || []);
        } catch (err) {
            console.error(err);
            // Mock data for demo
            const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
                _id: `user_${i}`,
                email: `user${i}@example.com`,
                name: `User ${i}`,
                role: ['founder', 'talent', 'student', 'admin'][Math.floor(Math.random() * 4)] as any,
                isVerified: Math.random() > 0.3,
                isProfileComplete: Math.random() > 0.2,
                isSuspended: Math.random() > 0.9,
                createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
            }));
            setUsers(mockUsers);
            setFilteredUsers(mockUsers);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = users;

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(u =>
                u.email.toLowerCase().includes(q) ||
                u.name?.toLowerCase().includes(q)
            );
        }

        if (roleFilter) {
            result = result.filter(u => u.role === roleFilter);
        }

        if (statusFilter === 'verified') {
            result = result.filter(u => u.isVerified);
        } else if (statusFilter === 'suspended') {
            result = result.filter(u => u.isSuspended);
        } else if (statusFilter === 'incomplete') {
            result = result.filter(u => !u.isProfileComplete);
        }

        setFilteredUsers(result);
        setPage(1);
    }, [search, roleFilter, statusFilter, users]);

    const handleAction = async () => {
        if (!selectedUser || !actionType) return;

        try {
            if (actionType === 'suspend') {
                await api.post(`/auth/users/${selectedUser._id}/suspend`);
            } else if (actionType === 'verify') {
                await api.post(`/auth/users/${selectedUser._id}/verify`);
            } else if (actionType === 'delete') {
                await api.delete(`/auth/users/${selectedUser._id}`);
            }
            fetchUsers();
        } catch (err) {
            console.error(err);
        } finally {
            setShowActionModal(false);
            setSelectedUser(null);
            setActionType(null);
        }
    };

    const openActionModal = (user: User, action: 'suspend' | 'delete' | 'verify') => {
        setSelectedUser(user);
        setActionType(action);
        setShowActionModal(true);
    };

    const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <header>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <UserIcon className="w-8 h-8 text-blue-600" />
                        User Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage {users.length} registered users
                    </p>
                </header>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                        </div>

                        <select
                            value={roleFilter || ''}
                            onChange={(e) => setRoleFilter(e.target.value || null)}
                            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                        >
                            <option value="">All Roles</option>
                            <option value="founder">Founders</option>
                            <option value="talent">Talent</option>
                            <option value="student">Students</option>
                            <option value="admin">Admins</option>
                        </select>

                        <select
                            value={statusFilter || ''}
                            onChange={(e) => setStatusFilter(e.target.value || null)}
                            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                        >
                            <option value="">All Status</option>
                            <option value="verified">Verified</option>
                            <option value="suspended">Suspended</option>
                            <option value="incomplete">Incomplete Profile</option>
                        </select>
                    </div>
                </div>

                {/* Results Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {paginatedUsers.length} of {filteredUsers.length} users</span>
                    <span>Page {page} of {totalPages || 1}</span>
                </div>

                {/* User Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Joined</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {paginatedUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                                                    {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{user.name || 'No name'}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${roleColors[user.role]}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.isSuspended ? (
                                                    <span className="flex items-center gap-1 text-red-600">
                                                        <NoSymbolIcon className="w-4 h-4" />
                                                        Suspended
                                                    </span>
                                                ) : user.isVerified ? (
                                                    <span className="flex items-center gap-1 text-green-600">
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-yellow-600">
                                                        <ExclamationTriangleIcon className="w-4 h-4" />
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                                    <EyeIcon className="w-4 h-4 text-gray-500" />
                                                </button>
                                                {!user.isVerified && (
                                                    <button
                                                        onClick={() => openActionModal(user, 'verify')}
                                                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                                                    >
                                                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                                    </button>
                                                )}
                                                {!user.isSuspended ? (
                                                    <button
                                                        onClick={() => openActionModal(user, 'suspend')}
                                                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                                                    >
                                                        <NoSymbolIcon className="w-4 h-4 text-yellow-500" />
                                                    </button>
                                                ) : null}
                                                <button
                                                    onClick={() => openActionModal(user, 'delete')}
                                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <TrashIcon className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                            Previous
                        </button>
                        <span className="text-sm text-gray-500">
                            Page {page} of {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
                        >
                            Next
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Action Modal */}
                <AnimatePresence>
                    {showActionModal && selectedUser && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                            onClick={() => setShowActionModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    {actionType === 'suspend' && 'Suspend User'}
                                    {actionType === 'delete' && 'Delete User'}
                                    {actionType === 'verify' && 'Verify User'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Are you sure you want to {actionType} <strong>{selectedUser.email}</strong>?
                                    {actionType === 'delete' && ' This action cannot be undone.'}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowActionModal(false)}
                                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAction}
                                        className={`flex-1 px-4 py-3 rounded-xl font-bold text-white ${actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                                                actionType === 'suspend' ? 'bg-yellow-600 hover:bg-yellow-700' :
                                                    'bg-green-600 hover:bg-green-700'
                                            }`}
                                    >
                                        Confirm
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

export default UserManagement;
