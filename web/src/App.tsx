import React, { useState } from 'react';
import { Shell } from './components/admin/Shell';
import { Dashboard } from './components/admin/Dashboard';
import { LoginPage } from './components/admin/LoginPage';
import { PublicPage } from './components/PublicPage';
import { TenantProvider } from './context/TenantContext';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return sessionStorage.getItem('rp_admin_logged_in') === 'true';
    });
    const path = window.location.pathname;

    const handleLogin = () => {
        setIsLoggedIn(true);
        sessionStorage.setItem('rp_admin_logged_in', 'true');
    };

    if (path === '/') {
        return <PublicPage />;
    }

    if (path === '/hpanel' && !isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <TenantProvider>
            <Shell>
                <Dashboard />
            </Shell>
        </TenantProvider>
    );
}

export default App;
