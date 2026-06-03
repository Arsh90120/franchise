import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0c11',
        surface: '#13161e',
        border: '#1e2230',
        orange: '#f7501e',
        gold: '#f5c518',
        muted: '#6b7280',
        text: '#e8eaf0',
      },
      fontFamily: {
        heading: ['var(--font-barlow)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
