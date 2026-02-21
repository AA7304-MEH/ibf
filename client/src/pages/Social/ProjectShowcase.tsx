import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

import api from '../../services/api';

const ProjectShowcase: React.FC = () => {
    const [projects, setProjects] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetch recent projects
                const res = await api.get('/projects');
                // Transform to match UI if needed, or use directly if schema matches
                // For this showcase, we might mock the 'image' if not in DB, or use a placeholder
                const mapped = res.data.map((p: any) => ({
                    id: p._id,
                    title: p.title,
                    student: "IBF Innovator", // Placeholder or fetch user name populate
                    level: p.projectType === 'innovator' ? 'Innovator' : 'Builder',
                    image: `https://source.unsplash.com/random/800x600?${p.tags[0] || 'technology'}`, // Dynamic image based on tag
                    likes: Math.floor(Math.random() * 200), // Simulating engagement for now
                    comments: Math.floor(Math.random() * 50),
                    tags: p.skillsRequired || []
                }));
                setProjects(mapped);
            } catch (err) {
                console.error("Failed to fetch showcase projects", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'; // Reliable fallback
    };

    if (loading) return <div className="p-12 text-center">Loading Innovation Showcase...</div>;

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
                                onError={handleImageError}
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
                                {project.tags.map((tag: string) => (
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
