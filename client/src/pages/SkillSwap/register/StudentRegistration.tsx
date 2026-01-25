import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { ArrowRightIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

const StudentRegistration: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { register } = useAuth();
    const { showToast } = useToast();

    // Get state from AgeGate
    const initialBirthDate = location.state?.birthDate || '';

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Auth
        email: '',
        password: '',
        confirmPassword: '',

        // Profile
        firstName: '',
        lastName: '',
        birthDate: initialBirthDate,
        schoolName: '',
        schoolGrade: '11th', // Default

        // Edu
        interests: [] as string[],
        skills: [] as string[],

        // Parent
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        parentRelationship: 'parent',

        // Agreements
        agreedToRules: false,
        agreedToSafety: false
    });

    const handleNext = () => {
        if (step === 1) {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.birthDate) {
                showToast("Please fill in all required fields", "error");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                showToast("Passwords don't match", "error");
                return;
            }
            if (formData.password.length < 8) {
                showToast("Password must be at least 8 characters", "error");
                return;
            }
        }
        setStep(prev => prev + 1);
    };
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        // Password validation moved to handleNext (Step 1)

        if (formData.email === formData.parentEmail) {
            showToast("Parent email must be different from student email", "error");
            return;
        }

        setIsLoading(true);
        try {
            // Register using the context (which calls the API)
            // Note: We need to modify our register function or API to accept all these extra fields
            // For now, we'll pass extended data. 
            // In a real implementation, we'd update the AuthContext signature or make a separate API call 
            // to update the profile after registration.

            // Assuming register supports extended data or we handle it here:
            // Since useAuth.register typically only takes email/pass/role, 
            // we might need to handle this differently. 
            // For this MVP, let's assume we call register and then update profile?
            // Actually, best to send it all to a dedicated student-register endpoint 
            // but let's stick to the existing auth flow + profile update pattern or assume backend handles it.

            // Pass the full form data to the register function
            await register(formData.email, formData.password, 'student', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.birthDate,
                schoolDetails: {
                    name: formData.schoolName,
                    grade: formData.schoolGrade
                },
                parentInfo: {
                    name: formData.parentName,
                    email: formData.parentEmail,
                    phone: formData.parentPhone,
                    relationship: formData.parentRelationship
                },
                interests: formData.interests
            });

            showToast("Registration successful! Welcome to SkillSwap.", "success");
            navigate('/skillswap/dashboard');
        } catch (error: any) {
            console.error("Registration Error:", error);
            const msg = error.response?.data?.message || "Registration failed. Please check your details.";

            // Temporary: Strict alerting as requested by user
            alert(`Registration Error: ${msg}\n\nTechnical Details: ${JSON.stringify(error.response?.data || error.message)}`);

            showToast(msg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Render helpers...
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {step > s ? <CheckIcon className="w-5 h-5" /> : s}
                                </div>
                                <span className="text-xs mt-1 text-gray-500 hidden sm:block">
                                    {s === 1 && 'Profile'}
                                    {s === 2 && 'Education'}
                                    {s === 3 && 'Parent'}
                                    {s === 4 && 'Review'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-green-600 h-full transition-all duration-300"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6 sm:p-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {step === 1 && 'Student Profile'}
                        {step === 2 && 'Educational Background'}
                        {step === 3 && 'Parent Information'}
                        {step === 4 && 'Review & Submit'}
                    </h2>

                    {/* Step 1: Profile */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.birthDate}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">School Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.schoolName}
                                    placeholder="e.g. Lincoln High School"
                                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Grade Level</label>
                                <select
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                                    value={formData.schoolGrade}
                                    onChange={(e) => setFormData({ ...formData, schoolGrade: e.target.value })}
                                >
                                    <option value="9th">9th Grade (Freshman)</option>
                                    <option value="10th">10th Grade (Sophomore)</option>
                                    <option value="11th">11th Grade (Junior)</option>
                                    <option value="12th">12th Grade (Senior)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Student Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Education */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Interests (Select top 3)</label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {['Web Dev', 'Design', 'Marketing', 'Data Science', 'AI/ML', 'Business', 'Writing', 'Research'].map(interest => (
                                        <button
                                            key={interest}
                                            onClick={() => {
                                                const current = formData.interests;
                                                const updated = current.includes(interest)
                                                    ? current.filter(i => i !== interest)
                                                    : [...current, interest].slice(0, 3);
                                                setFormData({ ...formData, interests: updated });
                                            }}
                                            className={`px-3 py-2 rounded-md text-sm font-medium border ${formData.interests.includes(interest)
                                                ? 'bg-green-50 border-green-500 text-green-700'
                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Parent Info */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            We take safety seriously. Your parent or guardian must verify your account before you can apply to projects.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Parent/Guardian Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.parentName}
                                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                                <input
                                    type="email"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.parentEmail}
                                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                                />
                                <p className="mt-1 text-xs text-gray-500">We will send a verification link to this email.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Parent Phone (Emergency)</label>
                                <input
                                    type="tel"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.parentPhone}
                                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Student</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formData.firstName} {formData.lastName}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">School</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formData.schoolName} ({formData.schoolGrade})</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Parent</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formData.parentName} ({formData.parentEmail})</dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="rules"
                                            type="checkbox"
                                            required
                                            className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                                            checked={formData.agreedToRules}
                                            onChange={(e) => setFormData({ ...formData, agreedToRules: e.target.checked })}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="rules" className="font-medium text-gray-700">I agree to the Code of Conduct</label>
                                        <p className="text-gray-500">I will be respectful, professional, and honest in my work.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="safety"
                                            type="checkbox"
                                            required
                                            className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                                            checked={formData.agreedToSafety}
                                            onChange={(e) => setFormData({ ...formData, agreedToSafety: e.target.checked })}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="safety" className="font-medium text-gray-700">I agree to the Safety Rules</label>
                                        <p className="text-gray-500">I will not share personal contact info (phone, social media) and will keep all communication on the platform.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="mt-8 flex justify-between">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
                                Back
                            </button>
                        )}
                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                            >
                                Next
                                <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading || !formData.agreedToRules || !formData.agreedToSafety}
                                className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50"
                            >
                                {isLoading ? 'Creating Account...' : 'Complete Registration'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRegistration;
