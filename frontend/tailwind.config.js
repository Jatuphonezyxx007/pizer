/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true, // 1. ทำให้ .container อยู่ตรงกลาง (mx-auto) อัตโนมัติ
      padding: "1rem", // 2. กำหนด padding เริ่มต้น (เทียบเท่า px-6)

      // 3. กำหนดความกว้างสูงสุด (max-width) ที่แต่ละ breakpoint
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px", // <-- นี่คือความกว้างที่คุณกำหนดเอง (จากเดิม 1280px)
        "2xl": "1200px", // <-- กำหนดให้ '2xl' ใช้ความกว้างนี้ด้วย
      },
    },
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Thai Looped"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
