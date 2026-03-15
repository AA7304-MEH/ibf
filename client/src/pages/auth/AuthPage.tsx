import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const AuthPage: React.FC = () => {
    const { login, register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState<'login' | 'register'>(
        searchParams.get('mode') === 'register' ? 'register' : 'login'
    );
    const [isLoading, setIsLoading] = useState(false);
    const [mockInfo, setMockInfo] = useState<{ message: string; credentials?: string; isWarmingUp?: boolean } | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'talent'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMockInfo(null);
        try {
            if (mode === 'login') {
                const response: any = await login(formData.email, formData.password);
                if (response?.isMockMode) {
                    showToast(`Logged in via Mock Mode!`, 'success');
                } else {
                    showToast(`Welcome back!`, 'success');
                }
            } else {
                await register(formData.email, formData.password, formData.role);
                showToast(`Account created successfully!`, 'success');
            }
            navigate('/dashboard');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Authentication failed';
            showToast(msg, 'error');

            if (err.response?.data?.isMockMode) {
                setMockInfo({
                    message: msg,
                    credentials: err.response?.data?.availableCredentials,
                    isWarmingUp: err.response?.status === 503
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-navy relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center">
                    <Link to="/">
                        <span className="font-syne text-4xl font-black gradient-text">IBF</span>
                    </Link>
                </div>
                <h2 className="mt-6 text-center text-3xl font-syne font-bold text-white">
                    {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
                </h2>
                <p className="mt-3 text-center text-sm text-muted">
                    {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        className="font-semibold text-teal hover:text-teal-dim transition-colors"
                    >
                        {mode === 'login' ? 'Create one now' : 'Sign in instead'}
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="glass rounded-2xl py-8 px-6 sm:px-10 border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-white mb-1.5">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-navy-card border border-navy-border rounded-xl text-white placeholder-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/30 transition-all text-sm"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-white mb-1.5">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 bg-navy-card border border-navy-border rounded-xl text-white placeholder-muted focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/30 transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        {mode === 'register' && (
                            <div>
                                <label htmlFor="role" className="block text-sm font-semibold text-white mb-1.5">
                                    I am a...
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    className="w-full px-4 py-3 bg-navy-card border border-navy-border rounded-xl text-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/30 transition-all text-sm appearance-none cursor-pointer"
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
                                className="btn-teal w-full flex justify-center py-3.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
                            >
                                <span className="relative z-10">
                                    {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                                </span>
                            </button>
                        </div>

                        {mockInfo && (
                            <div className={`mt-4 p-4 rounded-xl border ${mockInfo.isWarmingUp ? 'bg-teal/5 border-teal/20' : 'bg-amber/5 border-amber/20'}`}>
                                <p className={`text-xs font-bold flex items-center gap-1.5 ${mockInfo.isWarmingUp ? 'text-teal' : 'text-amber'}`}>
                                    <ExclamationTriangleIcon className="w-4 h-4" />
                                    {mockInfo.isWarmingUp ? 'DATABASE WARMING UP' : 'DATABASE OFFLINE (Mock Mode)'}
                                </p>
                                <p className={`text-[11px] mt-2 ${mockInfo.isWarmingUp ? 'text-teal/80' : 'text-amber/80'}`}>
                                    {mockInfo.isWarmingUp
                                        ? 'Initial startup may take 30-60 seconds. Try these credentials:'
                                        : 'Fallback credentials for testing:'}
                                </p>
                                <code className={`block mt-2 text-[11px] p-2 rounded-lg font-mono text-center ${mockInfo.isWarmingUp ? 'bg-teal/10 text-teal' : 'bg-amber/10 text-amber'}`}>
                                    {mockInfo.credentials}
                                </code>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
