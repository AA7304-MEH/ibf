import React from 'react';
import AuthPage from './AuthPage';

const Login: React.FC = () => {
    // Force login mode by ensuring URL has ?mode=login (handled by AuthPage or we mock it)
    // Actually AuthPage checks searchParams. We can just render AuthPage.
    // Ideally we pass a prop, but for now reuse AuthPage logic which reads URL.
    return <AuthPage />;
};
export default Login;
