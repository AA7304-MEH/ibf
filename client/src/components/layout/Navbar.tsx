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

    const NavLinks = () => {
        if (!user) {
            return (
                <>
                    <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                        Sign In
                    </Link>
                    <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
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
                        <Link to="/incubator" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Incubator
                        </Link>
                        <Link to="/collab" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Collab
                        </Link>
                    </>
                )}

                {/* Talent Navigation */}
                {user.role === 'talent' && (
                    <Link to="/collab" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                        Collab
                    </Link>
                )}

                {/* Student Navigation */}
                {user.role === 'student' && (
                    <Link to="/skillswap" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                        SkillSwap
                    </Link>
                )}

                {/* Admin Navigation */}
                {user.role === 'admin' && (
                    <>
                        <Link to="/incubator" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Incubator
                        </Link>
                        <Link to="/collab" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Collab
                        </Link>
                        <Link to="/skillswap" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            SkillSwap
                        </Link>
                        <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                            Admin
                        </Link>
                    </>
                )}

                {/* Dashboard Link for All Logged-in Users */}
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                    >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-blue-600 uppercase">
                                {user?.email?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <ChevronDownIcon className="h-4 w-4" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="font-medium text-gray-900 truncate">{(user as any)?.name || 'User'}</p>
                                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                <p className="text-xs text-gray-400 capitalize mt-1">{user?.role}</p>
                            </div>

                            <Link
                                to="/dashboard"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                My Dashboard
                            </Link>

                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                Edit Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
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
        <nav className="bg-white shadow-md sticky top-0 z-40 transition-shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">IBF</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 hidden md:inline tracking-tight">
                                Innovator Bridge Foundry
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <NavLinks />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-700 p-2 rounded-md hover:bg-gray-100"
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
                    <div className="md:hidden border-t border-gray-100 py-4 bg-white">
                        <div className="flex flex-col space-y-2 px-2">
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
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
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Incubator
                                        </Link>
                                    )}

                                    {['founder', 'talent', 'admin'].includes(user.role) && (
                                        <Link
                                            to="/collab"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Collab
                                        </Link>
                                    )}

                                    {['student', 'admin'].includes(user.role) && (
                                        <Link
                                            to="/skillswap"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            SkillSwap
                                        </Link>
                                    )}

                                    <Link
                                        to="/dashboard"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
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
