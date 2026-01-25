import React from 'react';
import { ChartBarIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const SchoolDashboard: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <header className="mb-8 border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">District Admin Console</h1>
                        <p className="text-gray-500">Springfield High School • ID: #8821</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Download Report
                    </button>
                </div>
            </header>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 font-medium">Total Students Active</h3>
                        <UserGroupIcon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">1,245</div>
                    <div className="text-sm text-green-600 mt-1">↑ 12% from last month</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 font-medium">Projects Completed</h3>
                        <AcademicCapIcon className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">892</div>
                    <div className="text-sm text-gray-500 mt-1">Across 42 Skill Categories</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 font-medium">Avg. Competency Growth</h3>
                        <ChartBarIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">+18%</div>
                    <div className="text-sm text-gray-500 mt-1">Since baseline assessment</div>
                </div>
            </div>

            {/* Student list */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-800">Top Performing Students</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Focus Area</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Ashwin M.</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">11th</td>
                            <td className="px-6 py-4 whitespace-nowrap text-blue-600">Full Stack Dev</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">12</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">On Track</span></td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Sarah J.</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">12th</td>
                            <td className="px-6 py-4 whitespace-nowrap text-purple-600">AI/ML</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">15</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Exceeding</span></td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Michael R.</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">10th</td>
                            <td className="px-6 py-4 whitespace-nowrap text-orange-600">Robotics</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">8</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Needs Support</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchoolDashboard;
