/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F5F1E8',
        'ivory-light': '#FAF8F3',
        forest: {
          DEFAULT: '#173D35',
          dark: '#102B25',
          light: '#23594D',
          muted: '#2A4D45',
          subtle: '#E8EFEA',
        },
        sage: {
          DEFAULT: '#D8DCC8',
          light: '#F0F3E8',
          border: '#C9CFB8',
          dark: '#7D8C6D',
        },
        coral: {
          DEFAULT: '#F16F52',
          hover: '#E05A3C',
          light: '#FDF1EE',
          tint: '#FDEAE5',
          border: '#F8B6A7',
          dark: '#C84E33',
        },
        ink: {
          DEFAULT: '#1D2926',
          muted: '#586863',
          light: '#7F918C',
          border: '#DDD8CD',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(23, 61, 53, 0.05), 0 1px 2px rgba(23, 61, 53, 0.03)',
        'card': '0 2px 8px rgba(23, 61, 53, 0.04), 0 1px 3px rgba(23, 61, 53, 0.03)',
        'selected': '0 0 0 2px #F16F52, 0 4px 12px rgba(241, 111, 82, 0.15)',
      },
    },
  },
  plugins: [],
}
