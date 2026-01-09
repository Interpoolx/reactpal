import React, { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

export function PreviewBanner() {
    const { isPreviewMode, previewRole, previewStartTime, exitPreviewMode, getRoleDefinition, getRoleColor } = useRole();
    const [duration, setDuration] = useState('0m 0s');

    // Update duration every second
    useEffect(() => {
        if (!previewStartTime) return;

        const updateDuration = () => {
            const start = new Date(previewStartTime).getTime();
            const now = Date.now();
            const diff = Math.floor((now - start) / 1000);

            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            setDuration(`${minutes}m ${seconds}s`);
        };

        updateDuration();
        const interval = setInterval(updateDuration, 1000);

        return () => clearInterval(interval);
    }, [previewStartTime]);

    if (!isPreviewMode || !previewRole) return null;

    const roleDefinition = getRoleDefinition(previewRole);
    const roleColor = getRoleColor(previewRole);

    return (
        <div
            className="sticky top-16 z-20 flex items-center justify-between px-6 py-3 backdrop-blur-md border-b"
            style={{
                background: `linear-gradient(90deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.1))`,
                borderColor: 'rgba(245, 158, 11, 0.3)',
            }}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${roleColor}20`, border: `1px solid ${roleColor}40` }}
                >
                    <Eye className="w-4 h-4" style={{ color: roleColor }} />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-medium text-sm">
                        👁️ Previewing as
                    </span>
                    <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{
                            backgroundColor: `${roleColor}20`,
                            color: roleColor,
                            border: `1px solid ${roleColor}60`
                        }}
                    >
                        {roleDefinition.name}
                    </span>
                    <span className="text-amber-400/60 text-xs">
                        • {duration}
                    </span>
                </div>
            </div>

            <button
                onClick={exitPreviewMode}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all hover:bg-amber-500/20 border border-amber-500/30 text-amber-400"
            >
                <span>Exit Preview Mode</span>
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
