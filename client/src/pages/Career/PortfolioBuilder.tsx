import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { PrinterIcon, ShareIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';

const PortfolioBuilder: React.FC = () => {
    const { user } = useAuth();

    // Mock Student Data (Fallback) with Dynamic User Override
    const student = {
        name: (user as any)?.firstName ? `${(user as any).firstName} ${(user as any).lastName || ''}` : "Ashwin M.",
        role: "Aspiring Full Stack Developer",
        bio: (user as any)?.bio || "Passionate about building scalable web applications and solving real-world problems through code. Currently mastering React and Node.js.",
        skills: (user as any)?.skills?.map((s: any) => s.name) || ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS"],
        badges: [
            { id: 1, name: "First Builder", icon: "🔨" },
            { id: 2, name: "Bug Hunter", icon: "🐛" },
            { id: 3, name: "Team Player", icon: "🤝" }
        ],
        projects: [
            {
                title: "SkillBridge Ecosystem",
                desc: "Built a comprehensive ed-tech platform with AI matching and wellbeing tracking.",
                tech: "MERN Stack"
            },
            {
                title: "Climate Viz",
                desc: "Interactive data visualization dashboard for climate change metrics.",
                tech: "D3.js, Python"
            }
        ]
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8 no-print">
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Builder</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={() => alert("Connecting to LinkedIn API... (Demo Mode)")}
                        className="flex items-center px-4 py-2 bg-[#0077b5] rounded-lg text-sm font-medium text-white hover:bg-[#006097] shadow-sm"
                    >
                        <span className="mr-2">in</span> Export to Profile
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                    >
                        <PrinterIcon className="w-4 h-4 mr-2" />
                        Export PDF
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
                        <ShareIcon className="w-4 h-4 mr-2" />
                        Share Public Link
                    </button>
                </div>
            </div>

            {/* Resume / Portfolio Layout */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl font-bold mb-2">{student.name}</h2>
                            <p className="text-xl text-blue-100 font-light">{student.role}</p>
                        </div>
                        <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl border-2 border-white/50">
                            👨‍💻
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Bio */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">About Me</h3>
                            <p className="text-gray-600 leading-relaxed">{student.bio}</p>
                        </section>

                        {/* Projects */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Featured Projects</h3>
                            <div className="space-y-6">
                                {student.projects.map((p, i) => (
                                    <div key={i} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-900">{p.title}</h4>
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded font-medium">{p.tech}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{p.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Skills */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Top Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {student.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Badges */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Achievements</h3>
                            <div className="space-y-3">
                                {student.badges.map(badge => (
                                    <div key={badge.id} className="flex items-center space-x-3 text-gray-700">
                                        <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-full text-lg">
                                            {badge.icon}
                                        </div>
                                        <span className="font-medium">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Verified Status */}
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-center">
                            <CheckBadgeIcon className="w-10 h-10 text-green-500 mx-auto mb-2" />
                            <p className="text-green-800 font-bold text-sm">IBF Verified Student</p>
                            <p className="text-green-600 text-xs">Member since 2026</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PortfolioBuilder;
