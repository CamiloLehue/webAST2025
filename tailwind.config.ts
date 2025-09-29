import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          100: '#1e40af',
          200: '#1d4ed8',
        },
        'accent': {
          100: '#10b981',
          200: '#059669',
        },
        'bg': {
          100: '#f8fafc',
          200: '#64748b',
          300: '#475569',
          400: '#334155',
        }
      }
    },
  },
  plugins: [],
} satisfies Config;