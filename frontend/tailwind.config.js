/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070b14',
          900: '#0d1425',
          800: '#1e293b',
          700: '#334155',
        },
        brand: {
          primary: '#3b82f6',
          accent:  '#10b981',
          yellow:  '#f59e0b',
          red:     '#ef4444',
          cyan:    '#06b6d4',
          glass:   'rgba(255, 255, 255, 0.03)',
        }
      },
      boxShadow: {
        'premium':   '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'brutal':    '6px 6px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '3px 3px 0px 0px rgba(0,0,0,1)',
        'neon':      '0 0 20px rgba(59, 130, 246, 0.5)',
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.5)',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      }
    }
  },
  plugins: [],
}

