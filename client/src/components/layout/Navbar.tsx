import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinkClass = 'text-muted hover:text-teal transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium';

    const NavLinks = () => {
        if (!user) {
            return (
                <>
                    <Link to="/login" className={navLinkClass}>
                        Sign In
                    </Link>
                    <Link to="/register" className="btn-teal text-xs py-2.5 px-5">
                        Get Started
                    </Link>
                </>
            );
        }

        return (
            <>
                {/* Founder Navigation */}
                {user.role === 'founder' && (
                    <>
                        <Link to="/incubator" className={navLinkClass}>Incubator</Link>
                        <Link to="/collab" className={navLinkClass}>Collab</Link>
                    </>
                )}

                {/* Talent Navigation */}
                {user.role === 'talent' && (
                    <Link to="/collab" className={navLinkClass}>Collab</Link>
                )}

                {/* Student / Teen Navigation */}
                {['student', 'teen'].includes(user.role) && (
                    <Link to="/skillswap" className={navLinkClass}>SkillSwap</Link>
                )}

                {/* Parent / Company / Founder Navigation for SkillSwap */}
                {['parent', 'company', 'founder'].includes(user.role) && (
                    <Link to="/skillswap" className={navLinkClass}>SkillSwap</Link>
                )}

                {/* Admin Navigation */}
                {user.role === 'admin' && (
                    <>
                        <Link to="/incubator" className={navLinkClass}>Incubator</Link>
                        <Link to="/collab" className={navLinkClass}>Collab</Link>
                        <Link to="/skillswap" className={navLinkClass}>SkillSwap</Link>
                        <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-amber bg-amber/10 border border-amber/20 hover:bg-amber/20 transition-all">
                            <span className="w-2 h-2 bg-amber rounded-full animate-pulse"></span>
                            Admin
                        </Link>
                    </>
                )}

                {/* Dashboard Link for All Logged-in Users */}
                <Link to="/dashboard" className={navLinkClass}>Dashboard</Link>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 text-muted hover:text-teal focus:outline-none transition-colors"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-teal to-teal-dim rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(0,245,212,0.3)]">
                            <span className="font-bold text-navy text-sm uppercase">
                                {user?.email?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <ChevronDownIcon className="h-4 w-4" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-52 glass rounded-xl shadow-2xl border border-white/10 py-1 z-50">
                            <div className="px-4 py-3 border-b border-white/10">
                                <p className="font-semibold text-white text-sm truncate">{(user as any)?.name || 'User'}</p>
                                <p className="text-xs text-muted truncate">{user?.email}</p>
                                <p className="text-[10px] text-teal capitalize mt-1 font-semibold">{user?.role}</p>
                            </div>

                            <Link
                                to="/dashboard"
                                className="block px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                My Dashboard
                            </Link>

                            <Link
                                to="/profile"
                                className="block px-4 py-2.5 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                Edit Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 border-t border-white/10 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <nav className="glass border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            <span className="font-syne text-2xl font-black tracking-tighter gradient-text">IBF</span>
                            <span className="text-sm font-medium text-muted hidden md:inline tracking-tight">
                                Innovator Bridge Foundry
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLinks />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-muted p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-white/5 py-4">
                        <div className="flex flex-col space-y-1 px-2">
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-3 py-3 rounded-xl text-sm font-medium text-muted hover:text-white hover:bg-white/5 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-3 py-3 rounded-xl text-sm font-medium btn-teal text-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {['founder', 'admin'].includes(user.role) && (
                                        <Link
                                            to="/incubator"
                                            className="block px-3 py-3 rounded-xl text-sm font-medium text-muted hover:text-white hover:bg-white/5 transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Incubator
                                        </Link>
                                    )}

                                    {['founder', 'talent', 'admin'].includes(user.role) && (
                                        <Link
                                            to="/collab"
                                            className="block px-3 py-3 rounded-xl text-sm font-medium text-muted hover:text-white hover:bg-white/5 transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Collab
                                        </Link>
                                    )}

                                    {['student', 'teen', 'admin', 'founder', 'parent', 'company'].includes(user.role) && (
                                        <Link
                                            to="/skillswap"
                                            className="block px-3 py-3 rounded-xl text-sm font-medium text-muted hover:text-white hover:bg-white/5 transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            SkillSwap
                                        </Link>
                                    )}

                                    <Link
                                        to="/dashboard"
                                        className="block px-3 py-3 rounded-xl text-sm font-medium text-muted hover:text-white hover:bg-white/5 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border-t border-white/5 mt-2 pt-4 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
