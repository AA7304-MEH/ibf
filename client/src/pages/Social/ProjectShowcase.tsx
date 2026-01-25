import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const ProjectShowcase: React.FC = () => {
    // Mock Showcase Data
    const projects = [
        {
            id: 1,
            title: "EcoTrack: Carbon Footprint Monitor",
            student: "Maya Singh",
            level: "Innovator",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            likes: 124,
            comments: 18,
            tags: ["React", "Node.js", "Sustainability"]
        },
        {
            id: 2,
            title: "MindfulVR: Meditation App",
            student: "Liam K.",
            level: "Creator",
            image: "https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            likes: 89,
            comments: 12,
            tags: ["Unity", "C#", "Wellness"]
        },
        {
            id: 3,
            title: "LocalEats: Food Rescue Platform",
            student: "Sarah J.",
            level: "Builder",
            image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            likes: 210,
            comments: 45,
            tags: ["Mobile", "Flutter", "Social Impact"]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    Student Innovation Showcase
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Discover incredible projects built by the IBF community.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                    >
                        <div className="relative h-48">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 flex items-center shadow-sm">
                                <StarIcon className="w-3 h-3 text-yellow-500 mr-1" />
                                {project.level}
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{project.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">by {project.student}</p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <button className="flex items-center text-gray-500 hover:text-pink-500 transition-colors space-x-1">
                                    <HeartIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{project.likes}</span>
                                </button>
                                <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors space-x-1">
                                    <ChatBubbleLeftIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{project.comments}</span>
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <ShareIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProjectShowcase;
