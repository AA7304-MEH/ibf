import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, Variants, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Users,
    MessageSquare,
    Star,
    Github,
    Twitter,
    Linkedin,
    ArrowRight,
    ChevronRight,
    Bot,
    Sparkles,
    Target,
    Rocket,
    Shield,
    TrendingUp,
    Brain,
    ArrowUpRight,
} from 'lucide-react';
import LiveChatbot from '../components/ai/LiveChatbot';

/* ═══════════════════════════════════════════
   Particle Canvas — animated network bg
   ═══════════════════════════════════════════ */
function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const particles: {
            x: number; y: number; vx: number; vy: number; radius: number; alpha: number;
        }[] = [];

        const COUNT = 90;
        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                radius: Math.random() * 1.8 + 0.4,
                alpha: Math.random() * 0.5 + 0.15,
            });
        }

        let animId: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0,245,212,${0.055 * (1 - dist / 140)})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,245,212,${p.alpha})`;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            }

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ═══════════════════════════════════════════
   Animated Title — staggered word/char reveal
   ═══════════════════════════════════════════ */
function AnimatedTitle({ text, highlight }: { text: string; highlight?: string[] }) {
    const words = text.split(' ');
    const container: Variants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
    };
    const child: Variants = {
        hidden: { opacity: 0, y: 40, rotateX: -40 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        },
    };
    return (
        <motion.h1
            className="font-syne text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.05] tracking-tight text-white mb-8"
            variants={container}
            initial="hidden"
            animate="visible"
            style={{ perspective: '800px' }}
        >
            {words.map((word, wi) => {
                const isHighlight = highlight?.includes(word);
                return (
                    <span key={wi} className="inline-block mr-3 md:mr-4">
                        {word.split('').map((char, ci) => (
                            <motion.span
                                key={ci}
                                variants={child}
                                className={`inline-block ${isHighlight ? 'gradient-text' : ''}`}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </span>
                );
            })}
        </motion.h1>
    );
}

/* ═══════════════════════════════════════════
   Sparkles Icon SVG
   ═══════════════════════════════════════════ */
function SparklesIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1L12.5 7.5L19 10L12.5 12.5L10 19L7.5 12.5L1 10L7.5 7.5L10 1Z" fill="currentColor" />
            <path d="M19 17L19.5 19.5L22 20L19.5 20.5L19 23L18.5 20.5L16 20L18.5 19.5L19 17Z" fill="currentColor" />
            <path d="M20 3L20.5 4.5L22 5L20.5 5.5L20 7L19.5 5.5L18 5L19.5 4.5L20 3Z" fill="currentColor" />
        </svg>
    );
}

/* ═══════════════════════════════════════════
   Animated Counter — counts up on scroll
   ═══════════════════════════════════════════ */
function AnimatedCounter({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-50px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            start = Math.floor(eased * value);
            setCount(start);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [inView, value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center group"
        >
            <div className="text-5xl md:text-6xl font-syne font-black mb-2 gradient-text-teal group-hover:scale-110 transition-transform duration-300">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-muted text-sm font-medium uppercase tracking-widest">{label}</div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════
   Section Reveal Wrapper
   ═══════════════════════════════════════════ */
function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════
   Bento Box — scroll-triggered glass card
   ═══════════════════════════════════════════ */
const BentoBox = ({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02, y: -6 }}
            className={`gradient-border glass rounded-3xl p-8 hover:shadow-glow transition-all duration-400 relative overflow-hidden group ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col">{children}</div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════
   Testimonials Data
   ═══════════════════════════════════════════ */
const testimonials = [
    { name: 'Aisha K.', role: 'Founder @ NeuralHub (Fintech)', text: 'IBF found me a brilliant ML intern to audit our smart contracts. The AI matching is insanely fast.' },
    { name: 'Rahul M.', role: 'Economics Student, IIT Delhi', text: 'Secured a market research gig with a top Fintech firm. The platform made the whole process seamless.' },
    { name: 'Sara L.', role: 'Director @ GreenScale (Sustainability)', text: "Our e-commerce store needed 500 product listings verified. IBF had it done by students in 24 hours." },
    { name: 'Dev P.', role: 'Design Lead @ WellnessWave', text: 'Sourced creative talent for our social media campaigns across 10 regions from local student experts.' },
];

/* ═══════════════════════════════════════════
   How It Works Data
   ═══════════════════════════════════════════ */
