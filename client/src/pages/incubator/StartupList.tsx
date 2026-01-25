import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/ui/Card';

interface Startup {
    _id: string;
    name: string;
    pitch: string;
    industry: string;
    stage: string;
}

const StartupList: React.FC = () => {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const res = await api.get('/incubator/startups');
                setStartups(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStartups();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Incubator...</div>;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Incubator Directory</h1>
                    <p className="text-gray-500 dark:text-gray-400">Discover and support the next generation of startups.</p>
                </div>
                <Link to="/incubator/apply" className="bg-ibf-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Register Startup
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {startups.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No startups found. Be the first to register!
                    </div>
                ) : (
                    startups.map((startup) => (
                        <Card key={startup._id} className="p-6">
                            <h3 className="text-xl font-bold mb-2">{startup.name}</h3>
                            <div className="flex gap-2 text-sm mb-4">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{startup.industry}</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded capitalize">{startup.stage}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{startup.pitch}</p>
                            <button className="text-ibf-primary font-medium hover:underline">View Details →</button>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default StartupList;
