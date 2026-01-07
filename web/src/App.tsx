import React, { useState } from 'react';
import { Shell } from './components/admin/Shell';
import { Dashboard } from './components/admin/Dashboard';
import { LoginPage } from './components/admin/LoginPage';
import { PublicPage } from './components/PublicPage';
import { TenantProvider } from './context/TenantContext';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const path = window.location.pathname;

    if (path === '/') {
        return <PublicPage />;
    }

    if (path === '/hpanel' && !isLoggedIn) {
        return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
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
