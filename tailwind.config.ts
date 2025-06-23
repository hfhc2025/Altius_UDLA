import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import animate from 'tailwindcss-animate'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      colors: {
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        destructive: 'var(--color-destructive)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        popover: 'var(--color-popover)',
        'popover-foreground': 'var(--color-popover-foreground)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',

        // Charts
        'chart-1': 'var(--color-chart-1)',
        'chart-2': 'var(--color-chart-2)',
        'chart-3': 'var(--color-chart-3)',
        'chart-4': 'var(--color-chart-4)',
        'chart-5': 'var(--color-chart-5)',

        // Sidebar
        sidebar: 'var(--color-sidebar)',
        'sidebar-foreground': 'var(--color-sidebar-foreground)',
        'sidebar-primary': 'var(--color-sidebar-primary)',
        'sidebar-primary-foreground': 'var(--color-sidebar-primary-foreground)',
        'sidebar-accent': 'var(--color-sidebar-accent)',
        'sidebar-accent-foreground': 'var(--color-sidebar-accent-foreground)',
        'sidebar-border': 'var(--color-sidebar-border)',
        'sidebar-ring': 'var(--color-sidebar-ring)',
      },
      fontFamily: {
        sans: ['Inter Tight', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        fade: 'fade 0.4s ease-in-out',
        slide: 'slide 0.3s ease-in-out',
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slide: {
          '0%': { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    animate,
    forms,
  ],
}

export default config