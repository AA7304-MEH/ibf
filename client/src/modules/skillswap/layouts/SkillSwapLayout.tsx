import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar';
import Sidebar from '../../../components/layout/Sidebar';
import { useAuth } from '../../../context/AuthContext';

const SkillSwapLayout: React.FC = () => {
    const { user } = useAuth();

    // Theme: Educational Green

    return (
        <div className="min-h-screen bg-gray-50 transition-colors duration-300 theme-skillswap">
            <Navbar />

            {user && <Sidebar userRole={user.role} />}

            <main className={`pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] transition-all duration-300 ${user ? 'lg:ml-64' : ''}`}>
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SkillSwapLayout;
