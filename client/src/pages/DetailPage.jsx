import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    Share2,
    MoreHorizontal,
    Briefcase,
    Users,
    Zap,
    ShieldCheck,
    Clock,
    Tag,
    ArrowRight,
    Cpu,
    Target,
    BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { cn } from '../lib/utils';

const DetailPage = ({
    title = "High-Performance React Architect Content Creator",
    type = "General",
    description = "We are seeking a visionary developer to lead the architectural redesign of our flagship platform. This mission requires deep knowledge of React performance patterns, micro-interactions, and high-contrast accessibility standards.",
    postedBy = "Linear Team",
    duration = "3 Months",
    skills = ["React", "Motion", "Tailwind", "Design Systems"],
    onApply = () => { }
}) => {
    const navigate = useNavigate();

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <div className="bg-background min-h-screen pt-40 pb-32 text-white overflow-x-hidden selection:bg-primary/30 selection:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em] mb-16 hover:text-white transition-all group italic"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to grid scan
                </button>

                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Main Content (2/3) */}
                    <div className="flex-1 space-y-20">
                        <motion.div {...fadeIn}>
                            <div className="flex items-center gap-4 mb-8">
                                <Badge variant="primary" className="uppercase tracking-[0.2em] text-[10px] font-black border-none px-6 py-2 bg-primary/10 text-primary italic rounded-lg">
                                    {type} MISSION
                                </Badge>
                                <div className="h-1 w-1 bg-border rounded-full" />
                                <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] italic">Open Node Transition</span>
                            </div>
                            <h1 className="text-6xl lg:text-7xl font-black text-white tracking-tighter mb-12 leading-none uppercase italic">
                                {title}
                            </h1>
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-background-surface border border-border rounded-2xl flex items-center justify-center text-white font-black italic text-xl shadow-2xl">
                                    {postedBy[0]}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-black text-white leading-none uppercase italic tracking-tighter">{postedBy}</p>
                                    <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em]">Operational Origin</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="space-y-12">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none pb-4 border-b border-border/50">Mission Protocols</h3>
                                <p className="text-foreground-muted font-medium leading-relaxed text-xl italic opacity-90 max-w-3xl">
                                    {description}
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <Card className="p-10 bg-background-surface/50 border-border group hover:border-primary/30 transition-all duration-500 shadow-2xl">
                                    <h4 className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em] mb-8 italic">Key Functional Reqs</h4>
                                    <ul className="space-y-5">
                                        {['Architect modular logic blocks', 'Deploy industrial-grade security', 'Optimize runtime latency'].map((item, i) => (
                                            <li key={i} className="flex items-start gap-4 text-sm font-black italic uppercase tracking-tight text-white/90">
                                                <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                                <Card className="p-10 bg-background-surface/50 border-border group hover:border-primary/30 transition-all duration-500 shadow-2xl">
                                    <h4 className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em] mb-8 italic">Outcome Telemetry</h4>
                                    <p className="text-sm font-medium text-foreground-muted leading-relaxed italic uppercase tracking-tight">
                                        Successful deployment results in a high-fidelity industrial framework and privileged access to future premium missions.
                                    </p>
                                </Card>
                            </div>
                        </motion.div>

                        <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none mb-10">Expertise Stack</h3>
                            <div className="flex flex-wrap gap-4">
                                {skills.map(skill => (
                                    <div key={skill} className="px-8 py-4 bg-background-surface border border-border rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] italic shadow-2xl flex items-center gap-3 hover:border-primary/50 transition-all cursor-default group">
                                        <Tag className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" /> {skill}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Actions (1/3) */}
                    <aside className="w-full lg:w-96 shrink-0">
                        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="sticky top-40 space-y-8">
                            <Card className="p-10 bg-background-surface border-border shadow-indigo-glow-subtle space-y-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-border/50 text-primary rounded-xl flex items-center justify-center shadow-lg">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em] italic">Cycle Time</span>
                                        </div>
                                        <span className="text-sm font-black text-white uppercase italic tracking-tighter">{duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-border/50 text-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em] italic">Integrity Vetted</span>
                                        </div>
                                        <Badge variant="success" className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] uppercase font-black px-4 py-1 italic rounded-lg">High Trust</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-border/50 text-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                                                <BarChart3 className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em] italic">Density</span>
                                        </div>
                                        <span className="text-sm font-black text-white uppercase italic tracking-tighter">02 Units</span>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-border space-y-4 relative z-10">
                                    <Button onClick={onApply} className="w-full h-16 bg-primary text-white hover:brightness-110 rounded-2xl font-black text-lg uppercase tracking-widest italic shadow-indigo-glow transition-all">
                                        Execute Mission
                                    </Button>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 h-12 rounded-xl border-border hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest italic transition-all">
                                            <Share2 className="w-4 h-4 mr-2" /> Broadcast
                                        </Button>
                                        <Button variant="outline" className="w-12 h-12 rounded-xl p-0 border-border hover:bg-white/10 text-white transition-all">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <div className="bg-background-surface/30 rounded-[2.5rem] p-10 border border-border shadow-2xl">
                                <h5 className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] mb-6 italic">Safety Protocols [V1.2]</h5>
                                <p className="text-xs font-medium text-foreground-muted leading-relaxed mb-8 italic opacity-80 uppercase tracking-tight">
                                    All transmissions on SolvEarn adhere to strict industrial IP standards. Ensure your identity node is verified before initialization.
                                </p>
                                <Button variant="ghost" className="w-full text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-white/5 rounded-xl h-12 border border-border transition-all">
                                    Access Security Matrix <ArrowRight className="w-3.5 h-3.5 ml-3" />
                                </Button>
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
