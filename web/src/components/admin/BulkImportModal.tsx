import React, { useState, useCallback } from 'react';
import { X, Upload, FileText, CheckCircle, XCircle, AlertTriangle, Loader2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../../lib/api';

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ParsedTenant {
    domain: string;
    name: string;
    slug: string;
    status: 'valid' | 'error' | 'warning' | 'exists';
    message?: string;
}

interface ImportResult {
    created: number;
    skipped: number;
    failed: number;
    details: { domain: string; status: string; message?: string }[];
}

// Helper: Generate name from domain
function domainToName(domain: string): string {
    const name = domain.split('.')[0]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    return name;
}

// Helper: Generate slug from domain
function domainToSlug(domain: string): string {
    return domain.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Helper: Validate domain format
function isValidDomain(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
    return domainRegex.test(domain);
}

export function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
    const [step, setStep] = useState<'input' | 'preview' | 'importing' | 'complete'>('input');
    const [domainText, setDomainText] = useState('');
    const [parsedTenants, setParsedTenants] = useState<ParsedTenant[]>([]);
    const [defaultStatus, setDefaultStatus] = useState('active');
    const [defaultPlan, setDefaultPlan] = useState('free');
    const [isValidating, setIsValidating] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [existingSlugs, setExistingSlugs] = useState<Set<string>>(new Set());

    // Fetch existing tenants to check for duplicates
    const fetchExistingTenants = useCallback(async () => {
        try {
            const res = await apiFetch('/api/v1/tenants');
            const data = await res.json();
            if (Array.isArray(data)) {
                setExistingSlugs(new Set(data.map((t: any) => t.slug)));
            }
        } catch (err) {
            console.error('Failed to fetch existing tenants', err);
        }
    }, []);

    // Parse and validate domains
    const handlePreview = useCallback(async () => {
        setIsValidating(true);
        await fetchExistingTenants();

        const lines = domainText
            .split('\n')
            .map(line => line.trim().toLowerCase())
            .filter(line => line.length > 0);

        const seen = new Set<string>();
        const parsed: ParsedTenant[] = [];

        for (const domain of lines) {
            const slug = domainToSlug(domain);

            // Skip duplicates in the input
            if (seen.has(domain)) continue;
            seen.add(domain);

            let status: ParsedTenant['status'] = 'valid';
            let message = '';

            if (!isValidDomain(domain)) {
                status = 'error';
                message = 'Invalid domain format';
            } else if (existingSlugs.has(slug)) {
                status = 'exists';
                message = 'Tenant already exists';
            }

            parsed.push({
                domain,
                name: domainToName(domain),
                slug,
                status,
                message
            });
        }

        setParsedTenants(parsed);
        setStep('preview');
        setIsValidating(false);
    }, [domainText, existingSlugs, fetchExistingTenants]);

    // Execute bulk import
    const handleImport = useCallback(async () => {
        setStep('importing');
        setImportProgress(0);

        const validTenants = parsedTenants.filter(t => t.status === 'valid');
        const results: ImportResult = { created: 0, skipped: 0, failed: 0, details: [] };

        // Import one-by-one for progress tracking
        for (let i = 0; i < validTenants.length; i++) {
            const tenant = validTenants[i];

            try {
                const res = await apiFetch('/api/v1/tenants', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: tenant.name,
                        slug: tenant.slug,
                        domain: tenant.domain,
                        status: defaultStatus,
                        plan_name: defaultPlan
                    })
                });

                if (res.ok) {
                    results.created++;
                    results.details.push({ domain: tenant.domain, status: 'created' });
                } else {
                    const error = await res.json();
                    if (error.error?.includes('exists')) {
                        results.skipped++;
                        results.details.push({ domain: tenant.domain, status: 'skipped', message: 'Already exists' });
                    } else {
                        results.failed++;
                        results.details.push({ domain: tenant.domain, status: 'failed', message: error.error });
                    }
                }
            } catch (err: any) {
                results.failed++;
                results.details.push({ domain: tenant.domain, status: 'failed', message: err.message });
            }

            setImportProgress(((i + 1) / validTenants.length) * 100);
        }

        // Add skipped tenants from preview
        parsedTenants.filter(t => t.status !== 'valid').forEach(t => {
            if (t.status === 'exists') {
                results.skipped++;
                results.details.push({ domain: t.domain, status: 'skipped', message: 'Already exists' });
            } else {
                results.failed++;
                results.details.push({ domain: t.domain, status: 'failed', message: t.message || 'Invalid' });
            }
        });

        setImportResult(results);
        setStep('complete');
        onSuccess();
    }, [parsedTenants, defaultStatus, defaultPlan, onSuccess]);

    // Reset modal state
    const handleClose = () => {
        setStep('input');
        setDomainText('');
        setParsedTenants([]);
        setImportResult(null);
        setImportProgress(0);
        onClose();
    };

    // Get counts
    const validCount = parsedTenants.filter(t => t.status === 'valid').length;
    const errorCount = parsedTenants.filter(t => t.status === 'error').length;
    const warningCount = parsedTenants.filter(t => t.status === 'warning' || t.status === 'exists').length;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
                >
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl bg-darker border border-border-muted rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-full sm:max-h-[85vh]"
                    >

                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-border-muted shrink-0 bg-darker">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-brand-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Bulk Import Tenants</h2>
                                    <p className="text-sm text-muted">
                                        {step === 'input' && 'Paste domain names to create multiple tenants'}
                                        {step === 'preview' && `Preview: ${validCount} valid, ${errorCount} errors, ${warningCount} warnings`}
                                        {step === 'importing' && 'Creating tenants...'}
                                        {step === 'complete' && 'Import complete!'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-muted" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {/* Step 1: Input */}
                            {step === 'input' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Paste Domains (one per line)
                                        </label>
                                        <textarea
                                            value={domainText}
                                            onChange={(e) => setDomainText(e.target.value)}
                                            placeholder={`example1.com\nexample2.com\nmycompany.org\n...`}
                                            className="w-full h-48 px-4 py-3 bg-dark border border-border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary font-mono text-sm resize-none"
                                        />
                                        <p className="text-xs text-muted mt-2">
                                            Name and slug will be auto-generated from domain
                                        </p>
                                    </div>

                                    {/* Default Settings */}
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-dark/50 rounded-xl border border-border-muted">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Default Status</label>
                                            <select
                                                value={defaultStatus}
                                                onChange={(e) => setDefaultStatus(e.target.value)}
                                                className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                                            >
                                                <option value="active">Active</option>
                                                <option value="trial">Trial</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Default Plan</label>
                                            <select
                                                value={defaultPlan}
                                                onChange={(e) => setDefaultPlan(e.target.value)}
                                                className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                                            >
                                                <option value="free">Free</option>
                                                <option value="starter">Starter</option>
                                                <option value="pro">Pro</option>
                                                <option value="enterprise">Enterprise</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Preview */}
                            {step === 'preview' && (
                                <div className="space-y-4">
                                    {/* Summary Stats */}
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm">
                                            <CheckCircle className="w-4 h-4" />
                                            {validCount} Valid
                                        </div>
                                        {errorCount > 0 && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm">
                                                <XCircle className="w-4 h-4" />
                                                {errorCount} Errors
                                            </div>
                                        )}
                                        {warningCount > 0 && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm">
                                                <AlertTriangle className="w-4 h-4" />
                                                {warningCount} Warnings
                                            </div>
                                        )}
                                    </div>

                                    {/* Preview Table */}
                                    <div className="border border-border-muted rounded-xl overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-dark/50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                                                    <th className="px-4 py-3 text-left font-medium text-muted">Domain</th>
                                                    <th className="px-4 py-3 text-left font-medium text-muted">Name</th>
                                                    <th className="px-4 py-3 text-left font-medium text-muted">Slug</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border-muted">
                                                {parsedTenants.slice(0, 10).map((tenant, i) => (
                                                    <tr key={i} className="hover:bg-white/[0.02]">
                                                        <td className="px-4 py-2.5">
                                                            {tenant.status === 'valid' && <CheckCircle className="w-4 h-4 text-green-400" />}
                                                            {tenant.status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                                                            {(tenant.status === 'warning' || tenant.status === 'exists') && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                                                        </td>
                                                        <td className="px-4 py-2.5 font-mono text-xs">{tenant.domain}</td>
                                                        <td className="px-4 py-2.5">{tenant.name}</td>
                                                        <td className="px-4 py-2.5 font-mono text-xs text-muted">{tenant.slug}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {parsedTenants.length > 10 && (
                                            <div className="px-4 py-2 bg-dark/30 text-muted text-sm text-center">
                                                And {parsedTenants.length - 10} more...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Importing */}
                            {step === 'importing' && (
                                <div className="space-y-6 py-8">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                                        <p className="text-lg font-medium">Creating tenants...</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-dark rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-brand-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${importProgress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                        <p className="text-center text-sm text-muted">{Math.round(importProgress)}% complete</p>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Complete */}
                            {step === 'complete' && importResult && (
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center gap-4 py-4">
                                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8 text-green-400" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-xl font-semibold">Import Complete!</h3>
                                            <p className="text-muted mt-1">
                                                {importResult.created} tenants created successfully
                                            </p>
                                        </div>
                                    </div>

                                    {/* Results Summary */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                                            <div className="text-2xl font-bold text-green-400">{importResult.created}</div>
                                            <div className="text-sm text-muted">Created</div>
                                        </div>
                                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
                                            <div className="text-2xl font-bold text-yellow-400">{importResult.skipped}</div>
                                            <div className="text-sm text-muted">Skipped</div>
                                        </div>
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                                            <div className="text-2xl font-bold text-red-400">{importResult.failed}</div>
                                            <div className="text-sm text-muted">Failed</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between p-5 border-t border-border-muted bg-darker shrink-0">
                            {step === 'input' && (
                                <>
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 border border-border-muted rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePreview}
                                        disabled={!domainText.trim() || isValidating}
                                        className="flex items-center gap-2 px-5 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {isValidating ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Validating...
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-4 h-4" />
                                                Next: Preview & Verify
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {step === 'preview' && (
                                <>
                                    <button
                                        onClick={() => setStep('input')}
                                        className="px-4 py-2 border border-border-muted rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleImport}
                                        disabled={validCount === 0}
                                        className="flex items-center gap-2 px-5 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Import {validCount} Tenant{validCount !== 1 ? 's' : ''}
                                    </button>
                                </>
                            )}

                            {step === 'complete' && (
                                <button
                                    onClick={handleClose}
                                    className="ml-auto px-5 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors"
                                >
                                    Done
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
