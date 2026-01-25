import React from 'react';
import { motion } from 'framer-motion';
import { CommandLineIcon, PaintBrushIcon, PresentationChartLineIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const DigitalTwinWorkspace: React.FC = () => {
    const navigate = useNavigate();

    const zones = [
        {
            id: 'dev',
            name: 'Code Cosmos',
            icon: CommandLineIcon,
            color: 'text-blue-400',
            bg: 'bg-blue-900/20',
            desc: 'Visual Programming Environment',
            status: 'Active: 3 Modules'
        },
        {
            id: 'design',
            name: 'Design Dimensions',
            icon: PaintBrushIcon,
            color: 'text-pink-400',
            bg: 'bg-pink-900/20',
            desc: '3D Prototyping Lab',
            status: 'Rendering...'
        },
        {
            id: 'strategy',
            name: 'Strategy Solar System',
            icon: PresentationChartLineIcon,
            color: 'text-purple-400',
            bg: 'bg-purple-900/20',
            desc: 'Business Logic Orbit',
            status: 'Optimization: 92%'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Header */}
            <header className="relative z-10 flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                        Startup OS <span className="text-xs align-top text-gray-500">v1.0</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Digital Twin Connection: <span className="text-green-400 animate-pulse">STABLE</span></p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase">System Load</p>
                        <div className="w-32 h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "45%" }}
                                className="h-full bg-cyan-500"
                            />
                        </div>
                    </div>
                    <CpuChipIcon className="w-10 h-10 text-cyan-500" />
                </div>
            </header>

            {/* Main Command Deck */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {zones.map((zone, i) => (
                    <motion.div
                        key={zone.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        className={`relative border border-gray-800 rounded-2xl p-8 backdrop-blur-sm ${zone.bg} hover:border-gray-600 transition-colors group cursor-pointer`}
                        onClick={() => navigate('/visuals/galaxy')} // Redirects to Galaxy for now as demo
                    >
                        {/* Holo Corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gray-500" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gray-500" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gray-500" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gray-500" />

                        <div className={`w-16 h-16 rounded-full bg-black flex items-center justify-center mb-6 border border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
                            <zone.icon className={`w-8 h-8 ${zone.color}`} />
                        </div>

                        <h2 className="text-2xl font-bold mb-2 text-gray-100">{zone.name}</h2>
                        <p className="text-gray-400 text-sm mb-6">{zone.desc}</p>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                            <span className="text-xs font-mono text-cyan-400">{zone.status}</span>
                            <span className="text-xs text-gray-500">ENTER ZONE &rarr;</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Simulated Live Feed */}
            <div className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-gray-800 bg-black/50 p-6 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Team Holograms</h3>
                    <div className="flex space-x-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-700 opacity-50 flex items-center justify-center">
                                <span className="text-xs text-gray-500">OFF</span>
                            </div>
                        ))}
                        <button className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-400">
                            +
                        </button>
                    </div>
                </div>

                <div className="border border-gray-800 bg-black/50 p-6 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Neural Link Status</h3>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-gray-300">Flow State: <span className="text-cyan-400 font-bold">LOCKED IN (98%)</span></span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Gamma Waves Synchronized</p>
                    <div className="mt-4 h-16 flex items-end space-x-1">
                        {[40, 60, 45, 70, 85, 60, 75, 50, 65, 80].map((h, i) => (
                            <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-gradient-to-t from-blue-900 to-cyan-500 opacity-50 rounded-t-sm" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DigitalTwinWorkspace;
