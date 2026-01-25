import React from 'react';
import { LightBulbIcon, FireIcon, HandThumbUpIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const FounderCopilot: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Founder OS: Cognitive Augmentation</h1>
                <p className="text-gray-500">Neural support for high-stakes decision making.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main AI Chat Interface */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-[600px]">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center">
                            <LightBulbIcon className="w-6 h-6 mr-2" />
                            <span className="font-bold text-lg">CEO Copilot</span>
                        </div>
                        <span className="bg-white/20 px-2 py-1 rounded text-xs">Mental State: Peak Performance</span>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50">
                        {/* AI Message */}
                        <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 flex-shrink-0">
                                🤖
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-lg">
                                <p className="text-gray-800">I've detected a high-stress pattern in your recent communications. You have a board meeting in 48 hours.</p>
                                <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <p className="text-xs font-bold text-indigo-800 uppercase mb-1">Recommendation</p>
                                    <p className="text-sm text-indigo-700">Schedule a 2-hour "Deep Work" block tomorrow morning to finalize the deck. I've drafted 3 key talking points for the "Revenue Miss" objection.</p>
                                </div>
                            </div>
                        </div>

                        {/* User Message */}
                        <div className="flex items-start justify-end">
                            <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-sm text-white max-w-lg">
                                <p>Show me the objection handlers.</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ml-4 flex-shrink-0">
                                👤
                            </div>
                        </div>

                        {/* AI Response with Tools */}
                        <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 flex-shrink-0">
                                🤖
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-lg w-full">
                                <p className="text-gray-800 mb-4">Here are 3 strategic reframes for the revenue discussion:</p>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 hover:bg-gray-50 border border-gray-200 rounded-xl transition flex items-start">
                                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">1. The "Pivot" Narrative</p>
                                            <p className="text-xs text-gray-500">Focus on the 40% growth in the new Enterprise segment.</p>
                                        </div>
                                    </button>
                                    <button className="w-full text-left p-3 hover:bg-gray-50 border border-gray-200 rounded-xl transition flex items-start">
                                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">2. The "Pipeline" Defense</p>
                                            <p className="text-xs text-gray-500">Highlight the $2M LOI signed for Q3 (Deferred Revenue).</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="bg-gray-100 rounded-full px-4 py-3 text-gray-400 text-sm">
                            Type a command or ask for advice...
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    {/* Burnout Meter */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Cognitive Load</h3>
                            <FireIcon className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full w-[75%] bg-gradient-to-r from-green-400 to-orange-500" />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>Fresh</span>
                            <span className="font-bold text-orange-600">Caution (75%)</span>
                            <span>Burnout</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 italic">"You've been in meetings for 6 hours today. Suggest cancelling the 4 PM sync."</p>
                    </div>

                    {/* Skill Calibration */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Leadership DNA</h3>
                            <HandThumbUpIcon className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Strategic Vision</span>
                                    <span className="font-bold">92/100</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full"><div className="w-[92%] h-full bg-blue-600 rounded-full" /></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Operational Discipline</span>
                                    <span className="font-bold">65/100</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full"><div className="w-[65%] h-full bg-yellow-500 rounded-full" /></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Empathy</span>
                                    <span className="font-bold">88/100</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full"><div className="w-[88%] h-full bg-purple-600 rounded-full" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FounderCopilot;
