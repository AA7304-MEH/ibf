import React from 'react';
import { FingerPrintIcon, PuzzlePieceIcon, SparklesIcon } from '@heroicons/react/24/outline';

const WorkDNA: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 p-8 font-sans">
            <header className="mb-12 border-b border-gray-100 pb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <FingerPrintIcon className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Neural Work DNA
                    </h1>
                </div>
                <p className="text-gray-500 max-w-2xl">
                    Our AI analyzes your problem-solving archetypes, communication cadence, and stress response mechanisms to match you with teams where you don't just fit—you thrive.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Visual DNA Profile */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

                        <div className="text-center mb-8">
                            <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center mb-4 border-4 border-blue-50">
                                <SparklesIcon className="w-12 h-12 text-blue-500" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">The "Systemic Architect"</h2>
                            <p className="text-sm text-gray-500 mt-1">Rare Profile (Top 4%)</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                                    <span>Abstract Thinking</span>
                                    <span>High</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full"><div className="w-[92%] h-full bg-blue-600 rounded-full" /></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                                    <span>Social Cadence</span>
                                    <span>Async</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full"><div className="w-[40%] h-full bg-purple-600 rounded-full" /></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                                    <span>Crisis Stability</span>
                                    <span>Stoic</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full"><div className="w-[85%] h-full bg-green-600 rounded-full" /></div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Ideal Ecosystem Symbiosis</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-center"><PuzzlePieceIcon className="w-4 h-4 mr-2 text-blue-500" /> FinTech Infrastructure</li>
                                <li className="flex items-center"><PuzzlePieceIcon className="w-4 h-4 mr-2 text-blue-500" /> DeepTech Research</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Assessment / Matches */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex space-x-6 border-b border-gray-100 pb-1">
                        <button className="pb-4 border-b-2 border-blue-600 font-bold text-blue-600">Active Matches (3)</button>
                        <button className="pb-4 border-b-2 border-transparent text-gray-400 hover:text-gray-600">Raw Data</button>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-indigo-900 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                                    N
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">Nebula Protocol</h3>
                                    <p className="text-sm text-gray-500">Decentralized Storage • Series A</p>

                                    <div className="flex mt-3 space-x-2">
                                        <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold">98% Neuro-Fit</span>
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Async-First</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">$120k - $160k</p>
                                <p className="text-xs text-gray-500 text-green-600 font-bold">+ 0.5% Equity</p>
                            </div>
                        </div>
                        <div className="mt-4 bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex items-start">
                            <SparklesIcon className="w-5 h-5 mr-2 mt-0.5" />
                            "Your high Abstract Thinking score perfectly complements their pragmatic CTO. Predicted friction: &lt; 5%."
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer group opacity-75">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                                    E
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition">EcoStream</h3>
                                    <p className="text-sm text-gray-500">Climate Tech • Seed</p>

                                    <div className="flex mt-3 space-x-2">
                                        <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold">82% Neuro-Fit</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkDNA;
