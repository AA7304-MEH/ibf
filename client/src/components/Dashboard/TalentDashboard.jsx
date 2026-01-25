import React from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Mail,
    ArrowRight,
    ChevronRight,
    Search,
    UserCheck,
    Clock,
    Star,
    Layout,
    Zap
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const TalentDashboard = ({ data }) => {
    return (
        <div className="space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card glow className="p-8 h-full flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 bg-background-surface/50 border-border shadow-2xl shadow-black/50">
                    <div className="w-14 h-14 bg-border rounded-2xl flex items-center justify-center text-primary mb-10 border border-border group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] mb-2 font-black">Transmission Requests</p>
                        <h3 className="text-4xl font-black text-white italic tracking-tighter">{data?.stats?.applicationsCount || 0}</h3>
                    </div>
                </Card>

                <Card className="col-span-1 md:col-span-2 p-10 bg-background-surface border-border overflow-hidden relative group">
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-border/50 rounded-2xl flex items-center justify-center text-primary border border-border group-hover:border-primary/50 transition-colors duration-500">
                                <UserCheck className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">Expertise Node</h4>
                                <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">Verified Technical Telemetry</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data?.profile?.skills?.map(skill => (
                                <Badge key={skill} variant="primary" className="text-[10px] px-4 py-1.5 font-black uppercase tracking-widest italic rounded-lg border-none bg-primary/10 text-primary">
                                    {skill}
                                </Badge>
                            ))}
                            {(!data?.profile?.skills || data.profile.skills.length === 0) && (
                                <span className="text-xs font-bold text-foreground-muted uppercase italic tracking-widest">No nodes added</span>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Applications List */}
            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Operational Missions</h2>
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">Active contribution tracking protocol</p>
                    </div>
                    <RouterLink to="/collab">
                        <Button variant="outline" size="sm" className="rounded-xl px-6 h-11 font-black uppercase tracking-tight text-xs border-border hover:bg-border/30">
                            <Search className="w-4 h-4 mr-2" /> Scan Marketplace
                        </Button>
                    </RouterLink>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {data?.applications?.map((app, idx) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="p-8 bg-background-surface/50 border-border group hover:border-primary/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 transition-all duration-300">
                                <div className="flex items-center gap-8">
                                    <div className="w-14 h-14 bg-border/50 rounded-2xl flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <Zap className="w-7 h-7 text-foreground-muted group-hover:text-white transition-colors" />
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
                                            <span className="flex items-center gap-2 text-primary">
                                                <Star className="w-3.5 h-3.5" /> High Urgency
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12 w-full md:w-auto mt-6 md:mt-0">
                                    <div className="flex flex-col items-end">
                                        <Badge variant={
                                            app.status === 'accepted' ? 'success' :
                                                app.status === 'rejected' ? 'error' : 'warning'
                                        } className="px-6 py-1.5 text-[10px] uppercase font-black tracking-widest italic mb-2 border-none rounded-lg">
                                            {app.status}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-primary/30">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                                        </div>
                                    </div>
                                    <button className="p-3.5 bg-border/20 hover:bg-primary/20 rounded-xl text-foreground-muted hover:text-white transition-all border border-border hover:border-primary/30">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {(!data?.applications || data.applications.length === 0) && (
                        <div className="bg-background-surface/20 border-2 border-dashed border-border rounded-[3rem] p-24 text-center">
                            <div className="w-24 h-24 bg-border/10 rounded-2xl flex items-center justify-center mx-auto mb-10 text-foreground-muted border border-border">
                                <Search className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">No Active Protocols.</h3>
                            <p className="text-foreground-muted font-medium max-w-sm mx-auto mb-12 leading-relaxed">
                                Your contribution history is currently clear. Access the marketplace to initialize your first mission integration.
                            </p>
                            <RouterLink to="/collab">
                                <Button className="bg-primary text-white px-12 h-16 rounded-2xl font-black uppercase tracking-tight text-sm italic shadow-indigo-glow">
                                    Initiate Transmission
                                </Button>
                            </RouterLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TalentDashboard;
