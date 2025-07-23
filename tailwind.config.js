/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primaryLight: "#e0f2ff",       // Soft pastel blue
        lightBg: "#ffffff",            // Pure white
        accentLight: "#94d2ff",        // Blue accent (e.g. for buttons or hover)
        darkBg: "#10002B",             // Russian violet
        darkAccent: "#3C1A59",         // Deep gradient partner
        lightBlue: "#EBF5FF",          // Optional contrast color
      },
      backgroundImage: {
        light: "radial-gradient(circle at top left, #ffffff, #e0f2ff)",
        dark: "linear-gradient(145deg, #10002B 0%, #3C1A59 100%)",
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
