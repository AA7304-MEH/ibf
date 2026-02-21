import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../../services/api';

const CultureMap: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // Mock profiles for demo
            const userProfile = {
                speedVsQuality: 70, autonomyVsStructure: 80, innovationVsStability: 90,
                collaborationVsOwnership: 40, feedbackStyle: 60, workStyle: 80,
                riskVsReward: 75
            };
            const companyProfile = {
                speedVsQuality: 80, autonomyVsStructure: 70, innovationVsStability: 85,
                collaborationVsOwnership: 50, feedbackStyle: 70, workStyle: 60,
                riskVsReward: 80
            };

            // Mock Response from "API"
            const dimensionScores = {
                speedVsQuality: { score: 0.9, match: 'Very High', explanation: 'Shared focus on rapid iteration.' },
                autonomyVsStructure: { score: 0.85, match: 'High', explanation: 'Strong fit for self-starters.' },
                innovationVsStability: { score: 0.95, match: 'Excellent', explanation: 'Perfect alignment on disruption.' },
                collaborationVsOwnership: { score: 0.6, match: 'Moderate', explanation: 'Company prefers more team syncs.' },
                feedbackStyle: { score: 0.7, match: 'Good', explanation: 'Direct feedback culture matches.' },
                workStyle: { score: 0.8, match: 'High', explanation: 'Flexible hours alignment.' }
            };

            const mockRes = {
                data: {
                    overallScore: 0.85,
                    dimensionScores
                }
            };

            setData(mockRes.data);

            // Transform for Recharts
            const transformed = Object.entries(dimensionScores).map(([key, val]: [string, any]) => ({
                subject: key.replace(/([A-Z])/g, ' $1').split(' Vs ')[0], // Simplify label
                A: val.score * 100,
                user: userProfile[key as keyof typeof userProfile] || 50,
                company: companyProfile[key as keyof typeof companyProfile] || 50,
                fullMark: 100
            }));
            setChartData(transformed);
        };
        fetchData();
    }, []);

    if (!data) return <div>Loading Culture Map...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold dark:text-white">Culture Compatibility</h2>
                    <p className="text-sm text-gray-500">7-Dimension Alignment Analysis</p>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">{Math.round(data.overallScore * 100)}%</div>
                    <div className="text-xs font-bold text-gray-400 uppercase">Match Score</div>
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="You" dataKey="user" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Radar name="Company" dataKey="company" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-6 text-sm mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#8884d8] rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Your Preference</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#82ca9d] rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Company Culture</span>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Analysis & Gaps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(data.dimensionScores).map(([key, val]: [string, any]) => (
                        <div key={key} className={`p-3 rounded-lg border ${val.score < 0.6 ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900' : 'bg-gray-50 border-gray-100 dark:bg-gray-700/50 dark:border-gray-700'}`}>
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-sm capitalize dark:text-gray-200">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span className={`text-xs font-bold ${val.score < 0.6 ? 'text-red-500' : 'text-green-500'}`}>
                                    {val.match} Match
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{val.explanation}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CultureMap;
