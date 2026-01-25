import React from 'react';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import { Layout, ShieldCheck, Globe } from 'lucide-react';

const Features = () => {
    const features = [
        {
            title: "Project Marketplace",
            description: "Browse micro-internships from validated startup founders.",
            icon: <Layout className="w-8 h-8 text-primary-500 mb-4" />
        },
        {
            title: "Verified Profiles",
            description: "Build an immutable record of your skills and project history.",
            icon: <ShieldCheck className="w-8 h-8 text-secondary-500 mb-4" />
        },
        {
            title: "Global Directory",
            description: "Connect with a diverse network of student builders and innovators.",
            icon: <Globe className="w-8 h-8 text-success mb-4" />
        }
    ];

    return (
        <section className="py-24 bg-background-dark relative">
            <Container>
                <SectionTitle
                    title="Designed for real-world impact."
                    subtitle="A unified ecosystem for project discovery, talent vetting, and seamless collaboration."
                    centered
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="h-full">
                            {feature.icon}
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                {feature.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Features;
