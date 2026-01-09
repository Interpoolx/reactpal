import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// ============================================================================
// TOAST TYPES
// ============================================================================

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    hideToast: (id: string) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ToastContext = createContext<ToastContextType | null>(null);

/**
 * Hook to show toast notifications
 * 
 * Must be used within ToastProvider. Returns functions to show and hide toast notifications.
 * Toasts automatically dismiss after duration expires.
 * 
 * @returns {ToastContextType} Toast context with showToast and hideToast functions
 * @throws {Error} If not within ToastProvider
 * 
 * @example
 * const { showToast } = useToast();
 * 
 * // Show success toast (auto-dismisses after 4 seconds)
 * showToast('Saved successfully', 'success');
 * 
 * // Show error toast with custom duration (0 = no auto-dismiss)
 * showToast('Network error', 'error', 0);
 * 
 * // Show info toast
 * showToast('Processing...', 'info', 6000);
 * 
 * @note Types: 'success' | 'error' | 'info' | 'warning'
 * @note Default duration: 4000ms (4 seconds)
 */
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

// ============================================================================
// PROVIDER
// ============================================================================

/**
 * Provider component for toast notifications
 * 
 * Manages toast state and auto-dismissal. Should wrap entire application
 * (typically at root level) to allow any component to call useToast().
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that can access toasts
 * 
 * @example
 * import { ToastProvider } from '@/components/ui/Toast';
 * 
 * export default function App() {
 *   return (
 *     <ToastProvider>
 *       <YourAppContent />
 *     </ToastProvider>
 *   );
 * }
 * 
 * // Inside any component:
 * function MyComponent() {
 *   const { showToast } = useToast();
 *   return (
 *     <button onClick={() => showToast('Hello!', 'success')}>
 *       Show Toast
 *     </button>
 *   );
 * }
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 4000) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newToast: Toast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
            {children}
            <ToastContainer toasts={toasts} onClose={hideToast} />
        </ToastContext.Provider>
    );
}

// ============================================================================
// TOAST CONTAINER
// ============================================================================

/**
 * Internal component: renders container for all active toasts
 * 
 * Positions toasts in bottom-right corner with proper z-index.
 * Renders nothing if no toasts present.
 * 
 * @param {Toast[]} toasts - Array of active toast objects
 * @param {Function} onClose - Callback when toast closed (receives toast id)
 * @internal This is an internal component; use useToast() hook instead
 */
function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-md">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
            ))}
        </div>
    );
}

// ============================================================================
// TOAST ITEM
// ============================================================================

const toastStyles: Record<ToastType, { bg: string; border: string; icon: React.ElementType; iconColor: string }> = {
    success: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        icon: CheckCircle,
        iconColor: 'text-green-400',
    },
    error: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        icon: AlertCircle,
        iconColor: 'text-red-400',
    },
    warning: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        icon: AlertTriangle,
        iconColor: 'text-yellow-400',
    },
    info: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        icon: Info,
        iconColor: 'text-blue-400',
    },
};

/**
 * Internal component: renders individual toast notification
 * 
 * Displays styled toast with icon, message, and close button.
 * Styling based on toast type (success, error, warning, info).
 * 
 * @param {Toast} toast - Toast object with message, type, etc.
 * @param {Function} onClose - Callback when user closes toast
 * @internal This is an internal component; use useToast() hook instead
 */
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const style = toastStyles[toast.type];
    const Icon = style.icon;

    return (
        <div
            className={`
                flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl
                animate-slide-in-right
                ${style.bg} ${style.border}
            `}
            role="alert"
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${style.iconColor}`} />
            <p className="text-sm text-slate-100 font-medium flex-1">{toast.message}</p>
            <button
                onClick={onClose}
                className="text-muted hover:text-primary transition-colors flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
