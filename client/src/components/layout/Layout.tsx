import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Outlet } from 'react-router-dom';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-ibf-dark transition-colors duration-300">
            <Navbar />

            {/* Sidebar (Desktop) */}
            {user && <Sidebar userRole={user.role} />}

            {/* Main Content - Pushed by Sidebar on Desktop */}
            <main className={`pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] transition-all duration-300 ${user ? 'lg:ml-64' : ''}`}>
                <div className="max-w-7xl mx-auto">
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
};

export default Layout;
