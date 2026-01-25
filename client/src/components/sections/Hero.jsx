import React from 'react';
import Container from '../ui/Container';
import Button from '../ui/Button';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background-dark">
            {/* Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />

            <Container className="relative z-10 text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                    Learn by doing. <br className="hidden md:block" />
                    <span className="text-primary-500">Build the future.</span>
                </h1>

                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
                    SkillBridge connects high-performance student talent with visionary founders to build real-world micro-internships and startup missions.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="primary" className="w-full sm:w-auto px-8 py-4 text-lg">
                        Join SkillBridge
                    </Button>
                    <Button variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg">
                        Browse Missions
                    </Button>
                </div>
            </Container>
        </section>
    );
};

export default Hero;
