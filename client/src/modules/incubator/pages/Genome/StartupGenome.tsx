import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, BeakerIcon, ScaleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const StartupGenome: React.FC = () => {
    const [genome, setGenome] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [isSequencing, setIsSequencing] = React.useState(false);

    const fetchGenome = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/incubator/startups/startup_001/genome', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setGenome(data);
        } catch (err) {
            console.error('Genome fetch failed', err);
        } finally {
            setLoading(false);
        }
    };

    const runAnalysis = async () => {
        setIsSequencing(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/incubator/startups/startup_001/genome/run', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setGenome(data);
        } catch (err) {
            console.error('Genome run failed', err);
        } finally {
            setTimeout(() => setIsSequencing(false), 2000); // Animation duration
        }
    };

    React.useEffect(() => {
        fetchGenome();
    }, []);

    const score = genome?.marketFitScore || 94;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
            <header className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <BeakerIcon className="w-8 h-8 mr-3 text-purple-600" />
                        Genome Sequencer
                    </h1>
                    <p className="text-gray-500 mt-2">Real-time health sequencing against professional benchmarks.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={runAnalysis}
                        disabled={isSequencing}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        <ArrowPathIcon className={`w-5 h-5 ${isSequencing ? 'animate-spin' : ''}`} />
                        {isSequencing ? 'Sequencing...' : 'Run Analysis'}
                    </button>
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${score > 80 ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                        <span className="font-bold text-gray-700">Health Score: {score}/100</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* DNA Visualization */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest absolute top-6 left-6">Pattern Match Analysis</h3>

                    <div className="flex space-x-1 h-64 items-center">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 20 }}
                                animate={{ height: [40, 150, 40] }}
                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.1, ease: "easeInOut" }}
                                className={`w-3 rounded-full ${i % 3 === 0 ? 'bg-purple-500' : i % 3 === 1 ? 'bg-blue-500' : 'bg-pink-500'}`}
                            />
                        ))}
                    </div>

                    <div className="mt-8 flex space-x-8 text-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{genome?.marketFitScore || 70}%</p>
                            <p className="text-xs text-gray-500">Market Fit</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{genome?.teamStrengthScore || 65}%</p>
                            <p className="text-xs text-gray-500">Team Strength</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{genome?.tractionScore || 40}%</p>
                            <p className="text-xs text-gray-500">Traction</p>
                        </div>
                    </div>
                </div>

                {/* Health Metrics */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                        <div className="flex items-center mb-4">
                            <HeartIcon className="w-6 h-6 text-red-500 mr-3" />
                            <h3 className="font-bold text-lg">Vital Signs</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Burn Rate Efficiency</span>
                                    <span className="font-bold text-green-600">Optimal ($12k/mo)</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full"><div className="w-[85%] h-full bg-green-500 rounded-full" /></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Team Sentiment</span>
                                    <span className="font-bold text-yellow-600">Strained</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full"><div className="w-[60%] h-full bg-yellow-500 rounded-full" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                        <div className="flex items-center mb-4">
                            <ScaleIcon className="w-6 h-6 text-blue-500 mr-3" />
                            <h3 className="font-bold text-lg">Recommendations</h3>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-start text-sm text-gray-600">
                                <span className="bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded text-xs mr-2">CRITICAL</span>
                                Customer Churn is deviating from success pattern. Initiate "Founder Calls" campaign immediately.
                            </li>
                            <li className="flex items-start text-sm text-gray-600">
                                <span className="bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded text-xs mr-2">TIP</span>
                                Engineering velocity is high. Consider documenting IP now before Series A.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupGenome;