const steps = [
    {
        icon: Target,
        number: '01',
        title: 'Create Your Profile',
        desc: 'Our conversational AI builds your vector profile in under 3 minutes — no boring forms.',
        color: 'teal',
    },
    {
        icon: Brain,
        number: '02',
        title: 'AI Matches You',
        desc: 'Gemini 1.5 scores multidimensional compatibility — skills, culture, pace, and ambition.',
        color: 'amber',
    },
    {
        icon: Rocket,
        number: '03',
        title: 'Start Building',
        desc: 'Get matched, onboard in minutes, and start shipping with shared dashboards and milestone tracking.',
        color: 'teal',
    },
];

/* ═══════════════════════════════════════════
   Floating Tags
   ═══════════════════════════════════════════ */
const floatingTags = [
    { label: 'Fintech', x: '8%', y: '30%', delay: 0.2 },
    { label: 'E-commerce', x: '85%', y: '25%', delay: 0.5 },
    { label: 'HealthTech', x: '12%', y: '75%', delay: 0.8 },
    { label: 'Logistics', x: '78%', y: '72%', delay: 1.1 },
    { label: 'Sustainability', x: '92%', y: '50%', delay: 0.4 },
    { label: 'EdTech', x: '5%', y: '55%', delay: 0.7 },
];

/* ═══════════════════════════════════════════
   HOME — Landing Page
   ═══════════════════════════════════════════ */
