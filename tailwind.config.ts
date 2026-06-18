import type { Config } from 'tailwindcss'

/* Finance OS — Tailwind wiring for the token system.
   colors + borderRadius are REPLACED (not extended) so the only colours and
   radii available are tokens — a stray `bg-gray-500` or `rounded-3xl` fails to
   compile, enforcing "zero rogue hex / 8px-max squircles". Utilities reference
   the semantic CSS variables in src/styles/tokens.css, so themes switch by
   toggling [data-theme] with no class changes. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',

      /* semantic (intent) — preferred in components */
      canvas: { DEFAULT: 'var(--c-canvas)', muted: 'var(--c-canvas-muted)' },
      surface: 'var(--c-surface)',
      elevated: 'var(--c-elevated)',
      inset: 'var(--c-inset)',
      overlay: 'var(--c-overlay)',
      fg: {
        DEFAULT: 'var(--c-fg)',
        muted: 'var(--c-fg-muted)',
        subtle: 'var(--c-fg-subtle)',
        onaccent: 'var(--c-fg-onaccent)',
      },
      border: {
        DEFAULT: 'var(--c-border)',
        strong: 'var(--c-border-strong)',
        subtle: 'var(--c-border-subtle)',
      },
      accent: {
        DEFAULT: 'var(--c-accent)',
        hover: 'var(--c-accent-hover)',
        press: 'var(--c-accent-press)',
        soft: 'var(--c-accent-soft)',
        text: 'var(--c-accent-text)',
        fg: 'var(--c-accent-fg)',
      },
      amber: {
        DEFAULT: 'var(--c-amber)',
        text: 'var(--c-amber-text)',
        soft: 'var(--c-amber-soft)',
      },
      brand: {
        DEFAULT: 'var(--c-brand)',
        soft: 'var(--c-brand-soft)',
      },
      success: { DEFAULT: 'var(--c-success)', soft: 'var(--c-success-soft)' },
      warning: { DEFAULT: 'var(--c-warning)', soft: 'var(--c-warning-soft)' },
      danger: {
        DEFAULT: 'var(--c-danger)',
        soft: 'var(--c-danger-soft)',
        solid: 'var(--c-danger-solid)',
        fg: 'var(--c-on-danger)',
      },
      info: { DEFAULT: 'var(--c-info)', soft: 'var(--c-info-soft)' },
      inverse: { DEFAULT: 'var(--c-inverse-bg)', fg: 'var(--c-inverse-fg)' },
      ring: 'var(--c-ring)',
    },

    borderRadius: {
      none: '0',
      xs: 'var(--radius-xs)',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      DEFAULT: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
    },

    extend: {
      fontFamily: {
        sans: ['"Anonymous Pro"', 'ui-monospace', 'monospace'],
        display: ['"Spline Sans"', 'system-ui', 'sans-serif'],
        body: ['"Anonymous Pro"', 'ui-monospace', 'monospace'],
        mono: ['"Anonymous Pro"', 'ui-monospace', 'monospace'],
      },

      /* type scale — [size, { lineHeight, letterSpacing, fontWeight }].
         Custom keys are registered in cn() so tailwind-merge keeps text colours. */
      fontSize: {
        'display-2xl': ['clamp(2.75rem, 5vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-xl': ['clamp(2.25rem, 4vw, 3.5rem)', { lineHeight: '1.07', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-lg': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '600' }],
        'display-md': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title-lg': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.005em', fontWeight: '600' }],
        'title-md': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'title-sm': ['1rem', { lineHeight: '1.45', letterSpacing: '0', fontWeight: '600' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.7', letterSpacing: '0' }],
        'body-md': ['0.9375rem', { lineHeight: '1.65', letterSpacing: '0' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        label: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '700' }],
        caption: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'mono-xs': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.04em', fontWeight: '700' }],
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        DEFAULT: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
        none: 'none',
      },

      backgroundImage: {
        'gradient-accent': 'var(--c-gradient-accent)',
      },

      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        spring: 'var(--ease-spring)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
      },

      ringColor: { DEFAULT: 'var(--c-ring)' },
      ringWidth: { DEFAULT: 'var(--ring-width)' },
      ringOffsetWidth: { DEFAULT: 'var(--ring-offset)' },
      ringOffsetColor: { DEFAULT: 'var(--c-canvas)' },
    },
  },
  plugins: [],
} satisfies Config
