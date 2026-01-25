import React from 'react';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    BookOpen,
    Clock,
    Search,
    UserCheck,
    Briefcase,
    ArrowRight,
    Sparkles,
    ChevronDown,
    Shield
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const StudentDashboard = ({ data }) => {
    return (
        <div className="space-y-12">
            {/* Safety/Onboarding Banner */}
            {!data?.profile?.parentalConsentVerified && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-10 bg-amber-500/10 rounded-[2.5rem] border border-amber-500/20 flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-amber-500/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px]" />
                    <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 relative z-10">
                        <Shield className="w-8 h-8 text-amber-500" />
                    </div>
                    <div className="flex-1 text-center md:text-left relative z-10">
                        <h3 className="text-xl font-black text-amber-500 uppercase italic tracking-tighter mb-2">Consent Transmission Pending</h3>
                        <p className="text-foreground-muted font-medium leading-relaxed max-w-2xl">
                            We've dispatched a secure verification node to your guardian's email. Application protocols will initialize upon confirmation. Synchronize your profile in the meantime.
                        </p>
                    </div>
                    <Button variant="outline" className="text-amber-500 border-amber-500/30 hover:bg-amber-500/20 rounded-xl px-8 h-12 font-black uppercase tracking-tight relative z-10">
                        Repatch Transmission
                    </Button>
                </motion.div>
            )}

            {/* Stats & Context Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card glow className="flex flex-col justify-between p-10 bg-background-surface/50 border-border hover:scale-[1.02] transition-all duration-300">
                    <div className="w-14 h-14 bg-border/50 rounded-2xl flex items-center justify-center text-primary mb-12 border border-border group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Clock className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] mb-1">Applications Sent</p>
                        <h3 className="text-4xl font-black text-white italic tracking-tighter">{data?.stats?.applicationsCount || 0}</h3>
                    </div>
                </Card>

                <Card className="p-10 bg-background-surface border-border">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-border/50 border border-border rounded-2xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-foreground-muted" />
                        </div>
                        <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Academic Node</h4>
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center py-4 border-b border-border">
                            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">Institution</span>
                            <span className="text-sm font-black text-white uppercase italic tracking-tight">{data?.profile?.school || 'Unspecified'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">Tier Verification</span>
                            <Badge variant={data?.profile?.parentalConsentVerified ? 'success' : 'warning'} className="text-[10px] font-black uppercase italic px-4 py-1.5 rounded-lg border-none">
                                {data?.profile?.parentalConsentVerified ? 'Verified' : 'Pending'}
                            </Badge>
                        </div>
                    </div>
                </Card>

                <Card className="bg-background-surface border-border p-10 border flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
                        <Search className="w-48 h-48" />
                    </div>
                    <div className="relative z-10">
                        <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4 leading-[1.1]">Explore <br /> Micro-Missions.</h4>
                        <p className="text-foreground-muted text-sm font-medium mb-10 max-w-[200px] leading-relaxed">Build real-world proof of capability with founders.</p>
                        <RouterLink to="/skillswap/projects">
                            <Button
                                className="w-full bg-white text-background hover:brightness-90 rounded-2xl h-14 font-black uppercase tracking-tight italic"
                                disabled={!data?.profile?.parentalConsentVerified}
                            >
                                <Search className="w-4 h-4 mr-2" /> Find Missions
                            </Button>
                        </RouterLink>
                    </div>
                </Card>
            </div>

            {/* Applications Feed */}
            <div className="space-y-10 pb-20">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Protocol Feed</h2>
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">Transmission history of operational interest</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {data?.applications?.map((app, idx) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="p-8 bg-background-surface/50 border-border group hover:border-primary/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 transition-all duration-500">
                                <div className="flex items-center gap-8">
                                    <div className="w-14 h-14 bg-border/50 border border-border rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl">
                                        <Briefcase className="w-7 h-7 text-foreground-muted group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2 group-hover:text-primary transition-colors leading-tight">
                                            {app.projectId?.title}
                                        </h3>
                                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted">
                                            <span className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" /> {new Date(app.appliedAt).toLocaleDateString()}
                                            </span>
                                            <div className="w-1 h-1 bg-border rounded-full" />
                                            <span className="text-primary italic">SkillSwap Mission</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-10 w-full md:w-auto">
                                    <div className="hidden lg:block max-w-[200px]">
                                        <p className="text-[9px] font-black text-foreground-muted uppercase tracking-widest mb-1.5 px-1">Pitch Metadata</p>
                                        <p className="text-sm text-foreground-muted italic font-medium truncate opacity-60">"{app.message}"</p>
                                    </div>
                                    <div className="flex-1 md:flex-none flex justify-end">
                                        <Badge variant={
                                            app.status === 'accepted' ? 'success' :
                                                app.status === 'rejected' ? 'error' : 'warning'
                                        } className="px-6 py-1.5 text-[10px] font-black tracking-widest uppercase italic border-none rounded-lg">
                                            {app.status}
                                        </Badge>
                                    </div>
                                    <button className="p-3.5 bg-border/20 hover:bg-border/40 rounded-xl text-foreground-muted hover:text-white transition-all">
                                        <ChevronDown className="w-6 h-6" />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {(!data?.applications || data.applications.length === 0) && (
                        <div className="bg-background-surface/20 border-2 border-dashed border-border rounded-[3rem] p-24 text-center">
                            <div className="w-24 h-24 bg-border/10 rounded-2xl shadow-2xl flex items-center justify-center mx-auto mb-10 border border-border">
                                <Search className="w-12 h-12 text-foreground-muted" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">No Active Protocols.</h3>
                            <p className="text-foreground-muted font-medium max-w-sm mx-auto mb-12 leading-relaxed">
                                You haven't sent any mission applications yet. Browse the operational marketplace to start building your record.
                            </p>
                            <RouterLink to="/skillswap/projects">
                                <Button className="bg-primary text-white px-12 h-16 rounded-2xl font-black uppercase tracking-tight italic shadow-indigo-glow">
                                    Browse Opportunities
                                </Button>
                            </RouterLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
