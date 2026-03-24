/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0f1b',
          900: '#111827',
          800: '#1e293b',
        },
        brand: {
          primary: '#2563eb',
          accent:  '#10b981',
          yellow:  '#fbbf24',
          red:     '#ef4444',
        }
      },
      boxShadow: {
        'brutal':    '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-blue':'8px 8px 0px 0px rgba(37,99,235,0.3)',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [],
}

