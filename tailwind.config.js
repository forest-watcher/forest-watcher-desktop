/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      base: ["Fira Sans", "sans-serif"]
    },
    colors: {
      white: "#FFFFFF",
      green: {
        400: "#E3ECC6",
        500: "#94BE43",
        600: "#799D33"
      },
      red: {
        500: "#F74848"
      },
      neutral: {
        300: "#FFFFFF",
        400: "#F2F2F2",
        500: "#DCDCDC",
        600: "#555555",
        700: "#333333"
      },
      black: {
        light: "#1A1A19",
        dark: "#000000"
      }
    },
    extend: {
      padding: {
        section: "60px"
      },
      spacing: {
        15: "3.75rem"
      }
    }
  },
  plugins: [require("@tailwindcss/line-clamp")]
};
