import React, { useState, useEffect } from 'react';
import { BriefcaseIcon, ClockIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import { Link } from 'react-router-dom';

interface TaskFeedProps {
    module: 'incubator' | 'collab' | 'skillswap';
}

const TaskFeed: React.FC<TaskFeedProps> = ({ module }) => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, [module]);

    const fetchTasks = async () => {
        try {
            const res = await api.get(`/marketplace/tasks/${module}`);
            setTasks(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10 dark:text-white">Loading tasks...</div>;

    if (tasks.length === 0) {
        return (
            <div className="bg-white dark:bg-navy-card rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-navy-border mt-6">
                <BriefcaseIcon className="w-12 h-12 text-gray-400 dark:text-muted mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No active tasks</h3>
                <p className="text-gray-500 dark:text-muted mt-2">Check back later for new micro-tasks in this module.</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                    <div key={task._id} className="glass rounded-[2rem] border border-white/5 p-6 flex flex-col group hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                        {/* Status/Badge */}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 text-teal text-[10px] font-black uppercase tracking-widest rounded-lg">
                                {task.type.replace('_', ' ')}
                            </span>
                            <div className="text-right">
                                <span className="font-black text-xl text-teal italic block leading-none">
                                    ₹{(task.reward / 100).toFixed(2)}
                                </span>
                                <span className="text-[10px] text-muted font-bold uppercase tracking-tighter">per task</span>
                            </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-teal transition-colors">{task.title}</h3>
                        <p className="text-xs text-muted mb-6 flex-1 line-clamp-3 leading-relaxed">{task.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5 relative z-10">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                                    <ClockIcon className="w-3 h-3 text-teal" />
                                    ~{task.config?.timeLimit || 5} Min
                                </div>
                                <div className="text-[10px] text-white/40 font-bold uppercase">{task.remainingQuantity} spots left</div>
                            </div>
                            <Link 
                                to={`/marketplace/task/${task._id}`} 
                                className="px-6 py-2.5 bg-teal text-navy text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,245,212,0.2)]"
                            >
                                Start Mission →
                            </Link>
                        </div>

                        {/* Animated background element */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal/5 blur-[50px] group-hover:bg-teal/10 transition-colors pointer-events-none"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskFeed;
