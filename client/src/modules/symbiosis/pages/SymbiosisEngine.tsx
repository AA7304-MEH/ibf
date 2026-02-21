import React, { useState } from 'react';
import EquityTool from '../components/EquityTool';
import CultureMap from '../components/CultureMap';
import GrowthPredictor from '../components/GrowthPredictor';
import { CpuChipIcon, ChartBarIcon, BriefcaseIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const SymbiosisEngine: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'equity' | 'culture' | 'growth'>('equity');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg text-white">
                        <CpuChipIcon className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        Symbiosis Engine
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                    AI-powered harmonizer for equity distribution, cultural alignment, and long-term value matching.
                </p>
            </header>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-xl mb-8 max-w-md">
                <button
                    onClick={() => setActiveTab('equity')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'equity'
                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <BriefcaseIcon className="w-4 h-4" />
                    Fair Equity
                </button>
                <button
                    onClick={() => setActiveTab('culture')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'culture'
                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <UserGroupIcon className="w-4 h-4" />
                    Culture Fit
                </button>
                <button
                    onClick={() => setActiveTab('growth')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'growth'
                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <ChartBarIcon className="w-4 h-4" />
                    Value Predictor
                </button>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl">
                {activeTab === 'equity' && (
                    <div className="animate-fade-in">
                        <EquityTool />
                    </div>
                )}
                {activeTab === 'culture' && (
                    <div className="animate-fade-in">
                        <CultureMap />
                    </div>
                )}
                {activeTab === 'growth' && (
                    <div className="animate-fade-in">
                        <GrowthPredictor />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SymbiosisEngine;
