import React, { useState } from 'react';

export function LoginPage({ onLogin }: { onLogin: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (data.success) {
                onLogin();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Connection failed');
        }
    };

    return (
        <div className="admin-studio min-h-screen flex items-center justify-center bg-darker">
            <div className="glass p-8 rounded-2xl border border-border-muted w-full max-w-sm shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-6">Studio Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-muted mb-1 px-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-border-muted rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-muted mb-1 px-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-border-muted rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <div className="text-red-400 text-xs px-1">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-brand-primary py-3 rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors mt-2"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
