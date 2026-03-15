import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, DocumentTextIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const AdminTasks: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        module: 'skillswap',
        title: '',
        description: '',
        instructions: '',
        type: 'captcha',
        reward: 100, // in paise
        totalQuantity: 100,
        verificationType: 'auto',
        correctAnswer: ''
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/marketplace/admin/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/marketplace/admin/tasks', formData);
            setShowCreateModal(false);
            fetchTasks();
        } catch (error) {
            console.error('Error creating task', error);
            alert('Error creating task');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-navy py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <DocumentTextIcon className="w-8 h-8 text-teal" />
                            Task Management
                        </h1>
                        <p className="text-gray-500 dark:text-muted mt-1">
                            Create and manage micro-tasks for the marketplace
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-teal flex items-center gap-2 px-4 py-2"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Create New Task
                    </button>
                </header>

                {/* Task List */}
                <div className="bg-white dark:bg-navy-card rounded-2xl shadow-lg border border-gray-100 dark:border-navy-border overflow-hidden">
                    <div className="overflow-x-auto p-6">
                        {loading ? (
                            <p className="text-muted">Loading tasks...</p>
                        ) : tasks.length === 0 ? (
                            <p className="text-muted text-center py-8">No tasks found. Create one to get started.</p>
                        ) : (
                            <table className="w-full text-left text-sm text-gray-500 dark:text-muted">
                                <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 rounded-tl-lg">Title</th>
                                        <th className="px-6 py-4">Module</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Reward (INR)</th>
                                        <th className="px-6 py-4">Available</th>
                                        <th className="px-6 py-4 rounded-tr-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task: any) => (
                                        <tr key={task._id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{task.title}</td>
                                            <td className="px-6 py-4 uppercase text-xs font-bold text-teal">{task.module}</td>
                                            <td className="px-6 py-4 capitalize">{task.type.replace('_', ' ')}</td>
                                            <td className="px-6 py-4">₹{(task.reward / 100).toFixed(2)}</td>
                                            <td className="px-6 py-4">{task.remainingQuantity} / {task.totalQuantity}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                                                    task.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                                    'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/60'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Create Task Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-navy-card rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-navy-border w-full max-w-2xl max-h-[90vh] overflow-y-auto landing-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold dark:text-white">Create Micro-Task</h2>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-muted dark:hover:text-white">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 dark:text-white">Module</label>
                                        <select 
                                            value={formData.module} 
                                            onChange={e => setFormData({...formData, module: e.target.value})}
                                            className="w-full px-3 py-2 rounded-lg border dark:bg-navy dark:border-white/10 dark:text-white"
                                        >
                                            <option value="skillswap">SkillSwap (Students/Teens)</option>
                                            <option value="collab">Collab (Talent)</option>
                                            <option value="incubator">Incubator (Founders)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 dark:text-white">Task Type</label>
                                        <select 
                                            value={formData.type} 
                                            onChange={e => setFormData({...formData, type: e.target.value})}
                                            className="w-full px-3 py-2 rounded-lg border dark:bg-navy dark:border-white/10 dark:text-white"
                                        >
                                            <option value="captcha">Captcha (Auto Verify)</option>
                                            <option value="data_entry">Data Entry</option>
                                            <option value="survey">Survey</option>
                                            <option value="image_tagging">Image Tagging</option>
                                            <option value="file_upload">File Upload (Manual Verify)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1 dark:text-white">Title</label>
                                    <input 
                                        type="text" required
                                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-3 py-2 rounded-lg border dark:bg-navy dark:border-white/10 dark:text-white"
                                        placeholder="e.g. Solve this math captcha"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1 dark:text-white">Description</label>
                                    <textarea 
                                        required rows={3}
                                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-3 py-2 rounded-lg border dark:bg-navy dark:border-white/10 dark:text-white"
                                        placeholder="Brief summary of the task"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1 dark:text-white">Instructions</label>
                                    <textarea 
                                        required rows={3}
                                        value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})}
                                        className="w-full px-3 py-2 rounded-lg border dark:bg-navy dark:border-white/10 dark:text-white"
                                        placeholder="Detailed steps for the user"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 dark:text-white">Reward (in Paise, 100 = 1 INR)</label>
                                        <input 
                                            type="number" required min="10"
                                            value={formData.reward} onChange={e => setFormData({...formData, reward: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 rounded-lg border dark:bg-navy dark:border-white/10 dark:text-white"
                                        />
                                        <p className="text-xs text-muted mt-1">₹{(formData.reward/100).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 dark:text-white">Total Quantity</label>
                                        <input 
                                            type="number" required min="1"
                                            value={formData.totalQuantity} onChange={e => setFormData({...formData, totalQuantity: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 rounded-lg border dark:bg-navy dark:border-white/10 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 dark:text-white">Verification Type</label>
                                        <select 
                                            value={formData.verificationType} 
                                            onChange={e => setFormData({...formData, verificationType: e.target.value})}
                                            className="w-full px-3 py-2 rounded-lg border dark:bg-navy dark:border-white/10 dark:text-white"
                                        >
                                            <option value="auto">Auto Verify</option>
                                            <option value="manual">Manual Verify</option>
                                        </select>
                                    </div>
                                    {formData.verificationType === 'auto' && (
                                        <div>
                                            <label className="block text-sm font-semibold mb-1 dark:text-white">Correct Answer (Exact Match)</label>
                                            <input 
                                                type="text" required
                                                value={formData.correctAnswer} onChange={e => setFormData({...formData, correctAnswer: e.target.value})}
                                                className="w-full px-3 py-2 rounded-lg border dark:bg-navy dark:border-white/10 dark:text-white"
                                                placeholder="e.g. 42"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-white/10 mt-6">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 dark:text-muted hover:text-gray-900 dark:hover:text-white font-medium">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-teal px-6 py-2">
                                        Create Task
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTasks;
