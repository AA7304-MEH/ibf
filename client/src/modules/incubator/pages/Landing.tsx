import React from 'react';
import { Link } from 'react-router-dom';
import { RocketLaunchIcon, ArrowRightIcon, BoltIcon } from '@heroicons/react/24/outline';

const IncubatorLanding: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <RocketLaunchIcon className="w-20 h-20 text-blue-500 mx-auto mb-8" />
                <h1 className="text-5xl font-bold mb-6">IBF Incubator</h1>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    The Quantum Accelerator for the next generation of founders.
                    Simulate markets, visualize equity, and pitch to AI investors.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <BoltIcon className="w-8 h-8 text-yellow-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Startup Multiverse</h3>
                        <p className="text-gray-400">Monte Carlo simulations for 1,000+ business scenarios.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-bold mb-2">Founder Copilot</h3>
                        <p className="text-gray-400">AI-driven leadership coaching and burnout monitoring.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-xl font-bold mb-2">Holo Pitch Room</h3>
                        <p className="text-gray-400">VR-ready pitch practice with behavioral analysis.</p>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <Link to="/login" className="px-8 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition flex items-center">
                        Founder Login <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </Link>
                    <Link to="/register" className="px-8 py-3 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition">
                        Apply for Batch W26
                    </Link>
                </div>

                <div className="mt-8 text-sm text-gray-500">
                    <p>Issues viewing this page? <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-blue-400 hover:text-blue-300 underline">Clear Session</button></p>
                </div>
            </div>
        </div>
    );
};

export default IncubatorLanding;
