import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BriefcaseIcon,
    CurrencyDollarIcon,
    ClockIcon,
    CodeBracketIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

const PostProject: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skillsRequired: '',
        duration: '',
        budgetMin: '',
        budgetMax: '',
        experienceLevel: 'intermediate',
        platform: 'web'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Convert skills string to array
        const skillsArray = formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s);

        const payload = {
            title: formData.title,
            description: formData.description,
            skillsRequired: skillsArray,
            duration: formData.duration,
            collabDetails: {
                platform: formData.platform,
                experienceLevel: formData.experienceLevel,
                paymentType: 'fixed',
                budgetRange: {
                    min: Number(formData.budgetMin) || 0,
                    max: Number(formData.budgetMax) || 0
                }
            }
        };

        try {
            // In a real app, use auth token header
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/collab/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                navigate('/collab/projects');
            } else {
                const err = await res.json();
                alert('Failed: ' + (err.message || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Error posting project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <BriefcaseIcon className="w-8 h-8 text-purple-600" />
                        Post a New Project
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Find the perfect talent for your next big idea.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="p-8 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                placeholder="e.g. Redesign Mobile App UI"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea
                                required
                                rows={5}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                placeholder="Describe your project, goals, and requirements..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Two Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Required Skills</label>
                                <div className="relative">
                                    <CodeBracketIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="React, Figma, Node.js"
                                        value={formData.skillsRequired}
                                        onChange={e => setFormData({ ...formData, skillsRequired: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Comma separated</p>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                                <div className="relative">
                                    <ClockIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="e.g. 2 weeks, 1 month"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Budget & Type */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Budget ($)</label>
                                <div className="relative">
                                    <CurrencyDollarIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="500"
                                        value={formData.budgetMin}
                                        onChange={e => setFormData({ ...formData, budgetMin: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Budget ($)</label>
                                <div className="relative">
                                    <CurrencyDollarIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                                        placeholder="2000"
                                        value={formData.budgetMax}
                                        onChange={e => setFormData({ ...formData, budgetMax: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                                    value={formData.platform}
                                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                >
                                    <option value="web">Web Development</option>
                                    <option value="mobile">Mobile App</option>
                                    <option value="design">Design / Creative</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-6 flex justify-end items-center gap-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => navigate('/collab/projects')}
                            className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Posting...' : 'Post Project'}
                            {!loading && <ArrowRightIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostProject;
