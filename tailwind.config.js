import { heroui } from '@heroui/react'
import TailwindScrollbar from 'tailwind-scrollbar'
import TailwindAnimate from 'tailwindcss-animate'

// eslint-disable-next-line import/no-default-export
export default {
  darkMode: ['class'],
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './**/*.{ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#F7F1FF',
          100: '#dac8fa',
          200: '#c1a3f7',
          300: '#a77bf5',
          400: '#925bf1',
          500: '#7c3aed',
          600: '#7035e6',
          700: '#602cdd',
          800: '#5025d7',
          900: '#3213ce',
          DEFAULT: '#3A3A3E',
          foreground: '#FFFFFF',
        },
        secondary: {
          50: '#F7F1FF',
          100: '#dac8fa',
          200: '#c1a3f7',
          300: '#a77bf5',
          400: '#925bf1',
          500: '#7c3aed',
          600: '#7035e6',
          700: '#602cdd',
          800: '#5025d7',
          900: '#3213ce',
          DEFAULT: '#7c3aed',
          foreground: '#FFFFFF',
        },

        foreground: '#2E1E4A',
        background: '#FAFAFA',
      },
      fontFamily: {
        outfit: ['Outfit Variable', 'sans-serif'],
        inter: ['Inter Variable', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        typing: 'typing 1s ease-in-out infinite',
        marquee: 'marquee 10s linear infinite',
      },
      keyframes: {
        typing: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(2)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      layout: {
        fontSize: {
          sm: '12px',
          md: '14px',
          lg: '16px',
          DEFAULT: '14px',
        },
        radius: {
          sm: '4px',
          md: '8px',
          lg: '12px',
          default: '8px',
        },
      },
    },
  },
  plugins: [
    TailwindAnimate,
    TailwindScrollbar,
    heroui({
      prefix: 'moraa',
      themes: {
        'moraa-light': {
          extend: 'light',
          colors: {
            foreground: '#2E1E4A',
            background: '#FAFAFA',
          },
          layout: {
            fontSize: {
              sm: '12px',
              md: '14px',
              lg: '16px',
              DEFAULT: '14px',
            },
            radius: {
              tiny: '2px',
              small: '4px',
              medium: '8px',
              large: '12px',
              default: '8px',
            },
          },
        },
      },
    }),
  ],
}
