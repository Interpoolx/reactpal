/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: "#09090b",
                darker: "#020617",
                muted: "#94a3b8",
                brand: {
                    primary: "#3b82f6",
                    secondary: "#6366f1",
                },
                border: {
                    muted: "#1e293b",
                }
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(2, 6, 23, 0.8) 100%)',
            }
        },
    },
    plugins: [],
}
