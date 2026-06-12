export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#10b981",
        dark: "#0f172a",
        surface: "#1e293b",
        border: "#334155",
        muted: "#94a3b8",
      },
    },
  },
  plugins: [],
};