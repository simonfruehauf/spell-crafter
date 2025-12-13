/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                win95: {
                    gray: '#c0c0c0',
                    'dark-gray': '#808080',
                    'light-gray': '#dfdfdf',
                    white: '#ffffff',
                    black: '#000000',
                    blue: '#000080',
                    'blue-start': '#000080',
                    'blue-end': '#1084d0',
                    teal: '#008080',
                }
            },
            fontFamily: {
                system: ['Tahoma', 'MS Sans Serif', 'Segoe UI', 'sans-serif'],
                mono: ['Courier New', 'Consolas', 'monospace'],
            }
        },
    },
    plugins: [],
}
