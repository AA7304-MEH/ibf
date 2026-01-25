import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PrivateRouteProps {
    allowedRoles?: string[];
    children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-ibf-dark">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-ibf-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard home
        if (user.role === 'student') return <Navigate to="/skillswap" replace />;
        if (user.role === 'talent') return <Navigate to="/dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
