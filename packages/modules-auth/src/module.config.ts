/**
 * Authentication Module Configuration
 * This is the single source of truth for module metadata
 */
export const moduleConfig = {
    id: 'auth',
    name: 'Authentication',
    description: 'Login, sessions, password management, and security policies',
    longDescription: 'Comprehensive authentication system with multi-factor support, session management, password policies, and security event logging.',
    icon: 'Shield',
    version: '1.0.0',
    category: 'core' as const,
    isCore: true,
    features: [
        'Login/Logout',
        'Session Management',
        'Password Policies',
        'Security Events',
        'Multi-Factor Authentication',
    ],
    dependencies: [],
    tags: ['security', 'auth', 'login'],
};

export type ModuleConfig = typeof moduleConfig;
