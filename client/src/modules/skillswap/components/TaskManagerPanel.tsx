import React, { useState } from 'react';
import { PlusIcon, Squares2X2Icon, ListBulletIcon, PlayIcon, CheckIcon, PauseIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Task {
    id: string;
    title: string;
    status: 'todo' | 'in-progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    xp: number;
}

const TaskManagerPanel: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Complete wireframes', status: 'in-progress', priority: 'high', xp: 50 },
        { id: '2', title: 'Review mentor feedback', status: 'todo', priority: 'medium', xp: 30 },
        { id: '3', title: 'Submit final report', status: 'todo', priority: 'high', dueDate: '2026-02-05', xp: 100 },
        { id: '4', title: 'Setup dev environment', status: 'done', priority: 'low', xp: 20 },
    ]);
    const [newTask, setNewTask] = useState('');
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

    const columns = [
        { id: 'todo', title: '📋 To Do', color: 'bg-gray-100 dark:bg-gray-700' },
        { id: 'in-progress', title: '🚀 In Progress', color: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 'review', title: '👀 Review', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { id: 'done', title: '✅ Done', color: 'bg-green-50 dark:bg-green-900/20' },
    ];

    const addTask = () => {
        if (!newTask.trim()) return;
        setTasks([...tasks, {
            id: Date.now().toString(),
            title: newTask,
            status: 'todo',
            priority: 'medium',
            xp: 25
        }]);
        setNewTask('');
    };

    const moveTask = (taskId: string, newStatus: Task['status']) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const deleteTask = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'high': return 'border-l-red-500';
            case 'medium': return 'border-l-yellow-500';
            default: return 'border-l-gray-300';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="font-mono text-indigo-600">Task_Manager.exe</span>
                    </h2>
                    <p className="text-sm text-gray-500">{tasks.filter(t => t.status !== 'done').length} tasks remaining</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={`p-2 rounded-lg ${viewMode === 'kanban' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        <ListBulletIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Add Task */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                    onClick={addTask}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1 font-medium"
                >
                    <PlusIcon className="w-4 h-4" /> Add
                </button>
            </div>

            {/* Kanban Board */}
            {viewMode === 'kanban' && (
                <div className="grid grid-cols-4 gap-4 overflow-x-auto">
                    {columns.map((col) => (
                        <div key={col.id} className={`${col.color} rounded-xl p-3 min-h-[200px]`}>
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">{col.title}</h3>
                            <div className="space-y-2">
                                {tasks.filter(t => t.status === col.id).map((task) => (
                                    <div
                                        key={task.id}
                                        className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border-l-4 ${getPriorityColor(task.priority)} cursor-pointer hover:shadow-md transition-all group`}
                                    >
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{task.title}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-amber-600 font-bold">+{task.xp} XP</span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {col.id !== 'done' && (
                                                    <button
                                                        onClick={() => moveTask(task.id, col.id === 'todo' ? 'in-progress' : col.id === 'in-progress' ? 'review' : 'done')}
                                                        className="p-1 hover:bg-green-100 rounded text-green-600"
                                                    >
                                                        <PlayIcon className="w-3 h-3" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="p-1 hover:bg-red-100 rounded text-red-500"
                                                >
                                                    <TrashIcon className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="space-y-2">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 ${getPriorityColor(task.priority)}`}
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => moveTask(task.id, task.status === 'done' ? 'todo' : 'done')}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-indigo-500'}`}
                                >
                                    {task.status === 'done' && <CheckIcon className="w-3 h-3" />}
                                </button>
                                <span className={`text-sm ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                    {task.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-amber-600 font-bold">+{task.xp} XP</span>
                                <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded capitalize text-gray-600 dark:text-gray-300">
                                    {task.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskManagerPanel;
