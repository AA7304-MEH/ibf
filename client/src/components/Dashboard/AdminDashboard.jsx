import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Users,
    Briefcase,
    ShieldCheck,
    ArrowUpRight,
    Search,
    Zap,
    Cpu
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const AdminDashboard = ({ data }) => {
    const stats = [
        { label: 'Integrations Review', value: data?.stats?.pendingStartups || 0, sub: 'Pending approval nodes', icon: <Cpu className="w-5 h-5 text-primary" /> },
        { label: 'Ecosystem Scale', value: data?.stats?.totalUsers || 0, sub: 'Total subnet members', icon: <Users className="w-5 h-5 text-purple-500" /> },
        { label: 'Active Missions', value: data?.stats?.totalProjects || 0, sub: 'Operational nodes', icon: <Zap className="w-5 h-5 text-emerald-500" /> },
    ];

    return (
        <div className="space-y-12">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-10 bg-background-surface/50 border-border flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300">
                        <div className="flex justify-between items-start mb-12">
                            <div className="w-14 h-14 bg-border/50 border border-border rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                {stat.icon}
                            </div>
                            <Badge variant="primary" className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg italic font-black">
                                Real-time
                            </Badge>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter mb-2">{stat.value}</h3>
                            <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest opacity-50">{stat.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Management Portal Link */}
            <section>
                <Card className="bg-background-surface border-border p-16 border rounded-[3rem] shadow-2xl shadow-indigo-500/5 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="max-w-2xl text-center lg:text-left">
                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full mb-10">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Governance Root</span>
                            </div>
                            <h2 className="text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-tight">Control <br /> <span className="text-primary not-italic underline decoration-indigo-500/30 underline-offset-[12px]">Framework.</span></h2>
                            <p className="text-lg text-foreground-muted font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Access the root command center to verify integration nodes, manage mission safety tiers, and oversee platform-wide operational flows.
                            </p>
                        </div>
                        <div className="w-full lg:w-auto">
                            <RouterLink to="/admin">
                                <Button className="w-full lg:w-80 h-20 bg-white text-background hover:brightness-90 rounded-2xl font-black uppercase tracking-widest text-xl italic shadow-2xl group-hover:scale-105 transition-all">
                                    Execute Logs <ArrowUpRight className="w-7 h-7 ml-4" />
                                </Button>
                            </RouterLink>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default AdminDashboard;
