import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, PuzzlePieceIcon, UserIcon, ArrowTopRightOnSquareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Candidate {
    id: string;
    name: string;
    role: string;
    archetype: string;
    matchScore: number;
    synergyLevel: 'Perfect' | 'High' | 'Good' | 'Fair';
    complementarityText: string;
    alignment: 'High' | 'Medium' | 'Low';
    alignmentText: string;
    velocityImpact: number;
    frictionWarning?: string;
    color: string;
    borderColor: string;
    bgInfo: string;
    position: { top: string; left: string; right?: string; bottom?: string };
}

const candidates: Candidate[] = [
    {
        id: 'liam',
        name: 'Liam Chen',
        role: 'Backend Architect',
        archetype: '"The Systematizer"',
        matchScore: 98,
        synergyLevel: 'Perfect',
        complementarityText: "Liam's structural thinking balances your creative chaos.",
        alignment: 'High',
        alignmentText: 'Both prioritize "Impact" over "Income".',
        velocityImpact: 22,
        frictionWarning: 'Sarah (Design)',
        color: 'bg-green-100 text-green-800',
        borderColor: 'border-green-400',
        bgInfo: 'bg-green-100 text-green-600',
        position: { bottom: '20%', left: '50%' }
    },
    {
        id: 'alex',
        name: 'Alex Rivera',
        role: 'Frontend Wizard',
        archetype: '"The Artist"',
        matchScore: 85,
        synergyLevel: 'Good',
        complementarityText: "Shared visual language but potential overlap in ownership.",
        alignment: 'Medium',
        alignmentText: 'Alex values "Flexibility", you value "Structure".',
        velocityImpact: 15,
        color: 'bg-blue-100 text-blue-800',
        borderColor: 'border-blue-200',
        bgInfo: 'bg-blue-100 text-blue-600',
        position: { top: '30%', left: '20%' }
    },
    {
        id: 'sarah',
        name: 'Sarah Jenkins',
        role: 'Product Owner',
        archetype: '"The Visionary"',
        matchScore: 92,
        synergyLevel: 'High',
        complementarityText: "Strong strategic alignment, minimal execution friction.",
        alignment: 'High',
        alignmentText: 'Both aim for "Market Dominance".',
        velocityImpact: 18,
        frictionWarning: 'Alex (Frontend)',
        color: 'bg-purple-100 text-purple-800',
        borderColor: 'border-purple-200',
        bgInfo: 'bg-purple-100 text-purple-600',
        position: { top: '40%', right: '20%', left: 'auto' } // Handle right pos manually
    }
];

