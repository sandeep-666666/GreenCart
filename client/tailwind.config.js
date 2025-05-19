/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4fbf8b",
        "primary-dull": "#44ae7c",
      },
    },
  },
  plugins: [],
};
