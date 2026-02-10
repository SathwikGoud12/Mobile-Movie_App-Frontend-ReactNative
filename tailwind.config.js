/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0A0E27",
        "dark-100": "#161D2F",
        "dark-200": "#1F2937",
        "light-100": "#E8E8E8",
        "light-200": "#A8B5DB",
        "light-300": "#8B92B4",
        accent: "#AB8BFF",
      },
    },
  },
  plugins: [],
};
