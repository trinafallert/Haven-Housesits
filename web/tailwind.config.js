/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Haven brand colors — light teal + cream
        haven: {
          teal:       '#5BA4A4',
          'teal-dark':'#3D8A8A',
          'teal-light':'#7ECECE',
          'teal-pale': '#D6EEEE',
          cream:      '#FBF8F3',
          'cream-dark':'#F0EBE0',
          sand:       '#E2D5BE',
          'sand-dark':'#C9B99A',
          navy:       '#1A2E35',
          'navy-light':'#2C4A55',
          gray:       '#5C6B73',
          'gray-light':'#9AACB3',
          'gray-pale': '#EEF3F5',
          success:    '#4CAF7D',
          warning:    '#F5A623',
          error:      '#E05C5C',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'haven': '0 4px 24px -4px rgba(91,164,164,0.18)',
        'haven-lg': '0 12px 48px -8px rgba(91,164,164,0.24)',
        'card': '0 2px 16px -2px rgba(26,46,53,0.10)',
        'card-hover': '0 8px 32px -4px rgba(26,46,53,0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
