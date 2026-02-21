import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, LockClosedIcon, PlayCircleIcon, MapIcon, BoltIcon } from '@heroicons/react/24/solid';
import api from '../../../../services/api';

const LearningRoadmap: React.FC = () => {
    const [path, setPath] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchPath();
    }, []);

    const fetchPath = async () => {
        try {
            const res = await api.get('/learning-path/current');
            setPath(res.data);
        } catch (error) {
            // No path found?
            console.log('No active path found');
        } finally {
            setLoading(false);
        }
    };

    const generatePath = async (goal: string) => {
        setGenerating(true);
        try {
            const res = await api.post('/learning-path/generate', { goal });
            setPath(res.data);
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || 'Failed to generate path';
            alert(`Error: ${msg}`);
        } finally {
            setGenerating(false);
        }
    };

    const completeMilestone = async (milestoneId: string) => {
        try {
            const res = await api.put(`/learning-path/${path._id}/milestone`, {
                milestoneId,
                status: 'completed'
            });
            setPath(res.data);
            // Confetti or Sound effect here
            alert('Milestone Complete! +XP');
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your journey...</div>;

    if (!path) {
        return (
            <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <MapIcon className="w-20 h-20 text-indigo-200 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Start Your Learning Journey</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    Our AI will analyze your SkillDNA and general goals to create a personalized curriculum just for you.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                    <button
                        onClick={() => generatePath('Full Stack Developer')}
                        disabled={generating}
                        className="p-4 border border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl transition-all text-left group"
                    >
                        <span className="block font-bold text-indigo-900 group-hover:text-indigo-700">Full Stack Developer</span>
                        <span className="text-sm text-indigo-500">React, Node.js, MongoDB</span>
                    </button>
                    <button
                        onClick={() => generatePath('AI Engineer')}
                        disabled={generating}
                        className="p-4 border border-purple-100 hover:border-purple-500 hover:bg-purple-50 rounded-xl transition-all text-left group"
                    >
                        <span className="block font-bold text-purple-900 group-hover:text-purple-700">AI Engineer</span>
                        <span className="text-sm text-purple-500">Python, PyTorch, Data Science</span>
                    </button>
                </div>
                {generating && <p className="mt-4 text-indigo-600 animate-pulse">Generating your custom roadmap...</p>}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <header className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MapIcon className="w-6 h-6 text-indigo-600" />
                        {path.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{path.description || 'Your personalized path to mastery.'}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Progress</p>
                    <p className="text-3xl font-bold text-indigo-600">{path.progress}%</p>
                </div>
            </header>

            <div className="relative space-y-8 pl-8 md:pl-0">
                {/* Vertical Line */}
                <div className="absolute left-10 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block md:left-1/2 transform md:-translate-x-1/2" />

                {path.milestones.map((milestone: any, idx: number) => {
                    const isLeft = idx % 2 === 0;
                    const isLocked = milestone.status === 'locked';
                    const isCompleted = milestone.status === 'completed';

                    return (
                        <div key={milestone.id} className={`relative flex items-center justify-between md:justify-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                            {/* Content Card */}
                            <motion.div
                                initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`w-full md:w-5/12 ${isLeft ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'} mb-8 md:mb-0`}
                            >
                                <div className={`p-5 rounded-xl border-2 transition-all ${isCompleted
                                    ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900'
                                    : isLocked
                                        ? 'bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700 opacity-70'
                                        : 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-50 dark:bg-gray-800'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-2 justify-between">
                                        <span className={`text-xs font-bold uppercase py-0.5 px-2 rounded ${milestone.type === 'project' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {milestone.type}
                                        </span>
                                        {milestone.skillReward && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                                                <BoltIcon className="w-3 h-3" />
                                                +{milestone.skillReward.points} XP
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{milestone.title}</h3>

                                    {!isLocked && !isCompleted && (
                                        <div className="space-y-3">
                                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                                {milestone.resources.map((r: any, i: number) => (
                                                    <a key={i} href={r.url} target="_blank" rel="noreferrer" className="block hover:text-indigo-600 underline decoration-indigo-200">
                                                        📖 {r.title}
                                                    </a>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => completeMilestone(milestone.id)}
                                                className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                            >
                                                Mark as Complete
                                            </button>
                                        </div>
                                    )}

                                    {isCompleted && <p className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircleIcon className="w-4 h-4" /> Completed</p>}
                                    {isLocked && <p className="text-gray-400 text-sm flex items-center gap-1"><LockClosedIcon className="w-4 h-4" /> Locked</p>}
                                </div>
                            </motion.div>

                            {/* Center Node */}
                            <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                                <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center bg-white dark:bg-gray-900 ${isCompleted
                                    ? 'border-green-500 text-green-500'
                                    : isLocked
                                        ? 'border-gray-300 text-gray-300 dark:border-gray-600'
                                        : 'border-indigo-500 text-indigo-500 shadow-lg scale-110'
                                    }`}>
                                    {isCompleted ? <CheckCircleIcon className="w-5 h-5" /> : isLocked ? <LockClosedIcon className="w-4 h-4" /> : <PlayCircleIcon className="w-5 h-5" />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LearningRoadmap;
