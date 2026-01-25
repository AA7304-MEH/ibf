import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    CheckCircleIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    DocumentTextIcon,
    UserGroupIcon,
    RocketLaunchIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const steps = [
    { id: 1, name: 'Eligibility', icon: CheckCircleIcon },
    { id: 2, name: 'Team', icon: UserGroupIcon },
    { id: 3, name: 'Startup Details', icon: RocketLaunchIcon },
    { id: 4, name: 'Review', icon: DocumentTextIcon }
];

const Apply: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Team
        teamSize: 1,
        founderBio: '',
        linkedin: '',
        // Startup
        name: '',
        tagline: '',
        description: '',
        problem: '',
        solution: '',
        industry: 'SaaS',
        stage: 'idea',
        // Tech
        techStack: '',
        // Ask
        askAmount: 50000,
        equityOffer: 7
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Transform data to match backend Startup model
            const payload = {
                name: formData.name,
                tagline: formData.tagline,
                description: formData.description,
                problem: formData.problem,
                solution: formData.solution,
                industry: formData.industry,
                stage: formData.stage,
                team: [{ name: 'Founder (You)', role: 'Founder', bio: formData.founderBio, linkedin: formData.linkedin }],
                funding: { amount: formData.askAmount, equity: formData.equityOffer }
            };

            await api.post('/incubator/apply', payload);
            navigate('/incubator/dashboard');
        } catch (error) {
            console.error('Submission failed', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Progress Bar */}
            <div className="mb-12">
                <nav aria-label="Progress">
                    <ol role="list" className="flex items-center">
                        {steps.map((step, stepIdx) => (
                            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                                {step.id < currentStep ? (
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="h-0.5 w-full bg-ibf-primary" />
                                    </div>
                                ) : null}
                                <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${step.id <= currentStep ? 'bg-ibf-primary hover:bg-blue-900' : 'bg-gray-200'} transition-colors`}>
                                    <step.icon className={`h-5 w-5 ${step.id <= currentStep ? 'text-white' : 'text-gray-500'}`} aria-hidden="true" />
                                </div>
                                <p className={`absolute top-10 w-32 -left-12 text-center text-xs font-medium ${step.id <= currentStep ? 'text-ibf-primary' : 'text-gray-500'}`}>{step.name}</p>
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            {/* Form Content */}
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700 min-h-[500px] flex flex-col justify-between">

                {/* Step 1: Eligibility */}
                {currentStep === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Program Eligibility</h2>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">IBF Spring 2026 Batch</h3>
                            <ul className="list-disc pl-5 space-y-2 text-blue-800 dark:text-blue-200">
                                <li><strong>Pre-seed / Seed Stage:</strong> Must have at least a prototype or MVP.</li>
                                <li><strong>Full-time Commitment:</strong> At least one founder working full-time.</li>
                                <li><strong>Standard Deal:</strong> $50,000 for 7% equity post-money SAFE.</li>
                                <li><strong>Location:</strong> Remote-friendly but demo day requires presence (Virtual/SF).</li>
                            </ul>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="agree" className="w-5 h-5 text-ibf-primary rounded focus:ring-ibf-primary" />
                            <label htmlFor="agree" className="text-gray-700 dark:text-gray-300">I confirm that I meet the eligibility criteria.</label>
                        </div>
                    </div>
                )}

                {/* Step 2: Team */}
                {currentStep === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Founder Bio (Short)</label>
                                <textarea
                                    name="founderBio"
                                    rows={4}
                                    className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-ibf-primary focus:border-ibf-primary"
                                    placeholder="Tell us about yourself and why you are the right person to build this."
                                    value={formData.founderBio}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn Profile</label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-ibf-primary focus:border-ibf-primary"
                                    placeholder="https://linkedin.com/in/..."
                                    value={formData.linkedin}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Size</label>
                                <input
                                    type="number"
                                    name="teamSize"
                                    className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-ibf-primary focus:border-ibf-primary"
                                    min={1}
                                    value={formData.teamSize}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Startup Details */}
                {currentStep === 3 && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Startup Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Startup Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-ibf-primary focus:border-ibf-primary"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tagline (One sentence)</label>
                                <input
                                    type="text"
                                    name="tagline"
                                    className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-ibf-primary focus:border-ibf-primary"
                                    value={formData.tagline}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                                <select
                                    name="industry"
                                    className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-ibf-primary focus:border-ibf-primary"
                                    value={formData.industry}
                                    onChange={handleInputChange}
                                >
                                    <option value="SaaS">SaaS</option>
                                    <option value="AI">Artificial Intelligence</option>
                                    <option value="FinTech">FinTech</option>
                                    <option value="HealthTech">HealthTech</option>
                                    <option value="EdTech">EdTech</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
                                <select
                                    name="stage"
                                    className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-ibf-primary focus:border-ibf-primary"
                                    value={formData.stage}
                                    onChange={handleInputChange}
                                >
                                    <option value="idea">Idea Phase</option>
                                    <option value="prototype">Prototype Built</option>
                                    <option value="mvp">MVP with Users</option>
                                    <option value="launched">Launched</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem Statement</label>
                                <textarea
                                    name="problem"
                                    rows={3}
                                    className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-ibf-primary focus:border-ibf-primary"
                                    value={formData.problem}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Long)</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-ibf-primary focus:border-ibf-primary"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                    <div className="space-y-6 animate-fadeIn text-center">
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
                            <CheckCircleIcon className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ready to Submit?</h2>
                        <p className="text-gray-500 max-w-lg mx-auto">
                            You are applying to the Winter 2026 Batch with <strong>{formData.name}</strong>.
                            Please double-check your details before proceeding.
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl text-left max-w-lg mx-auto border border-gray-200 dark:border-gray-600">
                            <h4 className="font-bold mb-2">Summary</h4>
                            <p><span className="text-gray-500">Startup:</span> {formData.name}</p>
                            <p><span className="text-gray-500">Stage:</span> {formData.stage}</p>
                            <p><span className="text-gray-500">Ask:</span> ${formData.askAmount.toLocaleString()} for {formData.equityOffer}%</p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                    >
                        <ChevronLeftIcon className="w-5 h-5 mr-2" /> Back
                    </button>

                    {currentStep < 4 ? (
                        <button
                            onClick={nextStep}
                            className="flex items-center bg-ibf-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                        >
                            Continue <ChevronRightIcon className="w-5 h-5 ml-2" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Apply;
