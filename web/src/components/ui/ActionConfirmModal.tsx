import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Trash2, ShieldAlert } from 'lucide-react';

interface ActionConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export function ActionConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false
}: ActionConfirmModalProps) {
    if (!isOpen) return null;

    const icons = {
        danger: <Trash2 className="w-6 h-6 text-red-400" />,
        warning: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
        info: <ShieldAlert className="w-6 h-6 text-brand-primary" />,
    };

    const colors = {
        danger: 'bg-red-500/20 text-red-500',
        warning: 'bg-yellow-500/20 text-yellow-500',
        info: 'bg-brand-primary/20 text-brand-primary',
    };

    const buttons = {
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        info: 'bg-brand-primary hover:bg-brand-primary/90 text-white',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-md bg-darker border border-border-muted rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[variant]}`}>
                                    {icons[variant]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{title}</h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted" />
                                </button>
                            </div>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                {description}
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-border-muted rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50 ${buttons[variant]}`}
                                >
                                    {isLoading ? 'Processing...' : confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
