import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.email?.split('@')[0]}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Role: <span className="capitalize font-semibold text-ibf-primary">{user?.role}</span>
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Projects Active</h3>
                    <p className="text-3xl font-bold text-ibf-primary">3</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Messages</h3>
                    <p className="text-3xl font-bold text-ibf-secondary">12</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Completion Rate</h3>
                    <p className="text-3xl font-bold text-ibf-accent">98%</p>
                </div>
            </div>

            {/* Role Specific Content */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recommended Actions</h2>

                {user?.role === 'founder' && (
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-ibf-primary text-white rounded-lg hover:bg-blue-600 transition-colors">Post New Project</button>
                        <button className="px-4 py-2 border border-ibf-primary text-ibf-primary rounded-lg hover:bg-blue-50 transition-colors">Review Applications</button>
                    </div>
                )}

                {user?.role === 'talent' && (
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-ibf-secondary text-white rounded-lg hover:bg-purple-600 transition-colors">Browse Projects</button>
                        <button className="px-4 py-2 border border-ibf-secondary text-ibf-secondary rounded-lg hover:bg-purple-50 transition-colors">Update Profile</button>
                    </div>
                )}

                {user?.role === 'student' && (
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-ibf-accent text-white rounded-lg hover:bg-emerald-600 transition-colors">Explore SkillSwap</button>
                    </div>
                )}

                {user?.role === 'admin' && (
                    <div className="flex gap-4">
                        <a href="/admin" className="px-4 py-2 bg-ibf-primary text-white rounded-lg hover:bg-blue-600 transition-colors">Go to Admin Panel</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
