import React from 'react';
import { CodeBracketIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const MentorDashboard: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mentor Workspace</h1>
                <p className="text-gray-500">Welcome back, Senior Engineer. You have 3 pending reviews.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Reviews */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">Pending Code Reviews</h2>

                    {/* Review Card 1 */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                                <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-4">
                                    <CodeBracketIcon className="w-6 h-6" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-gray-900">E-Commerce API</h3>
                                    <p className="text-sm text-gray-500">Submitted by Ashwin M. • 2 hours ago</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">Needs Review</span>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm">
                            "Refactored the authentication middleware to use JWT. Please check for security vulnerabilities."
                        </p>
                        <div className="flex space-x-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Node.js</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Express</span>
                        </div>
                    </div>

                    {/* Review Card 2 */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                                <span className="bg-purple-100 text-purple-700 p-2 rounded-lg mr-4">
                                    <CodeBracketIcon className="w-6 h-6" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-gray-900">Climate Data Viz</h3>
                                    <p className="text-sm text-gray-500">Submitted by Sarah J. • 5 hours ago</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">Needs Review</span>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm">
                            "Implemented D3.js chart for temperature anomalies. Need help optimizing re-renders."
                        </p>
                        <div className="flex space-x-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">React</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">D3.js</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-indigo-900 text-white p-6 rounded-xl">
                        <h3 className="font-bold text-lg mb-4">Impact Score</h3>
                        <div className="text-4xl font-bold mb-1">1,450</div>
                        <p className="text-indigo-200 text-sm">Points earned this month</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4">Activity Log</h3>
                        <div className="space-y-4">
                            <div className="flex items-center text-sm">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                                <span className="text-gray-600">Approved <strong>Portfolio V1</strong></span>
                            </div>
                            <div className="flex items-center text-sm">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                                <span className="text-gray-600">Merged PR #42 for <strong>Ashwin</strong></span>
                            </div>
                            <div className="flex items-center text-sm">
                                <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                                <span className="text-gray-600">Scheduled 1:1 with <strong>Liam</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorDashboard;
