import React from 'react';
import { motion } from 'framer-motion';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

const LearningCircles: React.FC = () => {
    // Mock Data
    const circles = [
        {
            id: 1,
            name: "React Beginners Hub",
            description: "A safe space to learn hooks, state, and components together.",
            members: 128,
            nextSession: "Tomorrow, 4:00 PM",
            tags: ["Frontend", "React"],
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            name: "AI Ethics Club",
            description: "Discussing the societal impact of AI and ML models.",
            members: 85,
            nextSession: "Fri, 6:00 PM",
            tags: ["AI", "Ethics"],
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            name: "Full Stack Builders",
            description: "Working on MERN stack projects? Let's debug together!",
            members: 210,
            nextSession: "Sat, 2:00 PM",
            tags: ["Noode.js", "MongoDB"],
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Learning Circles</h1>
                    <p className="text-gray-500 mt-2">Join a peer group to accelerate your growth.</p>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    + Create Circle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {circles.map((circle, i) => (
                    <motion.div
                        key={circle.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                    >
                        <div className="h-40 bg-gray-200 relative">
                            <img src={circle.image} alt={circle.name} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                                {circle.members} Members
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{circle.name}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{circle.description}</p>

                            <div className="flex gap-2 mb-6">
                                {circle.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="text-xs text-gray-500">
                                    <span className="block font-bold text-indigo-600">Next Session:</span>
                                    {circle.nextSession}
                                </div>
                                <button className="text-indigo-600 font-medium text-sm hover:underline">
                                    Join Circle →
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Upcoming Session Banner */}
            <div className="mt-12 bg-gradient-to-r from-purple-800 to-indigo-900 rounded-2xl p-8 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Live Now: "System Design 101"</h2>
                    <p className="text-indigo-200">Hosted by Mentor Priya • 45 watching</p>
                </div>
                <button className="flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors">
                    <VideoCameraIcon className="w-5 h-5 mr-2" />
                    Join Stream
                </button>
            </div>
        </div>
    );
};

export default LearningCircles;
