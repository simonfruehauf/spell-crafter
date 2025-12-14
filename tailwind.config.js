/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                win95: {
                    gray: 'var(--win95-gray)',
                    'dark-gray': 'var(--win95-dark-gray)',
                    'light-gray': 'var(--win95-light-gray)',
                    white: 'var(--win95-white)',
                    black: 'var(--win95-black)',
                    blue: 'var(--win95-blue)',
                    'blue-start': 'var(--win95-blue-start)',
                    'blue-end': 'var(--win95-blue-end)',
                    teal: 'var(--win95-teal)',
                }
            },
            fontFamily: {
                system: ['var(--win95-font-system)'],
                mono: ['var(--win95-font-mono)'],
            }
        },
    },
    plugins: [],
}
