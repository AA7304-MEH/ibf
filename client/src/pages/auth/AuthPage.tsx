import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AuthPage: React.FC = () => {
    const { login, register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState<'login' | 'register'>(
        searchParams.get('mode') === 'register' ? 'register' : 'login'
    );
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'talent' // Default
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
                showToast(`Welcome back!`, 'success');
            } else {
                await register(formData.email, formData.password, formData.role);
                showToast(`Account created successfully!`, 'success');
            }
            navigate('/dashboard');
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Authentication failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">IBF</span>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <button
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        {mode === 'login' ? 'create an account' : 'sign in to existing account'}
                    </button>
                </p>

            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {mode === 'register' && (
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    I am a...
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="talent">Talent (Looking for work)</option>
                                    <option value="founder">Founder (Hiring)</option>
                                    <option value="student">Student (SkillSwap)</option>
                                    <option value="admin">Admin (Test Access)</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                            >
                                {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign in' : 'Create Account')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
