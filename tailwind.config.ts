import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#111827",
        secondary: "#6B7280",
        tertiary: "#2563EB",
        "tertiary-hover": "#1D4ED8",
        success: "#059669",
        "success-light": "#D1FAE5",
        danger: "#DC2626",
        "danger-light": "#FEE2E2",
        abstain: "#8B5CF6",
        "abstain-light": "#EDE9FE",
        neutral: "#F9FAFB",
        surface: "#FFFFFF",
        "surface-alt": "#F3F4F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      boxShadow: {
        modal: "0 4px 24px rgba(17,24,39,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
