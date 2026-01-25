import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
    GlobeAltIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

const StartupDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [startup, setStartup] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStartup = async () => {
            try {
                const res = await api.get(`/incubator/startups/${id}`);
                setStartup(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStartup();
    }, [id]);

    if (loading) return <div className="p-12 text-center text-gray-500">Loading startup details...</div>;
    if (!startup) return <div className="p-12 text-center text-red-500">Startup not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <img
                        src={startup.logo || `https://ui-avatars.com/api/?name=${startup.name}&background=random`}
                        alt={startup.name}
                        className="w-24 h-24 rounded-xl object-cover shadow-md"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{startup.name}</h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400">{startup.tagline}</p>
                        <div className="flex gap-2 mt-4">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{startup.industry}</span>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium capitalize">{startup.stage}</span>
                        </div>
                    </div>
                </div>
                <div>
                    {/* Action Buttons */}
                    <button className="bg-ibf-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
                        Contact Founder
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <GlobeAltIcon className="w-6 h-6 text-gray-400" />
                            About
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {startup.description}
                        </p>
                    </section>

                    {/* Team */}
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <UserGroupIcon className="w-6 h-6 text-gray-400" />
                            Team
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {startup.team?.map((member: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{member.name}</p>
                                        <p className="text-sm text-gray-500">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Metrics Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-gray-400" />
                            Traction
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-500">Users</span>
                                <span className="font-bold text-gray-900 dark:text-white">{startup.metrics?.users?.toLocaleString() || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-500">Monthly Revenue</span>
                                <span className="font-bold text-gray-900 dark:text-white text-green-600">
                                    {startup.metrics?.revenue ? `$${startup.metrics.revenue.toLocaleString()}` : 'Pre-revenue'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500">Growth Rate</span>
                                <span className="font-bold text-gray-900 dark:text-white text-ibf-primary">
                                    {startup.metrics?.growthRate ? `${startup.metrics.growthRate}%` : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Funding Info (Incubator Data) */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-900 dark:text-blue-100">
                            <CurrencyDollarIcon className="w-5 h-5" />
                            IBF Funding
                        </h2>
                        {startup.funding ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-blue-700 dark:text-blue-300">Investment</span>
                                    <span className="font-bold text-blue-900 dark:text-white">${startup.funding.amount?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-blue-700 dark:text-blue-300">Equity</span>
                                    <span className="font-bold text-blue-900 dark:text-white">{startup.funding.equity}%</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                                    <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold">Cohort</span>
                                    <p className="text-lg font-bold text-blue-900 dark:text-white">{startup.cohort}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-blue-700 dark:text-blue-300">Seeking initial funding.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupDetail;
