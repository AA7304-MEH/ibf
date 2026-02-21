import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../../services/api';

const GrowthPredictor: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchPrediction = async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock Data
            const mockData = {
                overallPotential: 92,
                recommendations: {
                    summary: 'Strong trajectory for Series A exit or IPO.'
                },
                predictions: {
                    expected: {
                        equityValue: 450000,
                        description: 'Based on current 3x ARR growth'
                    }
                },
                growthTrajectory: [
                    { year: 1, score: 20000, milestones: ['Vesting Cliff'] },
                    { year: 2, score: 65000, milestones: ['Promotion'] },
                    { year: 3, score: 150000, milestones: ['Series B'] },
                    { year: 4, score: 320000, milestones: ['Full Vesting'] },
                    { year: 5, score: 450000, milestones: ['Exit Scenario'] }
                ]
            };

            setData(mockData);
        };
        fetchPrediction();
    }, []);

    if (!data) return <div>Loading Predictions...</div>;

    const chartData = data.growthTrajectory;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
                <h2 className="text-xl font-bold dark:text-white">Long-Term Value Predictor</h2>
                <p className="text-sm text-gray-500">5-Year Career & Equity Projection</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Scorecards */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
                        <div className="text-xs font-bold opacity-80 uppercase mb-1">Overall Potential</div>
                        <div className="text-3xl font-bold">{data.overallPotential}/100</div>
                        <p className="text-xs mt-2 opacity-90">{data.recommendations.summary}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                        <div className="text-xs font-bold text-gray-500 uppercase mb-1">Exit Scenario (Expected)</div>
                        <div className="text-xl font-bold dark:text-white">${data.predictions.expected.equityValue.toLocaleString()}</div>
                        <p className="text-xs text-gray-400 mt-1">{data.predictions.expected.description}</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="lg:col-span-2 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="year" stroke="#9ca3af" tickFormatter={(val) => `Year ${val}`} />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Milestone Roadmap</h3>
                <div className="flex justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                    {chartData.map((point: any) => (
                        <div key={point.year} className="flex flex-col items-center group">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-4 border-indigo-500 flex items-center justify-center text-xs font-bold shadow-sm z-10">
                                {point.year}
                            </div>
                            <div className="mt-4 text-center max-w-[100px]">
                                <p className="text-xs font-bold text-gray-900 dark:text-white">{point.milestones[0]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GrowthPredictor;
