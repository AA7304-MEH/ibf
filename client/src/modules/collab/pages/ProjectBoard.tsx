import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusIcon,
    EllipsisVerticalIcon,
    CalendarIcon,
    ChatBubbleLeftRightIcon,
    PaperClipIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high';
    assignee?: { id: string; name: string; avatar?: string };
    dueDate?: string;
    labels: string[];
    comments: number;
    attachments: number;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
    color: string;
}

const priorityConfig = {
    low: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Low' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium' },
    high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High' }
};

const ProjectBoard: React.FC = () => {
    const [columns, setColumns] = useState<Column[]>([
        {
            id: 'todo',
            title: 'To Do',
            color: 'border-gray-400',
            tasks: [
                {
                    id: 't1',
                    title: 'Design landing page mockups',
                    description: 'Create wireframes and high-fidelity designs for the landing page',
                    status: 'todo',
                    priority: 'high',
                    assignee: { id: 'u1', name: 'Alex Chen' },
                    dueDate: '2026-02-05',
                    labels: ['design', 'ui/ux'],
                    comments: 3,
                    attachments: 2
                },
                {
                    id: 't2',
                    title: 'Set up project repository',
                    status: 'todo',
                    priority: 'medium',
                    labels: ['setup'],
                    comments: 0,
                    attachments: 0
                }
            ]
        },
        {
            id: 'in_progress',
            title: 'In Progress',
            color: 'border-blue-500',
            tasks: [
                {
                    id: 't3',
                    title: 'Implement user authentication',
                    description: 'Add login/signup with OAuth providers',
                    status: 'in_progress',
                    priority: 'high',
                    assignee: { id: 'u2', name: 'Sarah Kim' },
                    dueDate: '2026-02-02',
                    labels: ['backend', 'auth'],
                    comments: 5,
                    attachments: 1
                }
            ]
        },
        {
            id: 'review',
            title: 'In Review',
            color: 'border-purple-500',
            tasks: [
                {
                    id: 't4',
                    title: 'API documentation',
                    status: 'review',
                    priority: 'low',
                    assignee: { id: 'u3', name: 'Mike Johnson' },
                    labels: ['docs'],
                    comments: 2,
                    attachments: 1
                }
            ]
        },
        {
            id: 'done',
            title: 'Done',
            color: 'border-green-500',
            tasks: [
                {
                    id: 't5',
                    title: 'Project kickoff meeting',
                    status: 'done',
                    priority: 'medium',
                    labels: ['meeting'],
                    comments: 0,
                    attachments: 0
                }
            ]
        }
    ]);

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const, columnId: 'todo' });
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);

    const handleAddTask = () => {
        if (!newTask.title.trim()) return;

        const task: Task = {
            id: `t_${Date.now()}`,
            title: newTask.title,
            description: newTask.description,
            status: newTask.columnId as any,
            priority: newTask.priority,
            labels: [],
            comments: 0,
            attachments: 0
        };

        setColumns(cols => cols.map(col =>
            col.id === newTask.columnId
                ? { ...col, tasks: [...col.tasks, task] }
                : col
        ));

        setNewTask({ title: '', description: '', priority: 'medium', columnId: 'todo' });
        setShowTaskModal(false);
    };

    const handleDragStart = (task: Task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (columnId: string) => {
        if (!draggedTask) return;

        setColumns(cols => {
            // Remove from old column
            const newCols = cols.map(col => ({
                ...col,
                tasks: col.tasks.filter(t => t.id !== draggedTask.id)
            }));

            // Add to new column
            return newCols.map(col =>
                col.id === columnId
                    ? { ...col, tasks: [...col.tasks, { ...draggedTask, status: columnId as any }] }
                    : col
            );
        });

        setDraggedTask(null);
    };

    const getTaskCount = () => columns.reduce((acc, col) => acc + col.tasks.length, 0);
    const getCompletedCount = () => columns.find(c => c.id === 'done')?.tasks.length || 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-screen-2xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Board</h1>
                        <p className="text-gray-500">
                            {getTaskCount()} tasks · {getCompletedCount()} completed
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowTaskModal(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Board */}
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {columns.map(column => (
                        <div
                            key={column.id}
                            className={`flex-shrink-0 w-80 bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 border-t-4 ${column.color}`}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(column.id)}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-900 dark:text-white">{column.title}</h3>
                                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {column.tasks.length}
                                    </span>
                                </div>
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Tasks */}
                            <div className="space-y-3 min-h-[200px]">
                                <AnimatePresence>
                                    {column.tasks.map(task => (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            draggable
                                            onDragStart={() => handleDragStart(task)}
                                            className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                                        >
                                            {/* Labels */}
                                            {task.labels.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {task.labels.map(label => (
                                                        <span
                                                            key={label}
                                                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded"
                                                        >
                                                            {label}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Title */}
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                {task.title}
                                            </h4>

                                            {task.description && (
                                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                                    {task.description}
                                                </p>
                                            )}

                                            {/* Priority & Due Date */}
                                            <div className="flex items-center justify-between text-xs mb-3">
                                                <span className={`px-2 py-0.5 rounded ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].text}`}>
                                                    {priorityConfig[task.priority].label}
                                                </span>
                                                {task.dueDate && (
                                                    <span className="flex items-center gap-1 text-gray-500">
                                                        <CalendarIcon className="w-3 h-3" />
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-600">
                                                {task.assignee ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                                            {task.assignee.name.charAt(0)}
                                                        </div>
                                                        <span className="text-xs text-gray-500">{task.assignee.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Unassigned</span>
                                                )}

                                                <div className="flex items-center gap-3 text-gray-400">
                                                    {task.comments > 0 && (
                                                        <span className="flex items-center gap-1 text-xs">
                                                            <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                                                            {task.comments}
                                                        </span>
                                                    )}
                                                    {task.attachments > 0 && (
                                                        <span className="flex items-center gap-1 text-xs">
                                                            <PaperClipIcon className="w-3.5 h-3.5" />
                                                            {task.attachments}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Add Task Button */}
                            <button
                                onClick={() => {
                                    setNewTask(prev => ({ ...prev, columnId: column.id }));
                                    setShowTaskModal(true);
                                }}
                                className="w-full mt-3 py-2 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Add Task
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Task Modal */}
                <AnimatePresence>
                    {showTaskModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                            onClick={() => setShowTaskModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Task</h3>
                                    <button
                                        onClick={() => setShowTaskModal(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            placeholder="Task title..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={newTask.description}
                                            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            placeholder="Add a description..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Priority
                                            </label>
                                            <select
                                                value={newTask.priority}
                                                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Column
                                            </label>
                                            <select
                                                value={newTask.columnId}
                                                onChange={(e) => setNewTask(prev => ({ ...prev, columnId: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                {columns.map(col => (
                                                    <option key={col.id} value={col.id}>{col.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowTaskModal(false)}
                                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddTask}
                                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProjectBoard;
