import React from 'react';
import { motion } from 'framer-motion';
import { CubeTransparentIcon, GlobeAltIcon, CurrencyDollarIcon, QrCodeIcon } from '@heroicons/react/24/outline';

const Web3Wallet: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Immutable Skill Ledger</h1>
                    <p className="text-gray-500">Your decentralized talent identity on the SkillChain.</p>
                </div>
                <div className="bg-indigo-900 text-white px-6 py-3 rounded-xl flex items-center shadow-lg">
                    <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold">⚡</span>
                    </div>
                    <div>
                        <p className="text-xs text-indigo-300 uppercase font-bold">Wallet Balance</p>
                        <p className="font-mono font-bold text-xl">1,450 $LEARN</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Identity Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <QrCodeIcon className="w-32 h-32" />
                        </div>
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">SkillID Soulbound Token</h2>

                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl border-2 border-white">
                                👨‍💻
                            </div>
                            <div className="ml-4">
                                <h3 className="text-xl font-bold">Ashwin M.</h3>
                                <p className="text-xs text-gray-400 font-mono">0x71C...9A23</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <p className="text-xs text-gray-400">Reputation Score</p>
                                <p className="text-lg font-bold text-green-400">98/100 (Trusted)</p>
                            </div>
                            <div className="bg-white/10 p-3 rounded-lg">
                                <p className="text-xs text-gray-400">Impact Verified</p>
                                <p className="text-lg font-bold text-blue-400">Verified by MongoDB</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                            <CurrencyDollarIcon className="w-5 h-5 mr-2 text-indigo-600" />
                            Staking Pools
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-sm">React Mastery</p>
                                    <p className="text-xs text-gray-500">APY: 12% in SkillPoints</p>
                                </div>
                                <button className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">Unstake</button>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-sm">MentorshipDAO</p>
                                    <p className="text-xs text-gray-500">Voting Power: 25</p>
                                </div>
                                <button className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Vote</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NFT Gallery */}
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-xl font-bold text-gray-900">Accredited Skill NFTs</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NFT 1 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="h-48 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                <CubeTransparentIcon className="w-24 h-24 text-white opacity-90" />
                                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur px-2 py-0.5 rounded text-xs text-white font-bold border border-white/20">
                                    RARE
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg">Full Stack Architect</h3>
                                <p className="text-sm text-gray-500 mb-4">Issued by SkillBridge Academy • Jan 2026</p>
                                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                    <span className="text-xs font-mono text-gray-400">Token ID: #8821</span>
                                    <a href="#" className="text-blue-600 text-sm font-medium hover:underline">View on Chain ↗</a>
                                </div>
                            </div>
                        </motion.div>

                        {/* NFT 2 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                <GlobeAltIcon className="w-24 h-24 text-white opacity-90" />
                                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur px-2 py-0.5 rounded text-xs text-white font-bold border border-white/20">
                                    EPIC
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg">Global Impact: Climate</h3>
                                <p className="text-sm text-gray-500 mb-4">Verified by UN SDG Goal 13 • Dec 2025</p>
                                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                    <span className="text-xs font-mono text-gray-400">Token ID: #4492</span>
                                    <a href="#" className="text-blue-600 text-sm font-medium hover:underline">View on Chain ↗</a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Web3Wallet;
