import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {
      backgroundImage: {
        'signin-frame': "url('/Frame1.png')",
      },

      fontFamily: {
        nunito: ["Nunito_Sans", "sans-serif"],
      },
      colors: {
        content: "var(--content)",
        backdrop: "var(--backdrop)",
        tablebackdrop: "var(--table-backdrop)",
        danger: "var(--danger)",
        success: "var(--success)",
        btnoutline: "var(--btn-outline)",
        background: {
          DEFAULT: "var(--background)",
          transparent: "var(--background-transparent)"
        },
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
        },
        text:{
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        border: {
          DEFAULT: "var(--border)",
          accent: "var(--border-accent)",
          grey: "var(--border-grey)"
        }
      },
      boxShadow: {
        "popup": "2px 2px 10px 5px rgba(0,0,0,0.05)",
        "button": "2px 2px 10px 0px rgba(0,0,0,0.05)",
        "card": "2px 2px 10px 0px rgba(0,0,0,0.03)",
        "searchbar": "2px 2px 5px rgba(0, 0, 0, 0.03)",
        "dropdown": "2px 2px 5px rgba(0, 0, 0, 0.05)",
        "sidebar": "0px 16px 44px 0px rgba(0, 0, 0, 0.07)",
      },
      
    },
  },
  plugins: [],
};
export default config;