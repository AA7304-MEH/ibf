import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Lock,
    User,
    ChevronRight,
    ArrowLeft,
    Rocket,
    CheckCircle2,
    ShieldCheck,
    Star,
    GraduationCap,
    Lightbulb,
    Sparkles,
    Zap,
    Cpu
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import Input from '../components/ui/Input';
import { cn } from '../lib/utils';

const AuthPage = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
    const [toast, setToast] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: searchParams.get('role') || 'talent',
        age: '',
        school: ''
    });

    const handleAuth = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
                setToast({ type: 'success', message: 'Credentials Decrypted. Welcome.' });
            } else {
                await register(formData);
                setToast({ type: 'success', message: 'Identity node created.' });
            }
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            setToast({ type: 'error', message: err.response?.data?.msg || 'Logic gate rejection.' });
        } finally {
            setSubmitting(false);
        }
    };

    const roleOptions = [
        { id: 'founder', icon: <Cpu className="w-5 h-5" />, label: 'Founder', desc: 'Deploying Ventures' },
        { id: 'talent', icon: <Zap className="w-5 h-5" />, label: 'Talent', desc: 'Executing Missions' },
        { id: 'student', icon: <GraduationCap className="w-5 h-5" />, label: 'Student', desc: 'Acquiring Proof' },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden font-sans text-white">
            {/* Left Column: High-Intensity Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-background relative items-center justify-center p-24 overflow-hidden border-r border-border">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/4" />
                </div>

                <div className="relative z-10 max-w-lg w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <RouterLink to="/" className="inline-flex items-center gap-4 mb-20 group">
                            <div className="w-12 h-12 bg-white text-background rounded-2xl flex items-center justify-center font-black italic shadow-indigo-glow transition-transform group-hover:scale-110">
                                SE
                            </div>
                            <span className="text-3xl font-black italic tracking-tighter text-white uppercase">SolvEarn<span className="text-primary not-italic text-4xl">.</span></span>
                        </RouterLink>

                        <h2 className="text-6xl font-black text-white mb-12 leading-[1.05] tracking-tighter uppercase italic">
                            Redefine <br /> <span className="text-primary not-italic">Proof of Work.</span>
                        </h2>

                        <div className="space-y-6">
                            {[
                                { title: 'High-Fidelity Integration', desc: 'Connecting specialized nodes to optimal missions.', icon: <Sparkles className="w-6 h-6 text-primary" /> },
                                { title: 'Encrypted Trust Layers', desc: 'Safety-first protocols for global collaboration.', icon: <ShieldCheck className="w-6 h-6 text-emerald-500" /> },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-6 p-8 rounded-3xl bg-background-surface/30 border border-border group hover:bg-background-surface/50 transition-all shadow-2xl">
                                    <div className="mt-1 p-3 bg-border/50 rounded-xl group-hover:bg-primary/20 transition-colors">{item.icon}</div>
                                    <div>
                                        <h4 className="font-black text-white text-sm uppercase italic tracking-wider mb-2">{item.title}</h4>
                                        <p className="text-foreground-muted text-xs font-medium leading-relaxed max-w-xs">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Column: Decryption Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-background">
                <div className="w-full max-w-[440px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <header className="mb-16 text-center lg:text-left">
                                <h1 className="text-5xl font-black text-white tracking-tighter mb-6 uppercase italic leading-none">
                                    {mode === 'login' ? 'Identify.' : 'Initialize.'}
                                </h1>
                                <p className="text-sm font-medium text-foreground-muted uppercase tracking-widest italic">
                                    {mode === 'login' ? (
                                        <>New node detected? <button onClick={() => setMode('register')} className="text-primary hover:brightness-110 font-black underline underline-offset-8 decoration-primary/30">Create ID</button></>
                                    ) : (
                                        <>Existing sequence? <button onClick={() => setMode('login')} className="text-primary hover:brightness-110 font-black underline underline-offset-8 decoration-primary/30">Decrypt Session</button></>
                                    )}
                                </p>
                            </header>

                            <form onSubmit={handleAuth} className="space-y-10">
                                {mode === 'register' && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] px-1 italic">Identity Label</label>
                                        <input
                                            required
                                            placeholder="Jane Doe"
                                            className="w-full h-14 p-6 bg-background-surface border border-border rounded-2xl outline-none focus:border-primary/50 transition-all text-sm font-black italic uppercase tracking-widest text-white shadow-2xl shadow-black/50"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] px-1 italic">Network Endpoint</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="node@solvearn.net"
                                        className="w-full h-14 p-6 bg-background-surface border border-border rounded-2xl outline-none focus:border-primary/50 transition-all text-sm font-black italic uppercase tracking-widest text-white shadow-2xl shadow-black/50"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] italic">Access Key</label>
                                        {mode === 'login' && <button type="button" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:brightness-110 transition-all italic">Recover?</button>}
                                    </div>
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full h-14 p-6 bg-background-surface border border-border rounded-2xl outline-none focus:border-primary/50 transition-all text-sm font-black italic uppercase tracking-widest text-white shadow-2xl shadow-black/50"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                {mode === 'register' && (
                                    <div className="space-y-6 pt-4">
                                        <label className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] px-1 italic">Functional Logic</label>
                                        <div className="grid grid-cols-1 gap-4">
                                            {roleOptions.map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, role: opt.id })}
                                                    className={cn(
                                                        "flex items-center gap-6 p-6 rounded-2xl border transition-all text-left shadow-2xl",
                                                        formData.role === opt.id
                                                            ? "bg-primary/20 border-primary shadow-indigo-glow"
                                                            : "bg-background-surface/50 border-border hover:border-primary/50"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl",
                                                        formData.role === opt.id ? "bg-primary text-white" : "bg-border/50 text-foreground-muted group-hover:bg-primary/20"
                                                    )}>
                                                        {opt.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className={cn("text-lg font-black italic uppercase tracking-tighter", formData.role === opt.id ? "text-white" : "text-foreground-muted")}>{opt.label}</h4>
                                                        <p className="text-[9px] font-black text-foreground-muted uppercase tracking-[0.2em]">{opt.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Button type="submit" className="w-full h-16 bg-white text-background hover:brightness-90 rounded-2xl font-black uppercase tracking-widest text-lg italic shadow-2xl transition-all" loading={submitting}>
                                    {mode === 'login' ? 'Execute Mission' : 'Deploy Node'} <ChevronRight className="ml-3 w-6 h-6" />
                                </Button>
                            </form>
                        </motion.div>
                    </AnimatePresence>

                    {/* Trust Footer */}
                    <div className="mt-24 text-center opacity-30 group hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-foreground-muted font-black uppercase tracking-[0.5em] mb-4">Secured by Integrity Framework</p>
                    </div>
                </div>

                {/* Back Link Mobile Only */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-10 left-10 p-3 bg-background-surface border border-border hover:bg-border/50 rounded-xl transition-all lg:hidden text-foreground-muted"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default AuthPage;
