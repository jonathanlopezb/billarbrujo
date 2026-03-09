/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'billar-dark': '#0a0b10',
        'billar-card': '#161822',
        'billar-neon': '#00ff88',
        'billar-purple': '#8800ff',
        'billar-gold': '#ffcc00',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      boxShadow: {
        'neon-glow': '0 0 15px rgba(0, 255, 136, 0.3)',
      }
    },
  },
  plugins: [],
}