const Home: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const [navScrolled, setNavScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setNavScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen bg-navy text-white overflow-x-hidden selection:bg-teal/30 landing-scrollbar">

            {/* ===== AURORA BACKGROUND ORBS ===== */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="aurora-orb aurora-orb-1" />
                <div className="aurora-orb aurora-orb-2" />
                <div className="aurora-orb aurora-orb-3" />
            </div>

            {/* ===== NAVBAR ===== */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${
                    navScrolled
                        ? 'glass border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
                        : 'bg-transparent border-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="font-syne text-2xl font-black tracking-tighter gradient-text">IBF</span>
                        <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.2em] text-muted border border-white/10 rounded-full px-2 py-0.5">
                            Beta
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
                        <a href="#how" className="hover:text-teal transition-colors duration-300">How It Works</a>
                        <a href="#bento" className="hover:text-teal transition-colors duration-300">Features</a>
                        <a href="#testimonials" className="hover:text-teal transition-colors duration-300">Wall of Love</a>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/login">
                            <button className="btn-outline text-xs py-2.5 px-5 hidden sm:block">Log In</button>
                        </Link>
                        <Link to="/register">
                            <button className="btn-teal text-xs py-2.5 px-5 relative overflow-hidden">Get Started</button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
                <ParticleCanvas />

                {/* Floating tech tags */}
                {floatingTags.map((tag, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: tag.delay + 1.2 }}
                        className="absolute hidden lg:block"
                        style={{ left: tag.x, top: tag.y }}
                    >
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="float-tag"
                        >
                            <Sparkles className="w-3 h-3" />
                            {tag.label}
                        </motion.div>
                    </motion.div>
                ))}

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-10"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="inline-flex items-center gap-2 glass-teal rounded-full px-5 py-2.5 text-teal text-sm font-bold mb-10 border border-teal/30 shadow-[0_0_25px_rgba(0,245,212,0.15)]"
                    >
                        <SparklesIcon /> Next-Gen Startup × Talent Matching
                    </motion.div>

                    <AnimatedTitle text="Where Visionaries Meet Prodigies" highlight={['Visionaries', 'Prodigies']} />

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="text-muted text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light mb-14"
                    >
                        The world&apos;s first platform utilizing <span className="text-white font-medium">AI contextual matching</span> to connect
                        diverse businesses — from <span className="text-teal font-semibold">Fintech to E-commerce</span> — with elite student talent for high-impact micro-tasks.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center items-center"
                    >
                        <Link to="/register" className="w-full sm:w-auto">
                            <button className="btn-teal w-full sm:w-auto text-lg py-4 px-10 flex items-center justify-center gap-3 group relative overflow-hidden">
                                <span className="relative z-10 flex items-center gap-3">
                                    I&apos;m a Founder <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </Link>
                        <Link to="/register" className="w-full sm:w-auto">
                            <button className="btn-amber w-full sm:w-auto text-lg py-4 px-10 flex items-center justify-center gap-3 group relative overflow-hidden">
                                <span className="relative z-10 flex items-center gap-3">
                                    I&apos;m a Student <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </Link>
                    </motion.div>

                    {/* Social proof bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6, duration: 0.8 }}
                        className="mt-16 flex flex-wrap items-center justify-center gap-6 text-muted text-xs"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {['bg-teal', 'bg-amber', 'bg-teal/70', 'bg-amber/70'].map((bg, i) => (
                                    <div key={i} className={`w-7 h-7 rounded-full ${bg} border-2 border-navy flex items-center justify-center text-[9px] font-bold text-navy`}>
                                        {['A', 'R', 'S', 'D'][i]}
                                    </div>
                                ))}
                            </div>
                            <span>500+ active users</span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-1.5">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber text-amber" />)}
                            <span className="ml-1">4.9/5 rating</span>
                        </div>
                        <div className="w-px h-4 bg-white/10 hidden sm:block" />
                        <div className="flex items-center gap-1.5 hidden sm:flex">
                            <Shield className="w-3.5 h-3.5 text-teal" />
                            <span>SOC 2 Compliant</span>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ===== STATS COUNTER SECTION ===== */}
            <section className="relative z-20 py-20 border-t border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        <AnimatedCounter value={98} suffix="%" label="Match Rate" />
                        <AnimatedCounter value={48} suffix="h" label="Avg. Match Time" />
                        <AnimatedCounter value={1200} suffix="+" label="Tasks Managed" />
                        <AnimatedCounter value={500} suffix="+" label="Businesses Onboarded" />
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section id="how" className="py-32 relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <RevealSection className="text-center mb-20">
                        <span className="inline-flex items-center gap-2 glass-teal rounded-full px-4 py-1.5 text-teal text-xs font-bold mb-6 border border-teal/20">
                            <Sparkles className="w-3 h-3" /> Simple Process
                        </span>
                        <h2 className="font-syne text-4xl md:text-5xl font-bold mb-5">How It Works</h2>
                        <p className="text-muted text-lg max-w-xl mx-auto">
                            Three steps to finding your perfect match. No bureaucracy, no friction.
                        </p>
                    </RevealSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                        {/* Connecting line (desktop only) */}
                        <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-teal/20 to-transparent" />

                        {steps.map((step, i) => (
                            <RevealSection key={i} delay={i * 0.15}>
                                <div className="gradient-border glass rounded-3xl p-8 text-center group hover:shadow-glow transition-all duration-400 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                                    <div className="relative z-10">
                                        <div className="relative mx-auto w-16 h-16 mb-6">
                                            <div
                                                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                                                    step.color === 'teal' ? 'teal-glow text-teal' : 'amber-glow text-amber'
                                                } group-hover:scale-110 transition-transform duration-300`}
                                            >
                                                <step.icon className="w-7 h-7" />
                                            </div>
                                            <span className="absolute -top-2 -right-2 text-[10px] font-syne font-black text-white/20 text-lg">
                                                {step.number}
                                            </span>
                                        </div>
                                        <h3 className="font-syne text-xl font-bold mb-3">{step.title}</h3>
                                        <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            </RevealSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== BENTO GRID SECTION ===== */}
            <section id="bento" className="py-32 relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <RevealSection className="text-center mb-20">
                        <span className="inline-flex items-center gap-2 glass-teal rounded-full px-4 py-1.5 text-teal text-xs font-bold mb-6 border border-teal/20">
                            <Zap className="w-3 h-3" /> Core Features
                        </span>
                        <h2 className="font-syne text-4xl md:text-5xl font-bold mb-5">Built for Scale &amp; Speed</h2>
                        <p className="text-muted text-lg max-w-xl mx-auto">
                            Everything you need to hire, onboard, and build incredibly fast — powered by our custom RAG engine.
                        </p>
                    </RevealSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
                        {/* Bento 1: Large Span-2 — AI Matching */}
                        <BentoBox className="md:col-span-2 overflow-hidden" delay={0.1}>
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="flex-1 flex flex-col justify-center pr-8 z-10">
                                    <div className="w-12 h-12 rounded-2xl teal-glow text-teal flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-syne text-3xl font-bold mb-3">Hyper-Accurate AI Matching</h3>
                                    <p className="text-muted leading-relaxed">
                                        Gemini 1.5 powers our multidimensional compatibility scoring. We don&apos;t just match skills — we match culture, pace, and ambition.
                                    </p>
                                </div>
                                {/* Visual Mockup */}
                                <div className="flex-1 relative mt-8 md:mt-0 flex items-center justify-center">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal/20 rounded-full blur-3xl pointer-events-none" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                        className="relative w-48 h-48 rounded-full border-2 border-dashed border-teal/30 flex items-center justify-center"
                                    >
                                        <div
                                            className="absolute inset-2 rounded-full border border-amber/20 border-t-amber animate-spin"
                                            style={{ animationDuration: '3s' }}
                                        />
                                        <div
                                            className="absolute inset-6 rounded-full border border-teal/10 border-b-teal/40 animate-spin"
                                            style={{ animationDuration: '5s', animationDirection: 'reverse' }}
                                        />
                                    </motion.div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                        <span className="text-5xl font-syne font-black text-teal drop-shadow-[0_0_20px_rgba(0,245,212,0.6)]">98%</span>
                                        <p className="text-[10px] text-white font-bold uppercase tracking-[0.2em] mt-1">Match Rate</p>
                                    </div>
                                </div>
                            </div>
                        </BentoBox>

                        {/* Bento 2: Chatbot */}
                        <BentoBox delay={0.2}>
                            <div className="w-12 h-12 rounded-2xl amber-glow text-amber flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="font-syne text-2xl font-bold mb-3">Contextual AI Coach</h3>
                            <p className="text-muted text-sm mb-6">
                                Your personal RAG-powered chatbot knows your exact profile, goals, and history.
                            </p>

                            <div className="glass-teal p-4 rounded-xl border border-teal/20 shimmer-line">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="pulse-ring relative">
                                        <Bot className="w-4 h-4 text-teal relative z-10" />
                                    </div>
                                    <span className="text-xs font-bold text-white ml-2">IBF Advisor</span>
                                </div>
                                <p className="text-xs text-muted leading-relaxed">
                                    &quot;Based on your seed stage, I highly recommend looking at students with full-stack React experience.&quot;
                                </p>
                            </div>
                        </BentoBox>

                        {/* Bento 3: Smart Onboarding */}
                        <BentoBox delay={0.3}>
                            <div className="h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl teal-glow text-teal flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="font-syne text-2xl font-bold mb-3">Conversational Onboarding</h3>
                                <p className="text-muted text-sm leading-relaxed">
                                    No boring forms. Our 5-step interactive chat gathers deep context effortlessly to build your unique vector profile.
                                </p>

                                {/* Mini progress dots */}
                                <div className="flex items-center gap-2 mt-5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s <= 3 ? 'bg-teal w-8' : 'bg-white/10 w-4'}`} />
                                    ))}
                                    <span className="text-[10px] text-muted ml-2">Step 3/5</span>
                                </div>
                            </div>
                        </BentoBox>

                        {/* Bento 4: Progress / Timeline Span-2 */}
                        <BentoBox className="md:col-span-2 overflow-hidden" delay={0.4}>
                            <div className="flex flex-col md:flex-row h-full gap-8">
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="font-syne text-3xl font-bold mb-3">Track Milestones</h3>
                                    <p className="text-muted leading-relaxed">
                                        Once matched, our platform provides a shared dashboard to track internship progress, weekly goals, and equity vesting schedules automatically.
                                    </p>
                                    <div className="flex items-center gap-3 mt-6">
                                        <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '65%' }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                                                className="h-full bg-gradient-to-r from-teal to-amber rounded-full"
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-teal">65%</span>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col justify-center space-y-4 pr-4">
                                    {[
                                        { title: 'Onboarding Week', status: 'Done', color: 'teal' },
                                        { title: 'Core Feature Dev', status: 'In Progress', color: 'amber' },
                                        { title: 'MVP Launch', status: 'Upcoming', color: 'navy' },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5 + i * 0.15 }}
                                            className="flex items-center gap-4"
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{
                                                    backgroundColor:
                                                        item.color === 'teal' ? '#00f5d4' : item.color === 'amber' ? '#ffbe0b' : '#1a2744',
                                                    boxShadow:
                                                        item.color === 'teal'
                                                            ? '0 0 12px rgba(0,245,212,0.5)'
                                                            : item.color === 'amber'
                                                                ? '0 0 12px rgba(255,190,11,0.5)'
                                                                : 'none',
                                                }}
                                            />
                                            <div className="flex-1 glass p-3 rounded-lg border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                                                <span className="text-sm font-bold">{item.title}</span>
                                                <span
                                                    className="text-[10px] uppercase font-bold tracking-wider"
                                                    style={{
                                                        color:
                                                            item.color === 'teal' ? '#00f5d4' : item.color === 'amber' ? '#ffbe0b' : '#8b97b3',
                                                    }}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </BentoBox>
                    </div>
                </div>
            </section>

            {/* ===== INFINITE SCROLL TESTIMONIALS ===== */}
            <section id="testimonials" className="py-32 border-t border-white/5 relative z-20">
                <RevealSection className="max-w-7xl mx-auto px-6 mb-16 text-center">
                    <span className="inline-flex items-center gap-2 glass-teal rounded-full px-4 py-1.5 text-teal text-xs font-bold mb-6 border border-teal/20">
                        <Star className="w-3 h-3 fill-teal" /> Social Proof
                    </span>
                    <h2 className="font-syne text-4xl md:text-5xl font-bold">Trusted by Thousands</h2>
                </RevealSection>

                <div className="relative flex overflow-x-hidden">
                    <div className="animate-marquee whitespace-nowrap flex items-center gap-6 py-4">
                        {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                            <div
                                key={i}
                                className="gradient-border glass rounded-2xl p-8 w-[400px] flex-shrink-0 hover:shadow-glow transition-all duration-300 group"
                            >
                                <div className="relative z-10">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, si) => (
                                            <Star key={si} className="w-4 h-4 fill-amber text-amber" />
                                        ))}
                                    </div>
                                    <p className="text-muted text-base leading-relaxed mb-6 whitespace-normal h-20 group-hover:text-white/70 transition-colors">
                                        &quot;{t.text}&quot;
                                    </p>
                                    <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-amber/80 flex items-center justify-center text-navy font-bold text-sm shadow-[0_0_15px_rgba(0,245,212,0.3)]">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-bold">{t.name}</p>
                                            <p className="text-muted text-xs">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Gradient Edges */}
                    <div className="absolute top-0 bottom-0 left-0 w-40 bg-gradient-to-r from-navy to-transparent z-10" />
                    <div className="absolute top-0 bottom-0 right-0 w-40 bg-gradient-to-l from-navy to-transparent z-10" />
                </div>
            </section>

            {/* ===== CTA FOOTER ===== */}
            <footer className="relative pt-32 pb-16 overflow-hidden border-t border-white/5 z-20">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-teal/5 rounded-t-[100%] blur-[100px] pointer-events-none" />
                <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-amber/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <RevealSection>
                        <span className="inline-flex items-center gap-2 glass-teal rounded-full px-4 py-1.5 text-teal text-xs font-bold mb-8 border border-teal/20">
                            <Rocket className="w-3 h-3" /> Ready to Launch?
                        </span>
                        <h2 className="font-syne text-5xl md:text-7xl font-black mb-4">
                            Begin Your <span className="gradient-text">Journey</span>
                        </h2>
                        <p className="text-muted text-lg mb-12 max-w-lg mx-auto">
                            Join hundreds of founders and students already building the future together.
                        </p>
                    </RevealSection>

                    <RevealSection delay={0.2} className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-32">
                        <Link to="/register">
                            <button className="btn-teal py-4 px-10 text-lg flex items-center gap-3 group relative overflow-hidden">
                                <span className="relative z-10 flex items-center gap-3">
                                    Post a Role <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </span>
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="btn-amber py-4 px-10 text-lg flex items-center gap-3 group relative overflow-hidden">
                                <span className="relative z-10 flex items-center gap-3">
                                    Find a Startup <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </span>
                            </button>
                        </Link>
                    </RevealSection>

                    <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-6">
                        <span className="font-syne text-xl font-bold gradient-text">IBF</span>
                        <p className="text-muted text-sm px-4 text-center">
                            © 2026 Innovator Bridge Foundry. Engineered with passion &amp; Framer Motion.
                        </p>
                        <div className="flex gap-3">
                            {[Github, Twitter, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/60 hover:text-teal hover:border-teal/50 hover:shadow-[0_0_15px_rgba(0,245,212,0.2)] transition-all duration-300"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Home;
