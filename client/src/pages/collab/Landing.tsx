import React from 'react';
import { Link } from 'react-router-dom';
import { UserGroupIcon, ArrowRightIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';

const CollabLanding: React.FC = () => {
    return (
        <div className="min-h-screen bg-indigo-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <UserGroupIcon className="w-20 h-20 text-purple-400 mx-auto mb-8" />
                <h1 className="text-5xl font-bold mb-6">IBF Collab Net</h1>
                <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
                    The Neural Network for elite talent.
                    Match with startups based on cognitive architecture and Work DNA.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
                    <div className="bg-indigo-800 p-6 rounded-xl border border-indigo-700">
                        <PuzzlePieceIcon className="w-8 h-8 text-pink-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Neural Matching</h3>
                        <p className="text-indigo-200">3D compatibility graph based on 50+ cognitive traits.</p>
                    </div>
                    <div className="bg-indigo-800 p-6 rounded-xl border border-indigo-700">
                        <h3 className="text-xl font-bold mb-2">Project War Room</h3>
                        <p className="text-indigo-200">Deep-work collaboration spaces with decision memory.</p>
                    </div>
                    <div className="bg-indigo-800 p-6 rounded-xl border border-indigo-700">
                        <h3 className="text-xl font-bold mb-2">Skill Evolution</h3>
                        <p className="text-indigo-200">Predictive growth trajectories and NFT certification.</p>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <Link to="/login" className="px-8 py-3 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition flex items-center">
                        Talent Login <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </Link>
                    <Link to="/register" className="px-8 py-3 bg-indigo-800 border border-indigo-600 rounded-lg hover:bg-indigo-700 transition">
                        Join the Network
                    </Link>
                </div>

                <div className="mt-8 text-sm text-indigo-300">
                    <p>Issues viewing this page? <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-purple-300 hover:text-purple-200 underline">Clear Session</button></p>
                </div>
            </div>
        </div>
    );
};

export default CollabLanding;
