import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';

const ProjectWarRoom: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-8 font-mono">
            <header className="mb-8 flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse" />
                    <h1 className="text-xl font-bold">WAR ROOM: Alpha Protocol / Sprint 4</h1>
                </div>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-800 flex items-center justify-center text-xs">
                            U{i}
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-xs text-gray-400">
                        +2
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-140px)]">
                {/* Visual Code Architecture (Left) */}
                <div className="lg:col-span-3 bg-black rounded-xl border border-gray-800 relative overflow-hidden group">
                    <div className="absolute top-4 left-4 z-10 bg-gray-900/80 px-3 py-1 rounded text-xs text-green-400 border border-green-900">
                        Live Code Spatializer
                    </div>

                    {/* Simulated Code Blocks */}
                    <div className="absolute inset-0 p-8 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <motion.div
                                drag
                                className="absolute top-1/4 left-1/4 w-48 h-32 bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 cursor-move backdrop-blur-sm"
                            >
                                <p className="text-blue-400 text-xs font-bold mb-2">AuthService</p>
                                <div className="space-y-1">
                                    <div className="h-1 w-24 bg-blue-500/30 rounded" />
                                    <div className="h-1 w-16 bg-blue-500/30 rounded" />
                                    <div className="h-1 w-20 bg-blue-500/30 rounded" />
                                </div>
                            </motion.div>

                            <motion.div
                                drag
                                className="absolute top-1/2 left-1/2 w-48 h-32 bg-purple-900/20 border border-purple-500/50 rounded-lg p-4 cursor-move backdrop-blur-sm"
                            >
                                <p className="text-purple-400 text-xs font-bold mb-2">PaymentGateway</p>
                                <div className="space-y-1">
                                    <div className="h-1 w-24 bg-purple-500/30 rounded" />
                                    <div className="h-1 w-16 bg-purple-500/30 rounded" />
                                </div>
                            </motion.div>

                            {/* Connecting Line */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <path d="M 300 200 Q 500 300 600 400" stroke="#4B5563" strokeWidth="2" fill="none" strokeDasharray="4,4" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Simulation & Chat (Right) */}
                <div className="space-y-4 flex flex-col">
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex-1">
                        <div className="flex items-center mb-4">
                            <ClockIcon className="w-5 h-5 text-yellow-500 mr-2" />
                            <h3 className="font-bold text-sm">Decision Memory</h3>
                        </div>
                        <div className="space-y-4 overflow-y-auto h-64 pr-2">
                            <div className="border-l-2 border-green-500 pl-3">
                                <p className="text-xs text-gray-500">10:42 AM • Liam</p>
                                <p className="text-sm">Merged PR #42: Optimized database queries.</p>
                            </div>
                            <div className="border-l-2 border-blue-500 pl-3">
                                <p className="text-xs text-gray-500">11:15 AM • Sarah</p>
                                <p className="text-sm">Updated UI/UX for "Dark Mode".</p>
                            </div>
                            <div className="border-l-2 border-red-500 pl-3">
                                <p className="text-xs text-gray-500">11:30 AM • System</p>
                                <p className="text-sm">Build Failed: Dependency conflict in package.json</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 h-1/3 flex flex-col">
                        <h3 className="font-bold text-sm mb-2 text-gray-400">Team Chat</h3>
                        <div className="flex-1 bg-gray-900 rounded p-2 mb-2">
                            <p className="text-xs text-gray-500">Chat connected...</p>
                        </div>
                        <input className="bg-gray-700 rounded px-2 py-1 text-sm w-full" placeholder="Type message..." />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectWarRoom;
