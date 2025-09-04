/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
                'geist': ['var(--font-geist-sans)', 'sans-serif'],
                'geist-mono': ['var(--font-geist-mono)', 'monospace'],
                'inter': ['var(--font-inter)', 'sans-serif'],
                'garnet-script': ['Garnet', 'cursive'],
            },
        },
    },
    plugins: [],
}
