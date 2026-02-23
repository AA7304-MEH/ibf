import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, PuzzlePieceIcon, UserIcon, ArrowTopRightOnSquareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line, Text, PerspectiveCamera, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

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
        position: { top: '0', left: '0' } // Positions will be 3D [x, y, z] in the component
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
        position: { top: '0', left: '0' }
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
        position: { top: '0', left: '0' }
    }
];

// --- 3D Components ---

const TalentNode = ({
    candidate,
    position,
    isSelected,
    onClick
}: {
    candidate: Candidate,
    position: [number, number, number],
    isSelected: boolean,
    onClick: () => void
}) => {
    return (
        <group position={position}>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sphere args={[0.6, 32, 32]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
                    <meshStandardMaterial
                        color={isSelected ? "#4f46e5" : "#cbd5e1"}
                        emissive={isSelected ? "#4f46e5" : "#000000"}
                        emissiveIntensity={0.5}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </Sphere>
            </Float>
            <Text
                position={[0, 1.2, 0]}
                fontSize={0.25}
                color={isSelected ? "#4f46e5" : "#64748b"}
                font="/fonts/Inter-Bold.woff" // Assuming font exists or fallback
                anchorX="center"
                anchorY="middle"
            >
                {candidate.name.split(' ')[0]}
            </Text>
            <Text
                position={[0, -1.2, 0]}
                fontSize={0.15}
                color="#94a3b8"
                anchorX="center"
                anchorY="middle"
            >
                {candidate.matchScore}%
            </Text>
        </group>
    );
};

const NeuralTalentMatch: React.FC = () => {
    const [selectedCandId, setSelectedCandId] = useState<string>('liam');
    const [invitedIds, setInvitedIds] = useState<string[]>([]);

    const selectedCand = candidates.find(c => c.id === selectedCandId) || candidates[0];

    const handleInvite = () => {
        if (!invitedIds.includes(selectedCand.id)) {
            setInvitedIds([...invitedIds, selectedCand.id]);
        }
    };

    // 3D Positions for candidates
    const positions = React.useMemo<Record<string, [number, number, number]>>(() => ({
        liam: [0, -3, 0],
        alex: [-4, 2, -2],
        sarah: [4, 2, -2]
    }), []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
            <header className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Neural Talent Matching</h1>
                    <p className="text-slate-500">AI-driven compatibility scoring based on cognitive architecture.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Neural Web Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 3D Graph Visualization */}
                <div className="lg:col-span-2 bg-slate-900 rounded-3xl shadow-2xl h-[600px] relative overflow-hidden">
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                        <OrbitControls enablePan={false} maxDistance={15} minDistance={5} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <Environment preset="city" />

                        {/* Central Node */}
                        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                            <Sphere args={[0.8, 32, 32]} onClick={() => setSelectedCandId('')}>
                                <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.2} roughness={0} metalness={1} />
                            </Sphere>
                            <Text position={[0, 1.5, 0]} fontSize={0.3} color="white" font="/fonts/Inter-Bold.woff">YOU</Text>
                        </Float>

                        {/* Candidate Nodes */}
                        {candidates.map((cand) => (
                            <React.Fragment key={cand.id}>
                                <TalentNode
                                    candidate={cand}
                                    position={positions[cand.id]}
                                    isSelected={selectedCandId === cand.id}
                                    onClick={() => setSelectedCandId(cand.id)}
                                />
                                {/* Neural Connection Line */}
                                <Line
                                    points={[[0, 0, 0], positions[cand.id]]}
                                    color={selectedCandId === cand.id ? "#4f46e5" : "#334155"}
                                    lineWidth={selectedCandId === cand.id ? 2 : 1}
                                    transparent
                                    opacity={selectedCandId === cand.id ? 0.8 : 0.3}
                                />
                            </React.Fragment>
                        ))}

                        <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
                    </Canvas>

                    <div className="absolute bottom-6 left-6 text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] pointer-events-none">
                        Spatial Engine: Three.js • Interaction: Orbit
                    </div>
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
