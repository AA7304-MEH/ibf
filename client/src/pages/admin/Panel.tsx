import React, { useState, useEffect } from 'react';
import AdminDashboard from '../../components/Dashboard/AdminDashboard';
import api from '../../services/api';

const AdminPanel: React.FC = () => {
    const [stats, setStats] = useState({
        pendingStartups: 5,
        totalUsers: 120,
        totalProjects: 45
    });

    // In a real app, fetch stats here
    // useEffect(() => {
    //     api.get('/admin/stats').then(res => setStats(res.data));
    // }, []);

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <AdminDashboard data={{ stats }} />
        </div>
    );
};
export default AdminPanel;
