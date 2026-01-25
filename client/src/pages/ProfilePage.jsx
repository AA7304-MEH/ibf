import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Link as LinkIcon,
    Award,
    Briefcase,
    ShieldCheck,
    Star,
    ExternalLink,
    Mail,
    MapPin,
    CheckCircle2,
    Sparkles,
    Globe,
    Zap
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import Skeleton from '../components/ui/Skeleton';
import { cn } from '../lib/utils';

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/dashboard');
                setProfile(res.data.profile);
            } catch (err) {
                setToast({ type: 'error', message: 'Telemetry retrieval failed.' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 space-y-16">
                <div className="flex flex-col items-center">
                    <Skeleton className="w-40 h-40 rounded-[2.5rem] mb-8 bg-border/50" />
                    <Skeleton className="h-10 w-80 mb-4 bg-border/50" />
                    <Skeleton className="h-4 w-60 bg-border/30" />
                </div>
                <div className="grid md:grid-cols-3 gap-12">
                    <Skeleton className="h-80 rounded-[2.5rem] bg-border/20" />
                    <Skeleton className="h-80 rounded-[2.5rem] col-span-2 bg-border/20" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen text-white">
            {/* High-Impact Header Zone */}
            <div className="h-80 bg-background-surface border-b border-border relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.08),transparent)]" />
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 h-full relative">
                    <div className="absolute -bottom-20 left-4 md:left-0">
                        <div className="w-40 h-40 rounded-[2.5rem] border-[10px] border-background bg-border shadow-2xl flex items-center justify-center overflow-hidden group">
                            {profile?.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <span className="text-5xl font-black italic text-white uppercase opacity-40 group-hover:opacity-100 transition-opacity">{profile?.fullName?.[0]}</span>
                            )}
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-48">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
                    {/* Left: Bio & Telemetry Metadata */}
                    <aside className="space-y-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">{profile?.fullName}</h1>
                                {user?.isVerified && (
                                    <div className="w-8 h-8 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center shadow-indigo-glow">
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mb-10">
                                <Badge variant="primary" className="uppercase tracking-[0.2em] text-[10px] font-black border-none px-5 py-2 bg-primary text-white italic rounded-lg">
                                    {user?.role} NODE
                                </Badge>
                                <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">IDENTIFIED AS</span>
                                <span className="text-xs font-black text-white italic underline decoration-primary/50 underline-offset-4">{profile?.school || "GLOBAL FOUNDRY"}</span>
                            </div>
                            <p className="text-lg font-medium text-foreground-muted leading-relaxed max-w-sm italic">
                                "{profile?.bio || 'Operational parameters clear. Seeking high-impact mission integration.'}"
                            </p>
                        </motion.div>

                        <div className="space-y-8 pt-16 border-t border-border">
                            <h3 className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em]">Operational Terminals</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-5 text-sm font-bold text-foreground-muted group hover:text-white transition-colors">
                                    <div className="w-10 h-10 bg-border/30 border border-border rounded-xl flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="tracking-tight">{user?.email}</span>
                                </div>
                                {profile?.startupWebsite && (
                                    <a href={profile.startupWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-5 text-sm font-bold text-foreground-muted group hover:text-primary transition-colors">
                                        <div className="w-10 h-10 bg-border/30 border border-border rounded-xl flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <span className="tracking-tight">{profile.startupWebsite.replace(/(^\w+:|^)\/\//, '')}</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                )}
                                <div className="flex items-center gap-5 text-sm font-bold text-foreground-muted group hover:text-white transition-colors">
                                    <div className="w-10 h-10 bg-border/30 border border-border rounded-xl flex items-center justify-center">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="tracking-tight uppercase tracking-widest text-[10px]">Edge Distributed Node</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right: Expertise & Output Feed */}
                    <div className="lg:col-span-2 space-y-24">
                        {/* Expertise Stack */}
                        <section>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-px bg-border flex-1" />
                                <h2 className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em]">Technical Stack Nodes</h2>
                                <div className="h-px bg-border w-12" />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {profile?.skills?.map((skill, idx) => (
                                    <div key={idx} className="px-8 py-4 bg-background-surface/50 border border-border rounded-2xl text-xs font-black text-white italic uppercase tracking-[0.1em] hover:bg-primary/10 hover:border-primary/50 transition-all cursor-default shadow-xl">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Portfolio Nodes */}
                        <section>
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em]">Verified Operational Proofs</h2>
                                <Sparkles className="w-5 h-5 text-primary opacity-50" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {profile?.portfolioLinks?.length > 0 ? profile.portfolioLinks.map((item, i) => (
                                    <Card key={i} className="p-10 bg-background-surface/50 border-border hover:border-primary/50 transition-all group shadow-2xl shadow-black/50 relative overflow-hidden">
                                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="w-14 h-14 bg-border border border-border rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                <Zap className="w-7 h-7" />
                                            </div>
                                            <a href={item.url} target="_blank" rel="noreferrer" className="p-3.5 bg-border/30 hover:bg-primary/20 rounded-xl text-foreground-muted hover:text-white transition-all border border-border group-hover:border-primary/30">
                                                <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </div>
                                        <h4 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-tight group-hover:text-primary transition-colors">{item.title}</h4>
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                            <p className="text-[9px] font-black text-foreground-muted uppercase tracking-[0.25em]">Transmission Verified</p>
                                        </div>
                                    </Card>
                                )) : (
                                    <div className="col-span-full py-24 bg-background-surface/20 border border-dashed border-border rounded-[3rem] text-center">
                                        <div className="w-20 h-20 bg-border/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-border opacity-20">
                                            <Briefcase className="w-10 h-10" />
                                        </div>
                                        <p className="text-xs font-black text-foreground-muted uppercase tracking-[0.3em] italic">Archive under initialization...</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Network Status Tiers */}
                        <section className="pt-20 border-t border-border">
                            <div className="grid sm:grid-cols-3 gap-12">
                                {[
                                    { label: 'Platform ID', ok: user?.isVerified, desc: 'Identity confirmation' },
                                    { label: 'Safety Tier', ok: profile?.parentalConsentVerified, desc: 'Governance compliance' },
                                    { label: 'Foundry Status', ok: profile?.incubatorStatus === 'accepted', desc: 'Ecosystem integration' }
                                ].map((t, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">{t.label}</span>
                                            {t.ok ? (
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                            ) : (
                                                <div className="w-3.5 h-3.5 bg-border rounded-full" />
                                            )}
                                        </div>
                                        <div>
                                            <div className={cn("text-lg font-black italic uppercase tracking-tighter mb-1", t.ok ? "text-white" : "text-foreground-muted opacity-30")}>
                                                {t.ok ? "OPERATIONAL" : "PENDING"}
                                            </div>
                                            <p className="text-[9px] font-medium text-foreground-muted uppercase tracking-widest">{t.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ProfilePage;
