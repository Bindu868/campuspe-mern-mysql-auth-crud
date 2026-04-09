/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a'
        },
        ink: '#122033',
        mist: '#eef6f7',
        peach: '#fff3e8'
      },
      boxShadow: {
        soft: '0 20px 45px rgba(18, 32, 51, 0.12)'
      }
    }
  },
  plugins: []
};
