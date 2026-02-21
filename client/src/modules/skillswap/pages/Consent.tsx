import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheckIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentTextIcon,
    UserIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

interface ConsentFormData {
    parentEmail: string;
    parentName: string;
    relationship: 'mother' | 'father' | 'guardian' | 'other';
    consentType: 'platform' | 'time-bound';
    permissions: {
        canApplyProjects: boolean;
        canCommunicate: boolean;
        canSubmitWork: boolean;
        canReceiveCertificates: boolean;
    };
    expiryMonths: number;
    emergencyContact: string;
    agreedToTerms: boolean;
}

const steps = [
    { id: 1, title: 'Parent Info', icon: UserIcon },
    { id: 2, title: 'Permissions', icon: ShieldCheckIcon },
    { id: 3, title: 'Agreement', icon: DocumentTextIcon },
    { id: 4, title: 'Confirm', icon: CheckCircleIcon }
];

const Consent: React.FC = () => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ConsentFormData>({
        parentEmail: '',
        parentName: '',
        relationship: 'guardian',
        consentType: 'platform',
        permissions: {
            canApplyProjects: true,
            canCommunicate: true,
            canSubmitWork: true,
            canReceiveCertificates: true
        },
        expiryMonths: 12,
        emergencyContact: '',
        agreedToTerms: false
    });

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updatePermission = (key: keyof typeof formData.permissions, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [key]: value
            }
        }));
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            await api.post('/skillswap/consent/request', {
                ...formData,
                studentId: user?._id
            });
            setSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit consent request');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <EnvelopeIcon className="w-10 h-10 text-emerald-600" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Consent Request Sent!
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        We've sent an email to <strong>{formData.parentEmail}</strong> with instructions
                        for your parent/guardian to review and approve your participation.
                    </p>

                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                            <ClockIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                Typically approved within 24-48 hours
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        You'll receive a notification once your parent/guardian responds.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
                        <ShieldCheckIcon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Parental Consent
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Required for students under 18 to participate in IBF SkillSwap
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8 px-4">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <motion.div
                                    animate={{
                                        backgroundColor: currentStep >= step.id ? '#10b981' : '#e5e7eb',
                                        scale: currentStep === step.id ? 1.1 : 1
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step.id ? 'text-white' : 'text-gray-400'
                                        }`}
                                >
                                    <step.icon className="w-5 h-5" />
                                </motion.div>
                                <span className={`text-xs mt-2 ${currentStep >= step.id ? 'text-emerald-600 font-medium' : 'text-gray-400'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Parent Info */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Parent/Guardian Information
                                </h3>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Parent/Guardian Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.parentName}
                                            onChange={(e) => updateFormData('parentName', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
                                            placeholder="Enter full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Parent/Guardian Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.parentEmail}
                                            onChange={(e) => updateFormData('parentEmail', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
                                            placeholder="parent@email.com"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            A verification link will be sent to this email
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Relationship to Student
                                        </label>
                                        <select
                                            value={formData.relationship}
                                            onChange={(e) => updateFormData('relationship', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
                                        >
                                            <option value="mother">Mother</option>
                                            <option value="father">Father</option>
                                            <option value="guardian">Legal Guardian</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Emergency Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.emergencyContact}
                                            onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Permissions */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Permission Settings
                                </h3>

                                <div className="space-y-4">
                                    {[
                                        { key: 'canApplyProjects', label: 'Apply to Projects', desc: 'Allow student to browse and apply for micro-internships' },
                                        { key: 'canCommunicate', label: 'Communicate with Mentors', desc: 'Enable messaging with project supervisors' },
                                        { key: 'canSubmitWork', label: 'Submit Work', desc: 'Allow uploading assignments and deliverables' },
                                        { key: 'canReceiveCertificates', label: 'Receive Certificates', desc: 'Enable earning completion certificates' }
                                    ].map((perm) => (
                                        <label
                                            key={perm.key}
                                            className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions[perm.key as keyof typeof formData.permissions]}
                                                onChange={(e) => updatePermission(perm.key as keyof typeof formData.permissions, e.target.checked)}
                                                className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{perm.label}</p>
                                                <p className="text-sm text-gray-500">{perm.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Consent Duration
                                    </label>
                                    <select
                                        value={formData.expiryMonths}
                                        onChange={(e) => updateFormData('expiryMonths', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white"
                                    >
                                        <option value={3}>3 months</option>
                                        <option value={6}>6 months</option>
                                        <option value={12}>12 months (Recommended)</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Consent can be revoked at any time
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Agreement */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Terms & Agreement
                                </h3>

                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6 max-h-64 overflow-y-auto">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                                        IBF SkillSwap Parental Consent Agreement
                                    </h4>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-4">
                                        <p>
                                            By providing consent, you acknowledge and agree to the following:
                                        </p>
                                        <ul className="list-disc list-inside space-y-2">
                                            <li>Your child may participate in supervised micro-internship projects</li>
                                            <li>All projects are vetted for age-appropriateness and safety</li>
                                            <li>Communication with project supervisors is monitored</li>
                                            <li>You may revoke consent at any time through your parent dashboard</li>
                                            <li>Work hours are limited to ensure academic priorities</li>
                                            <li>No personal information is shared with third parties without consent</li>
                                        </ul>
                                        <p>
                                            IBF is committed to providing a safe, educational environment for young learners.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
                                    <div className="flex gap-3">
                                        <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-amber-800 dark:text-amber-300">Important</p>
                                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                                Your parent/guardian must verify their email to activate consent.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.agreedToTerms}
                                        onChange={(e) => updateFormData('agreedToTerms', e.target.checked)}
                                        className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        I confirm that I have my parent/guardian's permission to request consent
                                        and that the information provided is accurate.
                                    </span>
                                </label>
                            </motion.div>
                        )}

                        {/* Step 4: Confirm */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    Review & Submit
                                </h3>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                        <p className="text-sm text-gray-500 mb-1">Parent/Guardian</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{formData.parentName}</p>
                                        <p className="text-gray-600 dark:text-gray-400">{formData.parentEmail}</p>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                        <p className="text-sm text-gray-500 mb-2">Permissions Granted</p>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(formData.permissions)
                                                .filter(([, v]) => v)
                                                .map(([key]) => (
                                                    <span
                                                        key={key}
                                                        className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-medium"
                                                    >
                                                        {key.replace('can', '')}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                        <p className="text-sm text-gray-500 mb-1">Consent Duration</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{formData.expiryMonths} months</p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                                    </div>
                                )}

                                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                                    <LockClosedIcon className="w-4 h-4" />
                                    <span>Your information is encrypted and secure</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${currentStep === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back
                        </button>

                        {currentStep < 4 ? (
                            <button
                                onClick={nextStep}
                                disabled={
                                    (currentStep === 1 && (!formData.parentName || !formData.parentEmail)) ||
                                    (currentStep === 3 && !formData.agreedToTerms)
                                }
                                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ArrowRightIcon className="w-4 h-4" />
                            </button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                ) : (
                                    <>
                                        <EnvelopeIcon className="w-5 h-5" />
                                        Send Consent Request
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Consent;
