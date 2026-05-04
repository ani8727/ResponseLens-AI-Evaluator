module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,jsx}'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            },
            colors: {
                primary: {
                    DEFAULT: '#2563eb',
                    600: '#2563eb',
                    700: '#1d4ed8'
                }
            }
        },
    },
    plugins: [],
};
