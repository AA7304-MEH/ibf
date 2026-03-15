/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // IBF Professional Color Palette
                ibf: {
                    blue: {
                        50: '#eff6ff',
                        100: '#dbeafe',
                        200: '#bfdbfe',
                        300: '#93c5fd',
                        400: '#60a5fa',
                        500: '#3b82f6',  // Primary brand color
                        600: '#2563eb',
                        700: '#1d4ed8',
                        800: '#1e40af',
                        900: '#1e3a8a',
                    },
                    purple: {
                        50: '#faf5ff',
                        100: '#f3e8ff',
                        200: '#e9d5ff',
                        300: '#d8b4fe',
                        400: '#c084fc',
                        500: '#a855f7',
                        600: '#9333ea',
                        700: '#7e22ce',
                        800: '#6b21a8',
                        900: '#581c87',
                    },
                    green: {
                        50: '#f0fdf4',
                        100: '#dcfce7',
                        200: '#bbf7d0',
                        300: '#86efac',
                        400: '#4ade80',
                        500: '#22c55e',
                        600: '#16a34a',
                        700: '#15803d',
                        800: '#166534',
                        900: '#14532d',
                    },
                    // Legacy mapping for existing components
                    secondary: '#a855f7',
                    accent: '#22c55e',
                    dark: '#0f172a',
                },
                primary: {
                    50: 'var(--color-primary-light)',
                    DEFAULT: 'var(--color-primary)',
                    600: 'var(--color-primary)',
                    800: 'var(--color-primary-dark)',
                },
                // Static-site-ibf dark theme colors
                navy: {
                    DEFAULT: '#0a0f1e',
                    light: '#111827',
                    card: '#0d1529',
                    border: '#1a2744',
                },
                teal: {
                    DEFAULT: '#00f5d4',
                    dim: '#00c4aa',
                    glow: 'rgba(0,245,212,0.15)',
                },
                amber: {
                    DEFAULT: '#ffbe0b',
                    dim: '#e5a800',
                    glow: 'rgba(255,190,11,0.15)',
                },
                muted: '#8b97b3',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
                syne: ['Syne', 'sans-serif'],
                dm: ['DM Sans', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                marquee: 'marquee 30s linear infinite',
                float: 'float 4s ease-in-out infinite',
                pulse_soft: 'pulseSoft 2s ease-in-out infinite',
                gradient: 'gradient 6s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                float: {
                    '0%,100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-16px)' },
                },
                pulseSoft: {
                    '0%,100%': { opacity: '1' },
                    '50%': { opacity: '0.6' },
                },
                gradient: {
                    '0%,100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            backgroundSize: {
                '200%': '200% 200%',
            },
            boxShadow: {
                teal: '0 0 30px rgba(0,245,212,0.25)',
                amber: '0 0 30px rgba(255,190,11,0.25)',
                glow: '0 8px 40px rgba(0,245,212,0.15)',
            },
        },
    },
    plugins: [],
}
