import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Rocket,
    Star,
    GraduationCap,
    ChevronRight,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Zap,
    Cpu,
    Target
} from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import Input from '../components/ui/Input';
import { cn } from '../lib/utils';

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: 'talent',
        fullName: '',
        skills: '',
        bio: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const handleComplete = async () => {
        setSubmitting(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            await api.post('/dashboard/profile', {
                ...formData,
                skills: skillsArray
            });
            setToast({ type: 'success', message: 'Identity Node Optimized. Welcome.' });
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            setToast({ type: 'error', message: 'Logic Gate Failure: Profile Update Rejected' });
        } finally {
            setSubmitting(false);
        }
    };

    const roles = [
        { id: 'founder', label: 'Founder', icon: <Cpu className="w-5 h-5" />, desc: 'Deploying Scale Ventures' },
        { id: 'talent', label: 'Talent', icon: <Zap className="w-5 h-5" />, desc: 'Executing High-Impact Missions' },
        { id: 'student', label: 'Student', icon: <GraduationCap className="w-5 h-5" />, desc: 'Acquiring Industrial Proof' },
    ];

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-white relative overflow-hidden font-sans">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 blur-[140px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-xl w-full relative z-10">
                {/* SolvEarn Navigation Progress */}
                <div className="flex justify-center items-center gap-4 mb-20">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={cn(
                            "h-1.5 px-6 rounded-full transition-all duration-700",
                            step >= i ? "bg-primary shadow-indigo-glow" : "bg-border opacity-30"
                        )} />
                    ))}
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="1" {...fadeIn} className="space-y-12">
                                <div className="text-center space-y-4">
                                    <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-tight">Define your <br /> <span className="text-primary not-italic">Logic Path.</span></h2>
                                    <p className="text-sm font-black text-foreground-muted uppercase tracking-[0.3em] italic">Select functional role for network integration.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {roles.map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => setFormData({ ...formData, role: r.id })}
                                            className={cn(
                                                "flex items-center gap-6 p-8 rounded-2xl border transition-all text-left shadow-2xl relative overflow-hidden group/btn active:scale-[0.98]",
                                                formData.role === r.id
                                                    ? "bg-primary/20 border-primary shadow-indigo-glow"
                                                    : "bg-background-surface/50 border-border hover:border-primary/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl",
                                                formData.role === r.id ? "bg-primary text-white" : "bg-border/50 text-foreground-muted group-hover/btn:bg-primary/20"
                                            )}>
                                                {r.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={cn("text-lg font-black italic uppercase tracking-tighter mb-1", formData.role === r.id ? "text-white" : "text-foreground-muted")}>{r.label}</h4>
                                                <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">{r.desc}</p>
                                            </div>
                                            {formData.role === r.id && <CheckCircle2 className="w-6 h-6 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                                <Button className="w-full h-16 bg-white text-background hover:brightness-90 rounded-2xl font-black uppercase tracking-widest text-lg italic shadow-2xl" onClick={() => setStep(2)}>
                                    Initiate Next <ChevronRight className="ml-3 w-6 h-6" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="2" {...fadeIn} className="space-y-12">
                                <div className="text-center space-y-4">
                                    <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-tight">Identity <br /> <span className="text-primary not-italic">Vector.</span></h2>
                                    <p className="text-sm font-black text-foreground-muted uppercase tracking-[0.3em] italic">Deploy your introduction to the communal grid.</p>
                                </div>
                                <div className="space-y-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] px-1 italic">Public Label</label>
                                        <input
                                            required
                                            placeholder="Alex Rivera"
                                            className="w-full h-14 p-6 bg-background-surface border border-border rounded-2xl outline-none focus:border-primary/50 transition-all text-sm font-black italic uppercase tracking-widest text-white shadow-2xl shadow-black/50"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] px-1 italic">Logic Summary (Bio)</label>
                                        <textarea
                                            className="w-full h-40 p-6 bg-background-surface border border-border rounded-2xl outline-none focus:border-primary/50 transition-all text-sm font-black italic uppercase tracking-widest text-white shadow-2xl shadow-black/50"
                                            placeholder="Architecting future-proof systems for..."
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="w-1/3 h-16 rounded-2xl font-black uppercase tracking-widest italic border-border" onClick={() => setStep(1)}>Back</Button>
                                    <Button className="flex-1 h-16 bg-white text-background hover:brightness-90 rounded-2xl font-black uppercase tracking-widest text-lg italic shadow-2xl" onClick={() => setStep(3)} disabled={!formData.fullName || !formData.bio}>
                                        Proceed <ChevronRight className="ml-3 w-6 h-6" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="3" {...fadeIn} className="space-y-12">
                                <div className="text-center space-y-4">
                                    <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-tight">Skill <br /> <span className="text-primary not-italic">Telemetry.</span></h2>
                                    <p className="text-sm font-black text-foreground-muted uppercase tracking-[0.3em] italic">What functional nodes do you possess?</p>
                                </div>
                                <div className="space-y-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] px-1 italic">Primary Stack</label>
                                        <input
                                            required
                                            placeholder="React, Rust, UI Engineering..."
                                            className="w-full h-14 p-6 bg-background-surface border border-border rounded-2xl outline-none focus:border-primary/50 transition-all text-sm font-black italic uppercase tracking-widest text-white shadow-2xl shadow-black/50"
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        />
                                    </div>

                                    <div className="bg-background-surface/30 p-10 rounded-3xl border border-border space-y-6 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Target className="w-20 h-20" />
                                        </div>
                                        <h4 className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] italic">Visualizing Node Identity</h4>
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black italic text-2xl shadow-indigo-glow uppercase">
                                                {formData.fullName?.[0] || 'N'}
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{formData.fullName || 'UNLABELED NODE'}</p>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Operational as {formData.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="outline" className="w-1/3 h-16 rounded-2xl font-black uppercase tracking-widest italic border-border" onClick={() => setStep(2)}>Back</Button>
                                    <Button className="flex-1 h-16 bg-primary text-white hover:brightness-110 rounded-2xl font-black uppercase tracking-widest text-lg italic shadow-indigo-glow" loading={submitting} onClick={handleComplete}>
                                        Deploy Identity <ArrowRight className="ml-3 w-6 h-6" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default Onboarding;
