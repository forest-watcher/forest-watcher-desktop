/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      base: ["Fira Sans", "sans-serif"]
    },
    colors: {
      primary: {
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
        "500-10": "#5555551a",
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
      },
      fontFamily: {
        fira: "'Fira Sans', sans-serif"
      },
      maxWidth: {
        row: "68.7rem"
      },
      screens: {
        600: "600px",
        800: "800px"
      }
    }
  },
  plugins: [require("@tailwindcss/line-clamp")]
};
