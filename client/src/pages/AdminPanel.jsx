import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket,
    ShieldCheck,
    Search,
    CheckCircle2,
    XCircle,
    UserCircle,
    Building2,
    GraduationCap,
    AlertCircle,
    Cpu,
    ShieldAlert,
    Trash2,
    Settings
} from 'lucide-react';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import { cn } from '../lib/utils';

const AdminPanel = () => {
    const [startups, setStartups] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('incubator');
    const [toast, setToast] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const startupRes = await api.get('/admin/incubator-apps');
            const studentRes = await api.get('/admin/students');
            setStartups(startupRes.data);
            setStudents(studentRes.data);
            setLoading(false);
        } catch (err) {
            setToast({ type: 'error', message: 'Telemetry retrieval failed' });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleIncubatorStatus = async (userId, status) => {
        try {
            await api.put(`/incubator/status/${userId}`, { status });
            setToast({ type: 'success', message: `Startup ${status}` });
            fetchData();
        } catch (err) {
            setToast({ type: 'error', message: 'Auth layer rejection' });
        }
    };

    const handleConsentToggle = async (userId, verified) => {
        try {
            await api.put(`/admin/student-consent/${userId}`, { verified });
            setToast({ type: 'success', message: 'Access node updated' });
            fetchData();
        } catch (err) {
            setToast({ type: 'error', message: 'Logic gate failure' });
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-background" />;
    }

    const filteredStartups = startups.filter(s =>
        s.startupName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStudents = students.filter(s =>
        s.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-background min-h-screen text-white">
            <header className="pt-40 pb-20 border-b border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Badge variant="error" className="bg-primary/20 text-primary border border-primary/30 uppercase tracking-[0.2em] text-[10px] font-black px-5 py-1.5 italic rounded-lg">
                                    System Root
                                </Badge>
                                <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em]">Access Level: 0</span>
                            </div>
                            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">Command <br /> <span className="text-primary not-italic">Center.</span></h1>
                        </div>
                        <div className="w-full lg:w-96 relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted group-focus-within:text-primary transition-colors pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Scan records..."
                                className="w-full pl-14 pr-6 py-4 bg-background-surface border border-border rounded-2xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-black italic uppercase tracking-widest placeholder:text-foreground-muted/40"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
                <div className="flex items-center gap-2 p-1.5 bg-background-surface border border-border rounded-2xl w-fit mb-16 shadow-2xl">
                    <button
                        onClick={() => setActiveTab('incubator')}
                        className={cn(
                            "px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic transition-all duration-300",
                            activeTab === 'incubator' ? "bg-primary text-white shadow-indigo-glow" : "text-foreground-muted hover:text-white"
                        )}
                    >
                        Foundry Cohort
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={cn(
                            "px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic transition-all duration-300",
                            activeTab === 'students' ? "bg-primary text-white shadow-indigo-glow" : "text-foreground-muted hover:text-white"
                        )}
                    >
                        Student Tiers
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'incubator' ? (
                        <motion.div
                            key="incubator"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 gap-6">
                                {filteredStartups.map((s) => (
                                    <Card key={s._id} className="p-8 bg-background-surface/50 border-border flex flex-col md:flex-row md:items-center justify-between group hover:border-primary/50 transition-all duration-300 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-center gap-8 relative z-10">
                                            <div className="w-16 h-16 bg-border rounded-2xl flex items-center justify-center font-black italic text-2xl text-white shadow-xl group-hover:bg-primary transition-colors duration-500">
                                                {s.startupName?.[0]}
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none group-hover:text-primary transition-colors">{s.startupName}</h4>
                                                <div className="flex items-center gap-4 text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">
                                                    <span className="text-white opacity-80">{s.fullName}</span>
                                                    <div className="h-1 w-1 bg-border rounded-full" />
                                                    <span className="text-primary/60 italic">{s.startupStage}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8 mt-6 md:mt-0 relative z-10">
                                            <Badge variant={s.incubatorStatus === 'accepted' ? 'success' : 'warning'} className="uppercase border-none text-[10px] font-black tracking-[0.2em] italic px-6 py-2 rounded-lg">
                                                {s.incubatorStatus}
                                            </Badge>
                                            <div className="h-10 w-[1px] bg-border mx-2 hidden md:block" />
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleIncubatorStatus(s.userId, 'accepted')}
                                                    className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center shadow-lg"
                                                    title="Accept Node"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleIncubatorStatus(s.userId, 'rejected')}
                                                    className="w-12 h-12 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg"
                                                    title="Reject Node"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                {filteredStartups.length === 0 && (
                                    <div className="py-32 text-center border-2 border-dashed border-border rounded-[3rem] bg-background-surface/20">
                                        <Cpu className="w-12 h-12 text-foreground-muted mx-auto mb-6 opacity-20" />
                                        <p className="text-xs font-black text-foreground-muted italic tracking-[0.3em] uppercase opacity-60">Zero pending integration requests</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="students"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 gap-6">
                                {filteredStudents.map((s) => (
                                    <Card key={s._id} className="p-8 bg-background-surface/50 border-border flex flex-col md:flex-row md:items-center justify-between group hover:border-primary/50 transition-all duration-300 shadow-2xl relative overflow-hidden">
                                        <div className="flex items-center gap-8 relative z-10">
                                            <div className="w-16 h-16 bg-border/50 border border-border rounded-2xl flex items-center justify-center text-foreground-muted group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl">
                                                <GraduationCap className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none">{s.fullName}</h4>
                                                <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] italic underline decoration-primary/30 underline-offset-4">{s.school}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-10 mt-6 md:mt-0 relative z-10">
                                            <div className="text-right hidden lg:block">
                                                <p className="text-sm font-black text-white leading-none mb-1 italic uppercase tracking-tight">{s.age} Cycles</p>
                                                <p className="text-[9px] font-black text-foreground-muted uppercase tracking-[0.2em]">Age Telemetry</p>
                                            </div>
                                            <Badge variant={s.parentalConsentVerified ? 'success' : 'error'} className="border-none uppercase text-[10px] font-black tracking-[0.2em] italic px-6 py-2 rounded-lg">
                                                {s.parentalConsentVerified ? 'Verified' : 'Pending'}
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                className="rounded-xl h-12 px-8 font-black text-[10px] uppercase tracking-[0.2em] italic border-border hover:bg-primary/20 hover:border-primary/50 text-white transition-all"
                                                onClick={() => handleConsentToggle(s.userId, !s.parentalConsentVerified)}
                                            >
                                                {s.parentalConsentVerified ? 'Revoke Access' : 'Verify Manual'}
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default AdminPanel;
