/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2b2b2b",
        muted: "#7c4867",
        pink50: "#fff7fb",
        pink100: "#fde6f1",
        pink200: "#f9d5e7",
        pink300: "#EFB6D1",
        pink400: "#EFA9CF",
        pink600: "#CE6BAF",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(206,107,175,.14)",
        btn: "0 8px 22px rgba(206,107,175,.25)",
      },
      borderRadius: { xl2: "16px" },
    },
  },
  plugins: [],
};
