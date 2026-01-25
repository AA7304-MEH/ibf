import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { AlertCircle, Bell, Settings, LayoutDashboard } from 'lucide-react';

import FounderDashboard from '../components/Dashboard/FounderDashboard';
import TalentDashboard from '../components/Dashboard/TalentDashboard';
import StudentDashboard from '../components/Dashboard/StudentDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const Dashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/dashboard');
            setDashboardData(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('System error: Unable to retrieve dashboard payload');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="bg-background min-h-screen pt-40 pb-32">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-end mb-16">
                        <div className="space-y-6">
                            <Skeleton className="h-6 w-40 bg-border/20" />
                            <Skeleton className="h-16 w-80 bg-border/20" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-3xl bg-border/20" />)}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center p-8">
                <div className="max-w-xl w-full text-center space-y-10">
                    <AlertCircle className="w-20 h-20 text-red-500 mx-auto animate-pulse" />
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Connection Terminated.</h2>
                        <p className="text-xl text-foreground-muted font-medium italic">{error}</p>
                    </div>
                    <Button onClick={() => window.location.reload()} className="h-16 bg-white text-background rounded-2xl px-12 font-black uppercase tracking-widest italic shadow-2xl">
                        Re-establish Connection
                    </Button>
                </div>
            </div>
        );
    }

    const renderRoleDashboard = () => {
        switch (user?.role) {
            case 'founder': return <FounderDashboard data={dashboardData} refreshData={fetchDashboardData} />;
            case 'talent': return <TalentDashboard data={dashboardData} />;
            case 'student': return <StudentDashboard data={dashboardData} />;
            case 'admin': return <AdminDashboard data={dashboardData} />;
            default: return null;
        }
    };

    return (
        <div className="bg-background min-h-screen text-white pb-32">
            {/* Dashboard Sub-Header */}
            <header className="pt-40 pb-20 border-b border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[140px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Badge className="bg-primary/10 text-primary border border-primary/20 uppercase text-[10px] font-black tracking-[0.2em] px-5 py-1.5 rounded-lg italic">
                                    {user?.role} Access
                                </Badge>
                                <div className="h-1 w-1 bg-border rounded-full" />
                                <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em] italic">Priority Node</span>
                            </div>
                            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                                User <span className="text-primary not-italic">Dashboard.</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <button className="p-4 rounded-2xl bg-background-surface border border-border hover:border-primary/50 transition-all group relative shadow-2xl">
                                    <Bell className="w-5 h-5 text-foreground-muted group-hover:text-primary transition-colors" />
                                    <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[3px] border-background-surface shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </button>
                                <button className="p-4 rounded-2xl bg-background-surface border border-border hover:border-primary/50 transition-all group shadow-2xl">
                                    <Settings className="w-5 h-5 text-foreground-muted group-hover:text-white transition-colors" />
                                </button>
                            </div>
                            <div className="h-12 w-px bg-border mx-2" />
                            <div className="flex items-center gap-6 p-2 pr-6 rounded-2xl bg-background-surface/50 border border-border shadow-2xl">
                                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white font-black text-2xl italic shadow-indigo-glow uppercase">
                                    {(dashboardData?.profile?.fullName || user?.email || 'U')[0]}
                                </div>
                                <div className="text-left">
                                    <p className="text-lg font-black text-white italic tracking-tighter leading-none mb-1 uppercase">{dashboardData?.profile?.fullName || 'User Record'}</p>
                                    <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">Active Session</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    {renderRoleDashboard()}
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
