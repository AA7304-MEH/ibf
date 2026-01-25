import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SkillGalaxy: React.FC = () => {
    // Mock Skill DNA Data
    const skills = [
        { name: 'React', level: 85, category: 'frontend', x: 200, y: 150, size: 60, color: '#60A5FA' },
        { name: 'Node.js', level: 70, category: 'backend', x: 500, y: 200, size: 50, color: '#34D399' },
        { name: 'Design', level: 90, category: 'design', x: 350, y: 350, size: 70, color: '#F472B6' },
        { name: 'Python', level: 40, category: 'backend', x: 600, y: 100, size: 30, color: '#FBBF24' },
        { name: 'TypeScript', level: 75, category: 'frontend', x: 300, y: 100, size: 55, color: '#818CF8' },
        { name: 'CSS', level: 95, category: 'frontend', x: 150, y: 300, size: 80, color: '#60A5FA' },
    ];

    const [hoveredSkill, setHoveredSkill] = useState<any>(null);

    return (
        <div className="min-h-screen bg-gray-900 overflow-hidden relative font-sans text-white">
            {/* Background Stars */}
            <div className="absolute inset-0 z-0">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full opacity-20 animate-pulse"
                        style={{
                            width: Math.random() * 3 + 'px',
                            height: Math.random() * 3 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDuration: Math.random() * 3 + 2 + 's'
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pointer-events-none">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            My Skill Galaxy
                        </h1>
                        <p className="text-gray-400 mt-2 text-xl">Visualizing your competence DNA in the SkillBridge Universe.</p>
                    </div>

                    {/* Gamified Avatar */}
                    <div className="flex items-center bg-gray-800/80 p-3 rounded-2xl border border-gray-700 backdrop-blur">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl mr-3 shadow-lg ring-2 ring-indigo-400">
                            🧑‍🚀
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Avatar</p>
                            <p className="text-white font-bold">Level 3: Explorer</p>
                        </div>
                    </div>
                </header>

                <div className="relative h-[600px] w-full border border-gray-800 rounded-3xl bg-gray-900/50 backdrop-blur-sm pointer-events-auto shadow-2xl overflow-hidden group">

                    {/* Galactic Center */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Orbit Rings (Decorative) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gray-800 rounded-full opacity-30 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-gray-800 rounded-full opacity-30 pointer-events-none"></div>

                    {/* Skill Nodes */}
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ scale: 0 }}
                            animate={{
                                scale: 1,
                                y: [0, -10, 0], // Floating animation
                            }}
                            transition={{
                                y: { repeat: Infinity, duration: 3, ease: "easeInOut", delay: index * 0.5 },
                                scale: { duration: 0.5 }
                            }}
                            className="absolute cursor-pointer flex flex-col items-center justify-center group/node"
                            style={{
                                left: skill.x,
                                top: skill.y,
                            }}
                            onMouseEnter={() => setHoveredSkill(skill)}
                            onMouseLeave={() => setHoveredSkill(null)}
                        >
                            {/* The Planet */}
                            <motion.div
                                whileHover={{ scale: 1.2, boxShadow: `0 0 30px ${skill.color}` }}
                                className="rounded-full shadow-lg border-2 border-white/10 backdrop-blur-md flex items-center justify-center relative z-20 transition-all duration-300"
                                style={{
                                    width: skill.size,
                                    height: skill.size,
                                    backgroundColor: `${skill.color}40`, // 40% opacity
                                    borderColor: skill.color
                                }}
                            >
                                <span className="font-bold text-xs pointer-events-none">{skill.level}</span>
                            </motion.div>

                            {/* Label */}
                            <span className="mt-2 text-sm font-bold text-gray-300 group-hover/node:text-white transition-colors tracking-widest uppercase text-[10px]">
                                {skill.name}
                            </span>
                        </motion.div>
                    ))}

                    {/* Hover Info Panel */}
                    <div className="absolute bottom-8 right-8 w-64 bg-gray-800/90 backdrop-blur border border-gray-700 p-4 rounded-xl shadow-2xl transform transition-all duration-500"
                        style={{ opacity: hoveredSkill ? 1 : 0, translateY: hoveredSkill ? 0 : 20 }}
                    >
                        {hoveredSkill && (
                            <>
                                <h3 className="text-xl font-bold text-white mb-1" style={{ color: hoveredSkill.color }}>{hoveredSkill.name}</h3>
                                <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                                    <span className="uppercase">{hoveredSkill.category}</span>
                                    <span>Lvl {Math.floor(hoveredSkill.level / 10)}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${hoveredSkill.level}%`, backgroundColor: hoveredSkill.color }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {hoveredSkill.level > 80 ? "Mastery level achieved. Capable of mentoring others." :
                                        hoveredSkill.level > 50 ? "Proficient. Ready for intermediate projects." :
                                            "Foundational knowledge. Keep practicing!"}
                                </p>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SkillGalaxy;
