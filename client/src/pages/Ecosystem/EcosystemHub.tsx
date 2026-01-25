import React from 'react';
import { motion } from 'framer-motion';
import { BuildingLibraryIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const EcosystemHub: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900">IBF Educational Ecosystem</h1>
                <p className="mt-4 text-xl text-gray-500">Connect your school, district, and family to the learning journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* School Admin Portal */}
                <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center"
                >
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BuildingLibraryIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">School Admin Portal</h3>
                    <p className="text-gray-500 mb-6">Manage curriculum, view district-wide analytics, and issue certifications.</p>
                    <button
                        onClick={() => navigate('/ecosystem/school')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 w-full"
                    >
                        Admin Login
                    </button>
                    <p className="text-xs text-gray-400 mt-4">Verified districts only</p>
                </motion.div>

                {/* Parent Portal */}
                <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center"
                >
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserGroupIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Family & Guardian</h3>
                    <p className="text-gray-500 mb-6">Track your child's wellbeing, approve projects, and view safety reports.</p>
                    <button
                        onClick={() => navigate('/parent-insight')}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 w-full"
                    >
                        Parent Login
                    </button>
                    <p className="text-xs text-gray-400 mt-4">Safe & Secure Access</p>
                </motion.div>

                {/* Mentor Network */}
                <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center"
                >
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AcademicCapIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Mentor Network</h3>
                    <p className="text-gray-500 mb-6">For industry professionals to review code and guide diverse talent.</p>
                    <button
                        onClick={() => navigate('/ecosystem/mentor')}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 w-full"
                    >
                        Mentor Login
                    </button>
                    <p className="text-xs text-gray-400 mt-4">Invitation Only</p>
                </motion.div>
            </div>

            {/* Emergency Protocol */}
            <div className="mt-20 bg-red-50 border border-red-100 rounded-2xl p-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-red-800">Use Case: Emergency Response</h3>
                    <p className="text-red-600 mt-1">
                        If you detect a safety violation or need immediate help, our Tiered Response Protocol is active.
                    </p>
                </div>
                <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 shadow-lg flex items-center animate-pulse">
                    ⚠️ Report Incident
                </button>
            </div>
        </div>
    );
};

export default EcosystemHub;
