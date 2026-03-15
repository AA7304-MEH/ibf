import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    BriefcaseIcon, 
    RocketLaunchIcon, 
    UserGroupIcon, 
    AcademicCapIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import TaskFeed from './TaskFeed';

const Marketplace: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'incubator' | 'collab' | 'skillswap'>('all');

    const tabs = [
        { id: 'all', name: 'All Tasks', icon: BriefcaseIcon },
        { id: 'incubator', name: 'Incubator', icon: RocketLaunchIcon },
        { id: 'collab', name: 'Collab', icon: UserGroupIcon },
        { id: 'skillswap', name: 'SkillSwap', icon: AcademicCapIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-navy py-12 px-4">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Hero Section */}
                <header className="relative p-10 rounded-[2.5rem] bg-gradient-to-br from-ibf-primary to-blue-900 overflow-hidden shadow-2xl border border-white/10">
                    <div className="absolute top-0 right-0 p-40 bg-teal/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                                Micro-Task <br />
                                <span className="text-teal not-italic">Marketplace.</span>
                            </h1>
                            <p className="text-blue-100 text-lg opacity-80 leading-relaxed font-medium">
                                Solve tasks, earn money, and grow your innovator profile. 
                                Everything from simple captchas to startup deep-dives.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Active Tasks</p>
                                <p className="text-2xl font-black text-white italic">250+</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Total Payouts</p>
                                <p className="text-2xl font-black text-teal italic">₹45,000+</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Tabs & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-navy-card rounded-2xl shadow-lg border border-gray-100 dark:border-navy-border w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest italic transition-all duration-300 ${
                                    activeTab === tab.id 
                                    ? 'bg-ibf-primary text-white shadow-indigo-glow' 
                                    : 'text-gray-500 dark:text-muted hover:text-ibf-primary'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-navy-card border border-gray-100 dark:border-navy-border rounded-2xl text-sm focus:border-ibf-primary/50 focus:ring-4 focus:ring-ibf-primary/10 transition-all dark:text-white"
                        />
                    </div>
                </div>

                {/* Task Feeds */}
                <div className="space-y-12">
                    {activeTab === 'all' || activeTab === 'incubator' ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                    Incubator <span className="text-teal not-italic">Tasks</span>
                                </h3>
                                <div className="h-px flex-1 mx-8 bg-white/10 hidden md:block"></div>
                            </div>
                            <TaskFeed module="incubator" />
                        </motion.div>
                    ) : null}

                    {activeTab === 'all' || activeTab === 'collab' ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                    Collab <span className="text-indigo-400 not-italic">Market</span>
                                </h3>
                                <div className="h-px flex-1 mx-8 bg-white/10 hidden md:block"></div>
                            </div>
                            <TaskFeed module="collab" />
                        </motion.div>
                    ) : null}

                    {activeTab === 'all' || activeTab === 'skillswap' ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                    SkillSwap <span className="text-teal not-italic">Bounties</span>
                                </h3>
                                <div className="h-px flex-1 mx-8 bg-white/10 hidden md:block"></div>
                            </div>
                            <TaskFeed module="skillswap" />
                        </motion.div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
