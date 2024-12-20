import * as flowbite from 'flowbite-react/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', flowbite.content()],
  theme: {
    extend: {
      colors: {
        /**
         * defines the tailwind css color classes used by the theme based on declared css properties
         * to add additional theme colors, add to this list and update:
         * App.css
         */
        leftNavBg: 'var(--color-leftNavBg)',
        leftNavText: 'var(--color-leftNavText)',
        leftNavItemActive: 'var(--color-leftNavItemActive)',
      },
    },
  },
  plugins: [require('flowbite/plugin'), require('tailwind-scrollbar')],
};
