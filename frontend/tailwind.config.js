/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f4f7ff',
          100: '#e3ecff',
          200: '#c5d7ff',
          300: '#9fb8ff',
          400: '#7793ff',
          500: '#4d6aff',
          600: '#374dea',
          700: '#2939be',
          800: '#202f99',
          900: '#1b287c',
        },
        accent: {
          400: '#ffb347',
          500: '#ff9f1c',
          600: '#ff7a00',
        },
      },
      boxShadow: {
        glow: '0 20px 45px -15px rgba(77, 106, 255, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at top left, rgba(77, 106, 255, 0.25), rgba(255, 159, 28, 0.15))',
        'gradient-glow': 'linear-gradient(135deg, rgba(77, 106, 255, 0.9), rgba(255, 159, 28, 0.9))',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
