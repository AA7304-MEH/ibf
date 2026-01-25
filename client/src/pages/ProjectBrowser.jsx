import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Briefcase,
    Users,
    ArrowRight,
    Clock,
    Zap,
    Filter,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import Skeleton from '../components/ui/Skeleton';
import { cn } from '../lib/utils';

const ProjectBrowser = ({ filterType = 'general' }) => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const { user } = useAuth();

    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [applyMessage, setApplyMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const baseUrl = filterType === 'skillswap' ? '/projects/skillswap' : '/projects';
            const url = searchTerm ? `${baseUrl}?skillTag=${searchTerm}` : baseUrl;
            const res = await api.get(url);
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filterType, searchTerm]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleApply = async () => {
        if (!applyMessage.trim()) return;
        setSubmitting(true);
        try {
            await api.post(`/projects/${selectedProject._id}/apply`, { message: applyMessage });
            setToast({ type: 'success', message: 'Mission request transmitted.' });
            setIsApplyModalOpen(false);
            setApplyMessage('');
        } catch (err) {
            setToast({ type: 'error', message: 'Transmission failed.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden selection:bg-primary/30 selection:text-white">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                {/* Marketplace Header */}
                <div className="mb-20">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="max-w-2xl">
                            <Badge variant="primary" className="mb-6 font-black uppercase tracking-[0.2em] bg-primary/10 border-primary/20">Operational Grid</Badge>
                            <h1 className="heading-mega mb-6 uppercase italic">
                                {filterType === 'skillswap' ? 'SkillSwap' : 'Active'} <span className="text-primary not-italic underline decoration-indigo-500/30 underline-offset-8">Missions.</span>
                            </h1>
                            <p className="text-lg text-foreground-muted font-medium leading-relaxed max-w-xl">
                                Filter and scan high-intensity missions. Gain the experience and proof-of-work required for the next level.
                            </p>
                        </div>
                        <div className="w-full lg:w-[450px] relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 pointer-events-none group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Scan skill nodes..."
                                className="w-full pl-14 pr-6 py-5 bg-background-surface border border-border rounded-2xl focus:border-primary/50 outline-none transition-all text-sm font-bold shadow-2xl shadow-black/50 tracking-tight"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Grid (3-column layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[400px] rounded-[2rem] bg-border/20" />)
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {projects.map((p, idx) => (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    layout
                                >
                                    <Card glow className="h-full flex flex-col justify-between p-10 bg-background-surface/50 border-border group hover:scale-[1.02] active:scale-[0.98] transition-all duration-500">
                                        <div>
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="w-14 h-14 bg-border rounded-2xl flex items-center justify-center text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                    <Zap className="w-7 h-7" />
                                                </div>
                                                <Badge variant="primary" className="bg-primary/5 border-primary/20 text-xs py-1 rounded-lg italic font-black">
                                                    {p.projectType}
                                                </Badge>
                                            </div>

                                            <h3 className="text-2xl font-black text-white hover:text-primary transition-colors mb-4 uppercase tracking-tighter leading-tight italic">
                                                {p.title}
                                            </h3>

                                            <div className="flex items-center gap-2 mb-8 text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] px-1">
                                                <Users className="w-3.5 h-3.5" />
                                                <span>Source: {p.postedBy?.email?.split('@')[0]}</span>
                                            </div>

                                            <p className="text-foreground-muted font-medium text-sm leading-relaxed line-clamp-3 mb-12">
                                                {p.description}
                                            </p>
                                        </div>

                                        <div className="pt-10 border-t border-border flex items-center justify-between mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] mb-1">Status</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                                    <span className="text-xs font-black text-white uppercase italic">Active Node</span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => { setSelectedProject(p); setIsApplyModalOpen(true); }}
                                                className="bg-white text-background rounded-xl px-8 h-12 font-black uppercase tracking-tight group"
                                            >
                                                Initiate <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Empty State */}
                {!loading && projects.length === 0 && (
                    <div className="py-40 text-center border-2 border-dashed border-border rounded-[3rem] bg-background-surface/30">
                        <Search className="w-20 h-20 text-slate-800 mx-auto mb-8" />
                        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">No Nodes Detected.</h3>
                        <p className="text-foreground-muted font-medium max-w-sm mx-auto">The operational grid is currently clear. Broaden your scan parameters or stand by for new transmissions.</p>
                    </div>
                )}
            </div>

            {/* Application Modal */}
            <Modal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                title={`Transmission Request: ${selectedProject?.title}`}
            >
                <div className="space-y-8 py-4">
                    <p className="text-sm font-medium text-foreground-muted leading-relaxed">
                        Submit your operational pitch to the project founder. Ensure your technical profile is updated for evaluation.
                    </p>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em] px-1">Detailed Pitch</label>
                        <textarea
                            className="w-full h-48 p-6 bg-background-subtle border border-border rounded-2xl outline-none focus:border-primary/50 transition-all text-sm font-bold text-foreground placeholder:text-slate-700 shadow-2xl shadow-black/50"
                            placeholder="Why are you the optimal node for this mission?"
                            value={applyMessage}
                            onChange={(e) => setApplyMessage(e.target.value)}
                        />
                    </div>
                    <Button
                        className="w-full bg-primary hover:brightness-110 text-white rounded-2xl h-16 font-black uppercase tracking-widest text-lg italic shadow-indigo-glow"
                        onClick={handleApply}
                        loading={submitting}
                        disabled={!applyMessage.trim()}
                    >
                        Execute Transmission
                    </Button>
                </div>
            </Modal>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ProjectBrowser;
