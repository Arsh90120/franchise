import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#050608',
        surface: '#0f1117',
        'surface-light': '#1a1d26',
        border: '#2a2e3a',
        orange: '#ff4d00',
        'orange-bright': '#ff6b2b',
        gold: '#ffcc00',
        'gold-bright': '#ffe066',
        muted: '#8a8f9d',
        text: '#f2f4f7',
        '2k-blue': '#00a2ff',
        '2k-red': '#ff003c',
      },
      fontFamily: {
        heading: ['Barlow Condensed', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        '700': '700',
        '800': '800',
      },
    },
  },
  plugins: [],
};

export default config;
