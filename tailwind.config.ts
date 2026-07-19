import type { Config } from "tailwindcss";

const config: Config = {
  // Only utilities/variants — keep the app's hand-tuned inline styles intact.
  corePlugins: { preflight: false },
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.94)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.28)" },
          "100%": { transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        // `backwards` fill: hidden during any stagger delay, then hands control
        // back to normal styles so :hover transforms keep working afterwards.
        "fade-in": "fade-in 0.25s ease-out backwards",
        "fade-in-up": "fade-in-up 0.45s cubic-bezier(0.2,0.8,0.2,1) backwards",
        "scale-in": "scale-in 0.24s cubic-bezier(0.2,0.8,0.2,1) backwards",
        "slide-down": "slide-down 0.18s cubic-bezier(0.2,0.8,0.2,1) backwards",
        "slide-up": "slide-up 0.18s cubic-bezier(0.2,0.8,0.2,1) backwards",
        pop: "pop 0.3s ease-out",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 1.4s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
