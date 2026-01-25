import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Rocket,
    Users,
    Briefcase,
    ExternalLink,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';
import api from '../../api/axios';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Toast from '../ui/Toast';

const FounderDashboard = ({ data, refreshData }) => {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isIncubatorModalOpen, setIsIncubatorModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // Form States
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        skillsRequired: '',
        projectType: 'general',
        duration: ''
    });

    const [incubatorData, setIncubatorData] = useState({
        startupName: data?.profile?.startupName || '',
        startupPitch: data?.profile?.startupPitch || '',
        startupStage: data?.profile?.startupStage || 'Idea',
        startupWebsite: data?.profile?.startupWebsite || ''
    });

    const [submitting, setSubmitting] = useState(false);

    const handlePostProject = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...projectData,
                skillsRequired: projectData.skillsRequired.split(',').map(s => s.trim())
            };
            await api.post('/projects', payload);
            setToast({ type: 'success', message: 'Project transmission successful.' });
            setIsPostModalOpen(false);
            refreshData();
        } catch (err) {
            setToast({ type: 'error', message: 'Failed to transmit project data.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleApplyIncubator = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/incubator/apply', incubatorData);
            setToast({ type: 'success', message: 'Incubator application logged.' });
            setIsIncubatorModalOpen(false);
            refreshData();
        } catch (err) {
            setToast({ type: 'error', message: 'Application transmission failed.' });
        } finally {
            setSubmitting(false);
        }
    };

    const stats = [
        { label: 'Live Projects', value: data?.stats?.projectsCount || 0, icon: <Briefcase className="w-5 h-5" />, color: 'text-primary' },
        { label: 'Mission Requests', value: data?.stats?.pendingApplications || 0, icon: <Users className="w-5 h-5" />, color: 'text-purple-500' },
        {
            label: 'Incubator Status',
            value: data?.profile?.incubatorStatus?.toUpperCase() || 'NONE',
            icon: <Rocket className="w-5 h-5" />,
            color: 'text-emerald-500',
            isBadge: true
        },
    ];

    return (
        <div className="space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <Card key={i} className="flex items-center gap-6 p-8 bg-background-surface/50 border-border group hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-black/50 overflow-hidden">
                        <div className={`w-14 h-14 bg-border/50 rounded-2xl flex items-center justify-center ${stat.color} border border-border group-hover:bg-primary group-hover:text-white transition-all duration-500`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                            {stat.isBadge ? (
                                <Badge variant={
                                    stat.value === 'ACCEPTED' ? 'success' :
                                        stat.value === 'APPLIED' ? 'warning' : 'default'
                                } className="italic font-black text-[10px] px-4 py-1.5 rounded-lg border-none">
                                    {stat.value}
                                </Badge>
                            ) : (
                                <h3 className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</h3>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Projects List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                            Current Project Nodes
                            <span className="text-xs font-bold text-foreground-muted not-italic tracking-normal">[{data?.projects?.length || 0}]</span>
                        </h2>
                        <Button size="sm" onClick={() => setIsPostModalOpen(true)} className="bg-primary text-white font-black uppercase tracking-tight rounded-xl px-6 h-11">
                            <Plus className="w-4 h-4 mr-2" /> Launch Node
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data?.projects?.map((project, idx) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card glow className="h-full flex flex-col justify-between p-8 bg-background-surface/50 border-border hover:border-primary/50 group transition-all duration-500">
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <Badge variant={project.projectType === 'skillswap' ? 'secondary' : 'primary'} className="italic font-black text-[9px] px-3 py-1 rounded-lg">
                                                {project.projectType}
                                            </Badge>
                                            <button className="text-foreground-muted group-hover:text-primary transition-colors">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-3 uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-tight">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm font-medium text-foreground-muted line-clamp-3 mb-8 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-6 border-t border-border">
                                        {project.skillsRequired?.slice(0, 3).map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-border/30 text-[9px] font-black text-foreground-muted rounded uppercase tracking-[0.15em] border border-border">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}

                        {(!data?.projects || data.projects.length === 0) && (
                            <div className="col-span-full border border-border border-dashed rounded-[2.5rem] p-24 text-center bg-background-surface/20">
                                <div className="w-20 h-20 bg-border/20 rounded-2xl flex items-center justify-center mx-auto mb-8 text-foreground-muted transition-colors group-hover:bg-primary/10">
                                    <Briefcase className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">No Active Nodes detected.</h3>
                                <p className="text-foreground-muted font-medium mb-10 max-w-sm mx-auto">Initialize your first operational node to begin scanning for student talent.</p>
                                <Button variant="outline" size="md" onClick={() => setIsPostModalOpen(true)} className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-sm">
                                    Initialize Project
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Quick Actions & Incubator */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">System Console</h2>

                    {/* Incubator Card */}
                    <Card className="relative bg-background-surface border-border p-10 overflow-hidden group shadow-2xl shadow-indigo-500/10">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                                    <Rocket className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">Ecosystem Scale</h3>
                                    <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">Incubator Protocol</p>
                                </div>
                            </div>

                            {data?.profile?.incubatorStatus === 'none' || !data?.profile?.incubatorStatus ? (
                                <div className="space-y-8">
                                    <p className="text-sm font-medium text-foreground-muted leading-relaxed">
                                        Integrate with the incubator framework to unlock mentorship nodes, priority matching, and capitalization credits.
                                    </p>
                                    <Button
                                        className="w-full bg-white text-background hover:brightness-90 rounded-2xl h-14 font-black uppercase tracking-widest text-sm italic"
                                        onClick={() => setIsIncubatorModalOpen(true)}
                                    >
                                        Initiate Integration
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between text-sm py-4 border-b border-border">
                                        <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">Operational Tier</span>
                                        <span className="font-black text-primary tracking-widest uppercase italic">
                                            {data.profile.incubatorStatus}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2">
                                        <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">Advisor Node</span>
                                        <span className="text-xs font-bold text-foreground italic">[PENDING]</span>
                                    </div>
                                    <Button variant="ghost" className="w-full text-foreground-muted hover:text-white hover:bg-border/30 mt-4 rounded-xl px-4 py-4 uppercase font-black text-[10px] tracking-[0.2em]">
                                        View Protocol Logs <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Quick Resources */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em] px-2 mb-6">Documentation Nodes</h4>
                        {[
                            { title: 'Talent Matching Protocol', link: '#' },
                            { title: 'Micro-Internship Templates', link: '#' },
                            { title: 'Ecosystem Governance', link: '#' },
                        ].map((item, i) => (
                            <button key={i} className="w-full flex items-center justify-between p-6 bg-background-surface/50 border border-border rounded-2xl hover:border-primary/50 group transition-all duration-300">
                                <span className="text-sm font-black text-foreground-muted uppercase italic tracking-tight group-hover:text-white transition-colors">{item.title}</span>
                                <ExternalLink className="w-4 h-4 text-slate-800 group-hover:text-primary transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals & Toasts */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <Modal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                title="Initialize New Project Node"
            >
                <form onSubmit={handlePostProject} className="space-y-8 py-4">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] px-1">Project Identifier</label>
                        <input
                            required
                            className="w-full px-6 py-4 bg-background-subtle border border-border rounded-xl focus:border-primary placeholder:text-slate-700 outline-none transition-all font-bold text-sm"
                            placeholder="e.g. AI-CORE-2026"
                            value={projectData.title}
                            onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] px-1">Mission Parameters</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-6 py-4 bg-background-subtle border border-border rounded-xl focus:border-primary placeholder:text-slate-700 outline-none transition-all font-bold text-sm"
                            placeholder="Detail the operational goals..."
                            value={projectData.description}
                            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] px-1">Protocol Type</label>
                            <select
                                className="w-full px-6 py-4 bg-background-subtle border border-border rounded-xl outline-none font-bold text-sm appearance-none"
                                value={projectData.projectType}
                                onChange={(e) => setProjectData({ ...projectData, projectType: e.target.value })}
                            >
                                <option value="general">Standard Operation</option>
                                <option value="skillswap">SkillSwap (Teen)</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] px-1">Duration Scan</label>
                            <input
                                required
                                placeholder="e.g. 14 Days"
                                className="w-full px-6 py-4 bg-background-subtle border border-border rounded-xl outline-none font-bold text-sm"
                                value={projectData.duration}
                                onChange={(e) => setProjectData({ ...projectData, duration: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] px-1">Required Expertise Nodes</label>
                        <input
                            required
                            placeholder="React, UI, Python"
                            className="w-full px-6 py-4 bg-background-subtle border border-border rounded-xl outline-none font-bold text-sm"
                            value={projectData.skillsRequired}
                            onChange={(e) => setProjectData({ ...projectData, skillsRequired: e.target.value })}
                        />
                    </div>
                    <Button type="submit" className="w-full h-16 bg-primary text-white font-black uppercase tracking-widest text-lg italic rounded-2xl shadow-indigo-glow" loading={submitting}>
                        Initialize Transmission
                    </Button>
                </form>
            </Modal>

            <Modal
                isOpen={isIncubatorModalOpen}
                onClose={() => setIsIncubatorModalOpen(false)}
                title="Incubator Integration Protocol"
            >
                <form onSubmit={handleApplyIncubator} className="space-y-8 py-4">
                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex items-start gap-4 mb-4">
                        <Sparkles className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-foreground-muted leading-relaxed">
                            Integration requests are evaluated on a rolling basis. Ensure your startup telemetry is clear and concise.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] px-1">Startup Identifier</label>
                        <input
                            required
                            className="w-full px-6 py-4 bg-background-subtle border border-border rounded-xl outline-none font-bold text-sm"
                            value={incubatorData.startupName}
                            onChange={(e) => setIncubatorData({ ...incubatorData, startupName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] px-1">Operational Pitch</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-6 py-4 bg-background-subtle border border-border rounded-xl outline-none font-bold text-sm"
                            value={incubatorData.startupPitch}
                            onChange={(e) => setIncubatorData({ ...incubatorData, startupPitch: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] px-1">Development Phase</label>
                            <select
                                className="w-full px-6 py-4 bg-background-subtle border border-border rounded-xl outline-none font-bold text-sm"
                                value={incubatorData.startupStage}
                                onChange={(e) => setIncubatorData({ ...incubatorData, startupStage: e.target.value })}
                            >
                                <option value="Idea">Idea Node</option>
                                <option value="Prototype">MVP/Prototype</option>
                                <option value="Launch">Operational Node</option>
                                <option value="Revenue">Scale Node</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] px-1">Web Entry Node</label>
                            <input
                                placeholder="https://..."
                                className="w-full px-6 py-4 bg-background-subtle border border-border rounded-xl outline-none font-bold text-sm"
                                value={incubatorData.startupWebsite}
                                onChange={(e) => setIncubatorData({ ...incubatorData, startupWebsite: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full h-16 bg-white text-background hover:brightness-90 rounded-2xl font-bold uppercase tracking-widest text-lg italic shadow-xl" loading={submitting}>
                        Log Integration Request
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default FounderDashboard;