const NeuralTalentMatch: React.FC = () => {
    const [selectedCandId, setSelectedCandId] = useState<string>('liam');
    const [invitedIds, setInvitedIds] = useState<string[]>([]);

    const selectedCand = candidates.find(c => c.id === selectedCandId) || candidates[0];

    const handleInvite = () => {
        if (!invitedIds.includes(selectedCandId)) {
            setInvitedIds([...invitedIds, selectedCandId]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Neural Talent Matching</h1>
                <p className="text-gray-500">AI-driven compatibility scoring based on cognitive architecture.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3D Graph Visualization */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 h-[600px] relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

                    {/* Central Node (User) */}
                    <div className="relative z-10 w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 ring-4 ring-white">
                        YOU
                    </div>

                    {/* Connection Lines (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {/* Dynamic lines based on candidates could be added here, for now keeping static-ish aesthetic */}
                        <motion.line
                            x1="50%" y1="50%" x2="20%" y2="30%"
                            stroke={selectedCandId === 'alex' ? '#3B82F6' : '#E5E7EB'}
                            strokeWidth={selectedCandId === 'alex' ? "3" : "2"}
                            strokeDasharray={selectedCandId === 'alex' ? "0" : "5,5"}
                            animate={selectedCandId === 'alex' ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -10] }}
                            transition={{ duration: 1 }}
                        />
                        <motion.line
                            x1="50%" y1="50%" x2="80%" y2="40%"
                            stroke={selectedCandId === 'sarah' ? '#9333EA' : '#E5E7EB'}
                            strokeWidth={selectedCandId === 'sarah' ? "3" : "2"}
                            strokeDasharray={selectedCandId === 'sarah' ? "0" : "5,5"}
                        />
                        <motion.line
                            x1="50%" y1="50%" x2="50%" y2="80%"
                            stroke={selectedCandId === 'liam' ? '#22C55E' : '#E5E7EB'}
                            strokeWidth={selectedCandId === 'liam' ? "4" : "2"}
                        />
                    </svg>

                    {/* Match Nodes */}
                    {candidates.map((cand) => (
                        <div
                            key={cand.id}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${selectedCandId === cand.id ? 'scale-110 z-20' : 'scale-100 z-10 hover:scale-105'}`}
                            style={{
                                top: cand.position.top,
                                left: cand.position.left === 'auto' ? undefined : cand.position.left,
                                right: cand.position.right,
                                bottom: cand.position.bottom
                            }}
                            onClick={() => setSelectedCandId(cand.id)}
                        >
                            <div className={`w-20 h-20 bg-white border-4 ${cand.borderColor} rounded-full flex items-center justify-center text-sm font-bold shadow-md ${selectedCandId === cand.id ? 'shadow-xl ring-2 ring-offset-2 ring-indigo-500' : ''}`}>
                                {cand.name.split(' ')[0]}
                            </div>
                            <div className={`mt-2 text-center`}>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${cand.color}`}>
                                    {cand.matchScore}% {cand.matchScore > 90 ? 'SYNERGY' : 'Match'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Match Details */}
                <div className="space-y-6">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={selectedCand.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative"
                        >
                            <div className="flex items-center space-x-4 mb-6">
                                <div className={`w-14 h-14 ${selectedCand.bgInfo} rounded-full flex items-center justify-center`}>
                                    <SparklesIcon className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">{selectedCand.name}</h3>
                                    <p className="text-sm text-gray-500">{selectedCand.role} • {selectedCand.archetype}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 font-medium">Cognitive Complementarity</span>
                                        <span className={`font-bold ${selectedCand.synergyLevel === 'Perfect' ? 'text-green-600' : 'text-blue-600'}`}>
                                            {selectedCand.synergyLevel}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">{selectedCand.complementarityText}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 font-medium">Value Alignment</span>
                                        <span className={`font-bold ${selectedCand.alignment === 'High' ? 'text-green-600' : 'text-amber-600'}`}>
                                            {selectedCand.alignment}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">{selectedCand.alignmentText}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex space-x-3">
                                <button
                                    onClick={handleInvite}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${invitedIds.includes(selectedCand.id)
                                            ? 'bg-green-100 text-green-700 cursor-default'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    {invitedIds.includes(selectedCand.id) ? (
                                        <>
                                            <CheckCircleIcon className="w-5 h-5" />
                                            Invited
                                        </>
                                    ) : (
                                        'Send Invite'
                                    )}
                                </button>
                                <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                                    Profile
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={`harmony-${selectedCand.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>

                            <div className="relative z-10">
                                <div className="flex items-center mb-4 gap-2">
                                    <PuzzlePieceIcon className="w-6 h-6 text-indigo-300" />
                                    <h3 className="font-bold text-lg">Team Harmony Prediction</h3>
                                </div>
                                <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                                    Adding <span className="text-white font-bold">{selectedCand.name.split(' ')[0]}</span> to your team increases predicted velocity by <span className="text-green-400 font-bold">+{selectedCand.velocityImpact}%</span>.
                                    {selectedCand.frictionWarning && (
                                        <> May cause friction with <span className="text-white font-bold">{selectedCand.frictionWarning}</span>.</>
                                    )}
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium text-indigo-300">
                                        <span>Integration Probability</span>
                                        <span>{selectedCand.matchScore}%</span>
                                    </div>
                                    <div className="h-2 bg-indigo-950/50 rounded-full overflow-hidden border border-indigo-700/30">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${selectedCand.matchScore}%` }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className={`h-full bg-gradient-to-r ${selectedCand.matchScore > 90 ? 'from-indigo-400 to-green-400' : 'from-indigo-400 to-blue-400'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default NeuralTalentMatch;
