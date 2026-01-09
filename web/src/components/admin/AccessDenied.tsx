import React from 'react';
import { ShieldOff, ArrowLeft } from 'lucide-react';

interface AccessDeniedProps {
    title?: string;
    message?: string;
    showReturnButton?: boolean;
}

export function AccessDenied({
    title = 'Access Denied',
    message = "You don't have permission to access the admin panel.",
    showReturnButton = true
}: AccessDeniedProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md mx-auto px-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                    <ShieldOff className="w-10 h-10 text-red-400" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-red-400">
                        🚫 {title}
                    </h1>
                    <p className="text-muted text-sm">
                        {message}
                    </p>
                </div>

                {showReturnButton && (
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-border-muted rounded-xl hover:bg-white/10 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Return to Website
                    </a>
                )}
            </div>
        </div>
    );
}
