import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';
import {
    BriefcaseIcon,
    SparklesIcon,
    CurrencyDollarIcon,
    ClockIcon,
    AcademicCapIcon,
    PlusIcon,
    TrashIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const skillPresets = [
    'React', 'JavaScript', 'Python', 'Data Analysis', 'UI/UX Design',
    'Marketing', 'Copywriting', 'Social Media', 'Video Editing', 'Graphic Design',
    'Node.js', 'SQL', 'Excel', 'Communication', 'Project Management'
];

const PostMicroInternship: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '2 weeks',
        category: 'Tech',
        skillsRequired: [{ name: '', level: 'beginner', weight: 5 }],
        learningOutcomes: [''],
        compensation: {
            type: 'unpaid',
            amount: 0,
            currency: 'USD'
        },
        xpReward: 500,
        milestones: [
            { title: 'Project Kickoff', description: 'Initial meeting and requirements gathering', xpReward: 50 },
            { title: 'Mid-Project Review', description: 'Check progress and provide feedback', xpReward: 100 },
            { title: 'Final Delivery', description: 'Submit final deliverables', xpReward: 150 }
        ]
    });

    const categories = ['Tech', 'Marketing', 'Design', 'Data', 'Business', 'Creative', 'Education'];
    const durations = ['1 week', '2 weeks', '3 weeks', '4 weeks'];

    const handleSkillChange = (index: number, field: string, value: any) => {
        const newSkills = [...formData.skillsRequired];
        (newSkills[index] as any)[field] = value;
        setFormData({ ...formData, skillsRequired: newSkills });
    };

    const addSkill = () => {
        setFormData({
            ...formData,
            skillsRequired: [...formData.skillsRequired, { name: '', level: 'beginner', weight: 5 }]
        });
    };

    const removeSkill = (index: number) => {
        if (formData.skillsRequired.length > 1) {
            setFormData({
                ...formData,
                skillsRequired: formData.skillsRequired.filter((_, i) => i !== index)
            });
        }
    };

    const addMilestone = () => {
        setFormData({
            ...formData,
            milestones: [...formData.milestones, { title: '', description: '', xpReward: 50 }]
        });
    };

    const removeMilestone = (index: number) => {
        if (formData.milestones.length > 1) {
            setFormData({
                ...formData,
                milestones: formData.milestones.filter((_, i) => i !== index)
            });
        }
    };

    const updateMilestone = (index: number, field: string, value: any) => {
        const newMilestones = [...formData.milestones];
        (newMilestones[index] as any)[field] = value;
        setFormData({ ...formData, milestones: newMilestones });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/internships', formData);
            alert('🎉 Internship Posted Successfully! +100 XP');
            navigate('/internships/manage');
        } catch (error) {
            console.error('Failed to post internship', error);
            alert('Failed to post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const totalXP = formData.milestones.reduce((acc, m) => acc + m.xpReward, 0) + formData.xpReward;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden mb-8"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <BriefcaseIcon className="w-12 h-12" />
                    <div>
                        <h1 className="text-3xl font-bold">Post a Micro-Internship</h1>
                        <p className="text-white/80">Create an opportunity for talented teens to learn and grow</p>
                    </div>
                </div>
            </motion.div>

            {/* Progress Steps */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-between">
                    {['Basic Info', 'Skills & Requirements', 'Milestones & XP'].map((label, idx) => (
                        <div key={idx} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step > idx + 1 ? 'bg-green-500 text-white' :
                                    step === idx + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {step > idx + 1 ? <CheckCircleIcon className="w-6 h-6" /> : idx + 1}
                            </div>
                            <span className={`ml-2 text-sm font-medium ${step >= idx + 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                {label}
                            </span>
                            {idx < 2 && <div className={`w-16 md:w-32 h-1 mx-4 ${step > idx + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Build a Responsive Landing Page"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the project scope, goals, and what the intern will learn..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <ClockIcon className="w-4 h-4 inline mr-1" /> Duration
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    >
                                        {durations.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                        </motion.div>
                    )}

                    {/* Step 2: Skills */}
                    {step === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <AcademicCapIcon className="w-4 h-4 inline mr-1" /> Required Skills
                                    </label>
                                    <button type="button" onClick={addSkill} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm font-medium">
                                        <PlusIcon className="w-4 h-4" /> Add Skill
                                    </button>
                                </div>

                                {/* Quick Add */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {skillPresets.slice(0, 10).map((skill) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => {
                                                if (!formData.skillsRequired.some(s => s.name === skill)) {
                                                    setFormData({
                                                        ...formData,
                                                        skillsRequired: [...formData.skillsRequired, { name: skill, level: 'beginner', weight: 5 }]
                                                    });
                                                }
                                            }}
                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300 rounded-full text-sm transition-colors"
                                        >
                                            + {skill}
                                        </button>
                                    ))}
                                </div>

                                {formData.skillsRequired.map((skill, idx) => (
                                    <div key={idx} className="flex gap-4 items-center mb-3">
                                        <input
                                            type="text"
                                            placeholder="Skill Name"
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                                            value={skill.name}
                                            onChange={e => handleSkillChange(idx, 'name', e.target.value)}
                                        />
                                        <select
                                            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                                            value={skill.level}
                                            onChange={e => handleSkillChange(idx, 'level', e.target.value)}
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(idx)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Milestones */}
                    {step === 3 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Project Milestones
                                    </label>
                                    <button type="button" onClick={addMilestone} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm font-medium">
                                        <PlusIcon className="w-4 h-4" /> Add Milestone
                                    </button>
                                </div>

                                {formData.milestones.map((milestone, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mb-4">
                                        <div className="flex gap-4 items-start">
                                            <div className="flex-1 space-y-3">
                                                <input
                                                    type="text"
                                                    placeholder="Milestone Title"
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                                                    value={milestone.title}
                                                    onChange={e => updateMilestone(idx, 'title', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Brief description"
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                                                    value={milestone.description}
                                                    onChange={e => updateMilestone(idx, 'description', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                                                    value={milestone.xpReward}
                                                    onChange={e => updateMilestone(idx, 'xpReward', parseInt(e.target.value) || 0)}
                                                />
                                                <span className="text-amber-600 font-medium">XP</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeMilestone(idx)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* XP Summary */}
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <SparklesIcon className="w-8 h-8" />
                                        <div>
                                            <p className="text-sm text-white/80">Total XP Reward</p>
                                            <p className="text-3xl font-bold">{totalXP} XP</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-white/80">Completion Bonus</p>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-24 px-3 py-2 rounded-lg bg-white/20 border-0 text-white text-right font-bold"
                                            value={formData.xpReward}
                                            onChange={e => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Previous
                            </button>
                        ) : <div />}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? 'Posting...' : '🚀 Post Internship'}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostMicroInternship;
