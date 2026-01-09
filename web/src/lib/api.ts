/**
 * Centralized API client for the frontend
 * 
 * Wraps the native fetch API with automatic:
 * - Bearer token injection from sessionStorage
 * - Content-Type application/json default
 * - 401 Unauthorized handling (clears session and redirects to login)
 * 
 * @param {string} url - API endpoint URL (e.g., '/api/v1/tenants')
 * @param {RequestInit} [options] - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>} Fetch response object
 * 
 * @example
 * // GET request
 * const res = await apiFetch('/api/v1/users');
 * const users = await res.json();
 * 
 * // POST request
 * const res = await apiFetch('/api/v1/users', {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' })
 * });
 * 
 * // Handle errors
 * const res = await apiFetch('/api/v1/users');
 * if (!res.ok) {
 *   const error = await res.json();
 *   console.error(error.message);
 * }
 * 
 * @note Token is read from sessionStorage.rp_admin_token
 * @note 401 responses clear token and redirect to /hpanel (login)
 */
export async function apiFetch(url: string, options: RequestInit = {}) {
    const token = sessionStorage.getItem('rp_admin_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    } as Record<string, string>;

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Handled expired or missing token by logging out
        console.warn('API returned 401 Unauthorized. Redirecting to login.');
        sessionStorage.removeItem('rp_admin_token');
        sessionStorage.removeItem('rp_admin_logged_in');
        // Simple redirect to login if we're in the browser
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/hpanel';
        }
    }

    return response;
}
