import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDaysIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const AgeGate: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [birthDate, setBirthDate] = useState('');
    const [error, setError] = useState<string | null>(null);

    const checkAge = () => {
        if (!birthDate) return;

        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        if (age < 16) {
            setError('underage');
            setStep(3);
        } else if (age > 18) {
            setError('overage');
            setStep(3);
        } else {
            // Success - Proceed to registration
            // We pass the birthDate via state to the registration page so they don't have to re-enter
            navigate('/skillswap/register', { state: { birthDate, age } });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CalendarDaysIcon className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
                    IBF SkillSwap
                </h2>
                <p className="text-center text-sm text-gray-600 mb-8 max-w-xs mx-auto">
                    A safe micro-internship platform exclusively for high school students (16-18).
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                                    Before we start, we need to verify your age.
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                                            Date of Birth
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="date"
                                                id="birthdate"
                                                name="birthdate"
                                                required
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                                value={birthDate}
                                                onChange={(e) => setBirthDate(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={checkAge}
                                        disabled={!birthDate}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Check Eligibility
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && error === 'underage' && (
                            <motion.div
                                key="underage"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    We're sorry!
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    SkillSwap is designed specifically for students aged 16-18 due to COPPA regulations and work safety guidelines.
                                </p>
                                <div className="bg-blue-50 p-4 rounded-md mb-6 text-left">
                                    <h4 className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2">Recommendation</h4>
                                    <p className="text-sm text-blue-700">
                                        Check out our <strong>Junior Coding Camp</strong> or join our newsletter to be notified when you turn 16!
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                    Return to Home
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && error === 'overage' && (
                            <motion.div
                                key="overage"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <CheckCircleIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Great news!
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    It looks like you're over 18. SkillSwap is for high school students, but you qualify for our <strong>Pro Collab</strong> platform!
                                </p>
                                <div className="bg-purple-50 p-4 rounded-md mb-6 text-left">
                                    <h4 className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-2">Recommendation</h4>
                                    <p className="text-sm text-purple-700">
                                        Join <strong>IBF Collab</strong> to find paid freelance work and join startup teams as a full member.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/collab')}
                                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                                >
                                    Go to IBF Collab
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AgeGate;
