import React, { useState } from 'react';
import { ShieldCheckIcon, EyeIcon, UserGroupIcon, CloudArrowDownIcon } from '@heroicons/react/24/outline';

const PrivacySettings: React.FC = () => {
    // Privacy State
    const [settings, setSettings] = useState({
        publicProfile: true,
        showProgress: true,
        allowParentAccess: true,
        allowMentorAccess: true,
        shareAnonymizedData: false
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy & visibility</h1>
            <p className="text-gray-500 mb-8">Manage how your data is shared within the SkillBridge ecosystem.</p>

            <div className="bg-white shadow rounded-xl divide-y divide-gray-100">
                {/* Public Profile */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                            <EyeIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Public Portfolio</h3>
                            <p className="text-sm text-gray-500 max-w-lg">
                                Allow other students and founders to see your "Project Showcase" and "Portfolio".
                                If disabled, your profile will be hidden from the Leaderboard.
                            </p>
                        </div>
                    </div>
                    <Toggle checked={settings.publicProfile} onChange={() => toggle('publicProfile')} />
                </div>

                {/* Parent Access */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-lg mr-4">
                            <UserGroupIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Share with Parents</h3>
                            <p className="text-sm text-gray-500 max-w-lg">
                                Allow your linked parent account to view your Wellbeing trends and Learning Roadmap.
                            </p>
                        </div>
                    </div>
                    <Toggle checked={settings.allowParentAccess} onChange={() => toggle('allowParentAccess')} />
                </div>

                {/* Mentor Access */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-lg mr-4">
                            <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Mentor Access</h3>
                            <p className="text-sm text-gray-500 max-w-lg">
                                Allow verified mentors to view your detailed code commits and project history to provide feedback.
                            </p>
                        </div>
                    </div>
                    <Toggle checked={settings.allowMentorAccess} onChange={() => toggle('allowMentorAccess')} />
                </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-800">Your Data, Your Control</h3>
                        <p className="text-sm text-gray-500">
                            Download a copy of all your SkillBridge interactions, badges, and code metrics.
                        </p>
                    </div>
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100">
                        <CloudArrowDownIcon className="w-5 h-5 mr-2" />
                        Download PDF report
                    </button>
                </div>
            </div>
        </div>
    );
};

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`${checked ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
    >
        <span
            aria-hidden="true"
            className={`${checked ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);

export default PrivacySettings;
