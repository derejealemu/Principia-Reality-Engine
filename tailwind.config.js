/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cosmos: {
                    900: '#050510',
                    800: '#0f0f25',
                    700: '#1a1a3d',
                    500: '#3b3b8c',
                    300: '#7e7eff',
                    100: '#e0e0ff',
                },
                neon: {
                    blue: '#00f3ff',
                    purple: '#bc13fe',
                    pink: '#ff0055',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
        },
    },
    plugins: [],
}
