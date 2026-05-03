import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF7',
        ink: '#0F0F0F',
        accent: '#2D4A6B',
        rule: '#E5E5E2',
        muted: '#6B6B68',
        codeBg: '#F0F0EC',
      },
      fontFamily: {
        serif: [
          'Iowan Old Style',
          'Charter',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      maxWidth: {
        reading: '720px',
      },
      lineHeight: {
        body: '1.7',
      },
    },
  },
  plugins: [],
};

export default config;
