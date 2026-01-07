import React, { useEffect, useState } from 'react';

export function PublicPage() {
    const [status, setStatus] = useState<'loading' | 'found' | 'not-found'>('loading');
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const queryTenant = searchParams.get('tenant');

        // Fetch resolution from backend
        // We pass the tenant as a header or query for the middleware to pick up if it's not domain-based yet
        const url = queryTenant ? `/api/v1/resolver/resolve-tenant?tenantId=${queryTenant}` : `/api/v1/resolver/resolve-tenant`;

        fetch(url)
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not found');
            })
            .then(data => {
                setDisplayText(data.domain || data.name || data.slug);
                setStatus('found');
            })
            .catch(() => {
                setStatus('not-found');
            });
    }, []);

    if (status === 'loading') {
        return <div className="min-h-screen bg-white" />;
    }

    if (status === 'not-found') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-black font-sans">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">404</h1>
                    <p className="text-gray-500 mt-2">Tenant Not Found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black font-sans">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Hello, {displayText}</h1>
                <p className="text-gray-500 mt-2">ReactPress 2.0 Alpha</p>
            </div>
        </div>
    );
}
