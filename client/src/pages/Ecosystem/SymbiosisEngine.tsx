import React from 'react';
import { ScaleIcon, HeartIcon, ChartPieIcon } from '@heroicons/react/24/outline';

const SymbiosisEngine: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
            <header className="mb-12">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 flex items-center">
                    <HeartIcon className="w-8 h-8 mr-3 text-pink-600" />
                    Symbiosis Engine
                </h1>
                <p className="text-gray-500 mt-2">Harmonizing Equity, Culture, and Long-term Value.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Equity Calculator */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center">
                            <ScaleIcon className="w-6 h-6 mr-2 text-indigo-600" />
                            Fair Equity Calculator
                        </h3>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">AI-Verified</span>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role Impact</label>
                                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                                    <option>Founding Engineer (High)</option>
                                    <option>Core Contributor (Med)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Risk Profile</label>
                                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                                    <option>Pre-Seed (High Risk)</option>
                                    <option>Series A (Med Risk)</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-xl text-center border border-indigo-100">
                            <p className="text-sm text-gray-500 mb-2">Recommended Equity Range</p>
                            <div className="text-3xl font-bold text-indigo-900">1.2% - 1.8%</div>
                            <p className="text-xs text-indigo-600 mt-1">4-Year Vesting • 1 Year Cliff</p>
                        </div>
                    </div>
                </div>

                {/* Culture Fit Heatmap */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center">
                            <ChartPieIcon className="w-6 h-6 mr-2 text-pink-600" />
                            Culture Compatibility
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1 font-bold">
                                <span>Speed vs. Quality</span>
                                <span className="text-gray-500">Fast Iteration</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full relative">
                                <div className="absolute top-0 left-0 h-full w-[80%] bg-pink-100 rounded-full" />
                                <div className="absolute top-0 left-[75%] w-2 h-full bg-pink-600 rounded-full shadow-lg transform scale-150" />
                                <div className="absolute top-4 left-[75%] transform -translate-x-1/2 text-xs text-pink-600 font-bold">You</div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="flex justify-between text-sm mb-1 font-bold">
                                <span>Autonomy vs. Structure</span>
                                <span className="text-gray-500">High Autonomy</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full relative">
                                <div className="absolute top-0 left-0 h-full w-[90%] bg-purple-100 rounded-full" />
                                <div className="absolute top-0 left-[85%] w-2 h-full bg-purple-600 rounded-full shadow-lg transform scale-150" />
                                <div className="absolute top-4 left-[85%] transform -translate-x-1/2 text-xs text-purple-600 font-bold">You</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-green-50 p-4 rounded-xl border border-green-100 flex items-start">
                        <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">✓</div>
                        <p className="text-sm text-green-800">
                            <span className="font-bold">Excellent Match:</span> You thrive in high-autonomy environments, which aligns perfectly with this startup's remote-first culture.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SymbiosisEngine;
