import type { Config } from 'tailwindcss'

// Minimal scaffold config. The three-layer token architecture (primitive →
// semantic → component) and the tailwind-merge font-size fix land in S4.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
