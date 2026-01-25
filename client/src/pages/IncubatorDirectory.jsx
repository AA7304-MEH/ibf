import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket,
    ArrowUpRight,
    Search,
    Building2,
    LayoutGrid,
    LayoutList,
    ShieldCheck,
    Globe,
    Zap,
    Cpu,
    Sparkles
} from 'lucide-react';
import api from '../api/axios';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { cn } from '../lib/utils';

const IncubatorDirectory = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const res = await api.get('/incubator/startups');
                setStartups(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStartups();
    }, []);

    const filteredStartups = startups.filter(s =>
        s.startupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.startupPitch?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-background min-h-screen text-white pb-32">
            {/* High-Impact Header */}
            <header className="pt-40 pb-20 border-b border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[140px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="max-w-3xl space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 italic">Cohort 2024 ACTIVE</span>
                            </div>
                            <h1 className="text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
                                The Foundry <br /> <span className="text-primary not-italic">Directory.</span>
                            </h1>
                            <p className="text-xl text-foreground-muted font-medium max-w-2xl leading-relaxed italic">
                                Discover the startups leading the next wave of industrial innovation. High-potential ventures vetted by the Integrity Framework.
                            </p>
                        </div>
                        <div className="w-full lg:w-96 relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted group-focus-within:text-primary transition-colors pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Scan ventures..."
                                className="w-full pl-14 pr-6 py-4 bg-background-surface border border-border rounded-2xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-black italic uppercase tracking-widest placeholder:text-foreground-muted/40 shadow-2xl shadow-black/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} className="h-80 rounded-[2.5rem] bg-border/20" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence>
                            {filteredStartups.map((startup, idx) => (
                                <motion.div
                                    key={startup._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                                    className="h-full"
                                >
                                    <Card className="h-full group bg-background-surface/50 border-border hover:border-primary/50 p-10 flex flex-col justify-between shadow-2xl shadow-black/50 transition-all duration-500 relative overflow-hidden active:scale-[0.98]">
                                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 -rotate-12 translate-x-8 -translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 blur-2xl" />

                                        <div>
                                            <div className="flex justify-between items-start mb-12">
                                                <div className="w-16 h-16 bg-border rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-primary transition-colors duration-500">
                                                    <span className="text-2xl font-black italic text-white uppercase">{startup.startupName?.[0]}</span>
                                                </div>
                                                <Badge variant="primary" className="text-[10px] font-black uppercase tracking-[0.2em] border-none px-4 py-1.5 bg-primary/10 text-primary italic rounded-lg">
                                                    {startup.startupStage}
                                                </Badge>
                                            </div>

                                            <h3 className="text-3xl font-black text-white hover:text-primary transition-colors mb-4 uppercase tracking-tighter leading-tight italic">
                                                {startup.startupName}
                                            </h3>
                                            <p className="text-foreground-muted font-medium text-sm leading-relaxed mb-12 line-clamp-3 italic opacity-80 group-hover:opacity-100 transition-opacity">
                                                {startup.startupPitch}
                                            </p>
                                        </div>

                                        <div className="pt-10 border-t border-border flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-3 text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">
                                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Vetted Node
                                            </div>
                                            {startup.startupWebsite && (
                                                <a
                                                    href={startup.startupWebsite}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-3.5 bg-border/30 hover:bg-primary/20 rounded-xl text-foreground-muted hover:text-white transition-all border border-border group-hover:border-primary/30"
                                                >
                                                    <Globe className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {filteredStartups.length === 0 && !loading && (
                    <div className="bg-background-surface/20 border-2 border-dashed border-border rounded-[3rem] p-32 text-center">
                        <div className="w-24 h-24 bg-border/10 rounded-[2rem] shadow-sm flex items-center justify-center mx-auto mb-10 border border-border opacity-20">
                            <Building2 className="w-12 h-12 text-foreground-muted" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Venture not detected.</h3>
                        <p className="text-foreground-muted font-medium max-w-sm mx-auto mb-12 italic opacity-60 uppercase text-[10px] tracking-widest">
                            Scanning parameters yielded zero results. Adjust filtering or stand by.
                        </p>
                        <Button variant="outline" onClick={() => setSearchTerm('')} className="rounded-xl px-12 h-14 font-black uppercase tracking-widest italic border-border hover:bg-primary/20 hover:border-primary/50 text-white transition-all">
                            Reset Pulse Scan
                        </Button>
                    </div>
                )}
            </main>

            {/* Bottom Insight Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-t border-border">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-12">
                        <div className="inline-flex items-center gap-4">
                            <Badge variant="primary" className="bg-primary/10 border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full italic">Foundry Analytics</Badge>
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Scale through the <br /> <span className="text-primary not-italic">Root Network.</span></h2>
                        <p className="text-xl text-foreground-muted font-medium leading-relaxed italic max-w-xl">
                            Accepted Foundry startups get immediate integration with top engineering nodes and computational resources from enterprise partners.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'Equity Focus', val: 'Series Pre-A' },
                                { label: 'Collective Funding', val: '$42M USD+' },
                            ].map((s, i) => (
                                <div key={i} className="p-8 bg-background-surface/50 rounded-2xl border border-border group hover:border-primary/30 transition-all">
                                    <div className="text-2xl font-black text-white italic uppercase mb-2 group-hover:text-primary transition-colors">{s.val}</div>
                                    <div className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em]">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[3.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                        <Card className="bg-background-surface text-white p-16 border-border rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="relative z-10 text-center space-y-10">
                                <Rocket className="w-20 h-20 mx-auto text-primary animate-float" />
                                <div className="space-y-4">
                                    <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Cohort <br /> <span className="text-primary not-italic">2025.</span></h3>
                                    <p className="text-foreground-muted font-black uppercase tracking-[0.4em] text-[10px] italic">Telemetry open September</p>
                                </div>
                                <Button className="w-full h-20 bg-white text-background hover:brightness-90 rounded-2xl font-black uppercase tracking-widest text-xl italic shadow-2xl">Initialize Pulse</Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default IncubatorDirectory;
