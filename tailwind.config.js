/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // TẮT PREFLIGHT ĐỂ KHÔNG LỖI STYLE CỦA ANT DESIGN
  },
  plugins: [],
}