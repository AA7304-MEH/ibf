import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockClosedIcon, CheckCircleIcon, PlayCircleIcon } from '@heroicons/react/24/solid';

// Mock Data for Roadmap
const LEARNING_PATH = {
    title: "Full Stack Web Developer Path",
    progress: 35,
    milestones: [
        { id: 1, title: "HTML & Semantic Markup", type: "skill", status: "completed", x: 50, y: 50 },
        { id: 2, title: "Modern CSS & Flexbox", type: "skill", status: "completed", x: 150, y: 50 },
        { id: 3, title: "JavaScript Basics", type: "skill", status: "in-progress", x: 250, y: 50 },
        { id: 4, title: "DOM Manipulation Project", type: "project", status: "locked", x: 250, y: 150 },
        { id: 5, title: "React Fundamentals", type: "skill", status: "locked", x: 350, y: 150 },
        { id: 6, title: "Backend API Integration", type: "skill", status: "locked", x: 450, y: 150 },
        { id: 7, title: "Capstone: Startup Landing Page", type: "project", status: "locked", x: 450, y: 50 }
    ]
};

const LearningRoadmap: React.FC = () => {
    const [selectedNode, setSelectedNode] = useState<any>(null);

    return (
        <div className="bg-gray-900 text-white rounded-xl p-6 shadow-xl border border-gray-700 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {LEARNING_PATH.title}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {LEARNING_PATH.progress}% Complete
                    </p>
                </div>
                <div className="px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold uppercase">
                    Level 3: Builder
                </div>
            </div>

            {/* Interactive Graph Container */}
            <div className="flex-1 relative bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50">
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {LEARNING_PATH.milestones.map((node, i) => {
                        if (i === 0) return null;
                        const prev = LEARNING_PATH.milestones[i - 1];
                        return (
                            <line
                                key={`link-${i}`}
                                x1={prev.x} y1={prev.y}
                                x2={node.x} y2={node.y}
                                stroke={node.status === 'locked' ? '#374151' : (node.status === 'completed' ? '#10B981' : '#60A5FA')}
                                strokeWidth="4"
                                strokeDasharray={node.status === 'locked' ? "5,5" : "0"}
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                {LEARNING_PATH.milestones.map((node) => (
                    <motion.div
                        key={node.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center transform -translate-x-6 -translate-y-6 cursor-pointer border-2 shadow-lg transition-colors
                            ${node.status === 'completed' ? 'bg-green-600 border-green-400' :
                                node.status === 'in-progress' ? 'bg-blue-600 border-blue-400 shadow-blue-500/50' :
                                    'bg-gray-700 border-gray-600'
                            }
                        `}
                        style={{ left: node.x, top: node.y }}
                        onClick={() => setSelectedNode(node)}
                        whileHover={{ scale: 1.1 }}
                    >
                        {node.status === 'completed' && <CheckCircleIcon className="w-6 h-6 text-white" />}
                        {node.status === 'in-progress' && <PlayCircleIcon className="w-6 h-6 text-white animate-pulse" />}
                        {node.status === 'locked' && <LockClosedIcon className="w-5 h-5 text-gray-400" />}
                    </motion.div>
                ))}

                {/* Selected Node Details Overlay */}
                <AnimatePresence>
                    {selectedNode && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 left-4 right-4 bg-gray-800 p-4 rounded-xl border border-gray-600 shadow-2xl"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-white">{selectedNode.title}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold mt-1 inline-block
                                        ${selectedNode.status === 'completed' ? 'bg-green-900 text-green-300' :
                                            selectedNode.status === 'in-progress' ? 'bg-blue-900 text-blue-300' :
                                                'bg-gray-700 text-gray-400'
                                        }
                                    `}>
                                        {selectedNode.status}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedNode(null)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm mt-2">
                                {selectedNode.type === 'project' ?
                                    'Complete this project to unlock the next skill tier.' :
                                    'Master the fundamentals through curated resources.'
                                }
                            </p>
                            {selectedNode.status !== 'locked' && (
                                <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors">
                                    {selectedNode.status === 'completed' ? 'Review Material' : 'Continue Learning'}
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LearningRoadmap;
