import { motion } from 'framer-motion';
import { SparklesIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';

const NeuralTalentMatch: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Neural Talent Matching</h1>
                <p className="text-gray-500">AI-driven compatibility scoring based on cognitive architecture.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3D Graph Visualization Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 h-[600px] relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

                    {/* Central Node (User) */}
                    <div className="relative z-10 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                        YOU
                    </div>

                    {/* Connection Lines (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <motion.line
                            x1="50%" y1="50%" x2="20%" y2="30%"
                            stroke="#93C5FD" strokeWidth="2" strokeDasharray="5,5"
                            animate={{ strokeDashoffset: [0, -10] }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        />
                        <motion.line
                            x1="50%" y1="50%" x2="80%" y2="40%"
                            stroke="#93C5FD" strokeWidth="2"
                        />
                        <motion.line
                            x1="50%" y1="50%" x2="50%" y2="80%"
                            stroke="#BBF7D0" strokeWidth="4"
                        />
                    </svg>

                    {/* Match Nodes */}
                    <div className="absolute top-[30%] left-[20%] text-center">
                        <div className="w-16 h-16 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                            Alex
                        </div>
                        <div className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block">
                            85% Match
                        </div>
                    </div>

                    <div className="absolute top-[40%] right-[20%] text-center">
                        <div className="w-16 h-16 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                            Sarah
                        </div>
                        <div className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block">
                            92% Match
                        </div>
                    </div>

                    <div className="absolute bottom-[20%] left-[50%] transform -translate-x-1/2 text-center">
                        <div className="w-20 h-20 bg-green-50 border-4 border-green-400 rounded-full flex items-center justify-center text-sm font-bold shadow-md animate-bounce">
                            Liam
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2 inline-block font-bold">
                            98% SYNERGY
                        </div>
                    </div>
                </div>

                {/* Match Details */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Liam Chen</h3>
                                <p className="text-sm text-gray-500">Backend Architect • "The Systematizer"</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Cognitive Complementarity</span>
                                    <span className="font-bold text-green-600">Perfect</span>
                                </div>
                                <p className="text-xs text-gray-500">Liam's structural thinking balances your creative chaos.</p>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Value Alignment</span>
                                    <span className="font-bold text-blue-600">High</span>
                                </div>
                                <p className="text-xs text-gray-500">Both prioritize "Impact" over "Income".</p>
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-2">
                            <button className="flex-1 bg-blue-600 text-white rounded-xl py-2 font-bold hover:bg-blue-700">
                                Send Invite
                            </button>
                            <button className="px-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                                Profile
                            </button>
                        </div>
                    </div>

                    <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center mb-4">
                            <PuzzlePieceIcon className="w-6 h-6 text-indigo-300 mr-2" />
                            <h3 className="font-bold">Team Harmony Prediction</h3>
                        </div>
                        <p className="text-indigo-200 text-sm mb-4">
                            Adding <span className="text-white font-bold">Liam</span> to your current team increases predicted velocity by <span className="text-green-400 font-bold">+22%</span> but may cause friction with <span className="text-white font-bold">Sarah</span> (Design).
                        </p>
                        <div className="h-2 bg-indigo-800 rounded-full overflow-hidden">
                            <div className="w-[88%] h-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                        </div>
                        <p className="text-right text-xs text-indigo-300 mt-1">88% Success Probability</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralTalentMatch;
