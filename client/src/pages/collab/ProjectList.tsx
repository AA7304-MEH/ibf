import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Card from '../../components/ui/Card';

interface Project {
    _id: string;
    title: string;
    description: string;
    projectType: 'general' | 'skillswap';
    skillsRequired: string[];
}

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects?type=general'); // Filter for standard Collab projects
                setProjects(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Projects...</div>;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Collab Marketplace</h1>
                    <p className="text-gray-500 dark:text-gray-400">Find work, join teams, and build your portfolio.</p>
                </div>
                <button className="bg-ibf-secondary text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                    Post Project
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No active projects. Check back soon!
                    </div>
                ) : (
                    projects.map((project) => (
                        <Card key={project._id} className="p-6 border-l-4 border-ibf-secondary hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.skillsRequired.map(skill => (
                                    <span key={skill} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Standard Project</span>
                                <button className="text-ibf-secondary font-medium hover:underline">Apply Now</button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectList;
