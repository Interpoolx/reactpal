import React, { useState, Suspense, lazy } from 'react';
import { Shell } from './components/admin/Shell';
import { LoginPage } from './components/admin/LoginPage';
import { PublicPage } from './components/PublicPage';
import { TenantProvider } from './context/TenantContext';
import { ToastProvider } from './components/ui/Toast';

// Lazy load admin pages for code splitting
const Dashboard = lazy(() => import('./components/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const TenantsPage = lazy(() => import('./components/admin/TenantsPage').then(m => ({ default: m.TenantsPage })));
const UsersPage = lazy(() => import('./components/admin/UsersPage').then(m => ({ default: m.UsersPage })));
const UserDetailPage = lazy(() => import('./components/admin/UserDetailPage').then(m => ({ default: m.UserDetailPage })));
const SettingsPage = lazy(() => import('./components/admin/SettingsPage').then(m => ({ default: m.SettingsPage })));
const SecurityPage = lazy(() => import('./components/admin/SecurityPage').then(m => ({ default: m.SecurityPage })));
const ModulesPage = lazy(() => import('./components/admin/ModulesPage').then(m => ({ default: m.ModulesPage })));
const ModuleDetailPage = lazy(() => import('./components/admin/ModuleDetailPage').then(m => ({ default: m.ModuleDetailPage })));
const RolesPage = lazy(() => import('./components/admin/RolesPage').then(m => ({ default: m.RolesPage })));
const InvitationsPage = lazy(() => import('./components/admin/InvitationsPage').then(m => ({ default: m.InvitationsPage })));

/**
 * Loading skeleton shown while lazy-loading page components
 * 
 * Displays animated placeholder content (title, content blocks) to provide
 * visual feedback while a page module is being code-split and loaded.
 * 
 * @returns {JSX.Element} Skeleton placeholder UI
 * @internal Used internally by Suspense fallback
 */
function PageSkeleton() {
    return (
        <div className="flex-1 p-8 space-y-6 animate-pulse">
            <div className="h-8 w-64 bg-white/10 rounded-lg" />
            <div className="h-64 bg-white/5 rounded-xl" />
            <div className="h-32 bg-white/5 rounded-xl" />
        </div>
    );
}

/**
 * Main App component with routing
 * 
 * Handles:
 * - Login state (persisted in sessionStorage)
 * - Route-based rendering (public vs admin pages)
 * - Auth protection (redirects unauthenticated users to login)
 * - Tenant context and toast provider setup
 * - Code-split lazy-loading of admin pages
 * 
 * Routes:
 * - "/" - Public landing page
 * - "/hpanel" - Admin dashboard (auth required)
 * - "/hpanel/users" - Users management page
 * - "/hpanel/tenants" - Tenants management page
 * - "/hpanel/modules" - Modules management page
 * - "/hpanel/settings" - Global settings page
 * - And other admin sub-routes...
 * 
 * @returns {JSX.Element} App layout based on current route
 * 
 * @example
 * // App entry point
 * import App from '@/App';
 * const root = ReactDOM.createRoot(document.getElementById('root'));
 * root.render(<App />);
 */
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

    // Require login for all /hpanel routes
    if (path.startsWith('/hpanel') && !isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    // Admin routes (wrapped in TenantProvider and Shell with Suspense)
    const renderAdminContent = () => {
        if (path === '/hpanel/tenants') return <TenantsPage />;
        if (path === '/hpanel/users') return <UsersPage />;
        if (path.startsWith('/hpanel/users/view')) return <UserDetailPage />;
        if (path === '/hpanel/users/roles') return <RolesPage />;
        if (path === '/hpanel/users/invitations') return <InvitationsPage />;
        if (path === '/hpanel/settings') return <SettingsPage />;
        if (path === '/hpanel/security') return <SecurityPage />;
        if (path === '/hpanel/modules') return <ModulesPage />;
        if (path.startsWith('/hpanel/modules/view')) return <ModuleDetailPage />;
        return <Dashboard />;
    };

    return (
        <ToastProvider>
            <TenantProvider>
                <Shell>
                    <Suspense fallback={<PageSkeleton />}>
                        {renderAdminContent()}
                    </Suspense>
                </Shell>
            </TenantProvider>
        </ToastProvider>
    );
}

export default App;
