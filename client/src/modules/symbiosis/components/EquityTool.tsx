import React, { useState, useEffect } from 'react';
import { CalculatorIcon, ArrowTrendingUpIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

const EquityTool: React.FC = () => {
    const [inputs, setInputs] = useState({
        role: 'foundingEngineer',
        experience: 5,
        riskProfile: 'seed',
        location: 'siliconValley',
        companyStage: 'seed'
    });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        calculate();
    }, [inputs]);

    const calculate = async () => {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Mock Calculation Logic
            // Base equity by role
            const baseEquity = {
                foundingEngineer: 1.0, // 1%
                leadEngineer: 0.5,
                seniorEngineer: 0.25,
                engineer: 0.15
            };

            // Multipliers
            const expMultiplier = 1 + (inputs.experience * 0.1); // +10% per year
            const riskMultiplier = {
                preSeed: 2.0,
                seed: 1.5,
                seriesA: 1.2,
                seriesB: 1.0
            }[inputs.riskProfile] || 1.0;

            const calculated = baseEquity[inputs.role as keyof typeof baseEquity] * expMultiplier * riskMultiplier;
            const min = (calculated * 0.8).toFixed(2);
            const max = (calculated * 1.2).toFixed(2);
            const recommended = calculated.toFixed(2);

            // Mock Response
            const mockResponse = {
                range: { min, max, recommended },
                dilutionProjection: [
                    { year: 1, dilutionCheck: 0 },
                    { year: 2, dilutionCheck: 15 },
                    { year: 3, dilutionCheck: 25 },
                    { year: 4, dilutionCheck: 35 }
                ]
            };

            setResult(mockResponse);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                    <CalculatorIcon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold dark:text-white">Fair Equity Calculator</h2>
                    <p className="text-sm text-gray-500">AI-powered recommendations based on market data</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                        <select
                            value={inputs.role}
                            onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white"
                        >
                            <option value="foundingEngineer">Founding Engineer</option>
                            <option value="leadEngineer">Lead Engineer</option>
                            <option value="seniorEngineer">Senior Engineer</option>
                            <option value="engineer">Software Engineer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience: {inputs.experience} Years</label>
                        <input
                            type="range" min="0" max="20"
                            value={inputs.experience}
                            onChange={(e) => setInputs({ ...inputs, experience: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Appetite</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['preSeed', 'seed', 'seriesA', 'seriesB'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setInputs({ ...inputs, riskProfile: r })}
                                    className={`p-2 text-xs font-bold rounded-lg border ${inputs.riskProfile === r
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                {result && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                        {loading && <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">Loading...</div>}

                        <div className="mb-6 text-center">
                            <span className="text-sm text-gray-500 uppercase tracking-widest font-bold">Recommended Equity</span>
                            <div className="text-4xl font-black text-indigo-600 mt-2 mb-1">{result.range.recommended}%</div>
                            <div className="text-sm text-gray-400">Range: {result.range.min}% - {result.range.max}%</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <ShieldCheckIcon className="w-5 h-5 text-emerald-500" />
                                    <span>Vesting</span>
                                </div>
                                <span className="font-bold dark:text-white">4 Years</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <ArrowTrendingUpIcon className="w-5 h-5 text-blue-500" />
                                    <span>Cliff</span>
                                </div>
                                <span className="font-bold dark:text-white">12 Months</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Dilution Projection</h4>
                            <div className="flex items-end justify-between h-20 gap-2">
                                {result.dilutionProjection.map((d: any) => (
                                    <div key={d.year} className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-lg relative group">
                                        <div
                                            className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all"
                                            style={{ height: `${d.dilutionCheck}%` }}
                                        />
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-800 text-white px-2 py-1 rounded">
                                            Year {d.year}: {d.dilutionCheck}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>Year 1</span>
                                <span>Year 4</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EquityTool;
