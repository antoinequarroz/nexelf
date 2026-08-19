/** Design tokens — Quiet Command / Next Lime. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "#090B0F",
        surface: "#11141A",
        raised: "#181C23",
        line: "#282D36",
        ink: "#F5F7FA",
        muted: "#A8AFBA",
        subtle: "#707783",
        lime: "#C7F36B",
        "lime-pressed": "#A9D84F",
        "lime-ink": "#172006",
        danger: "#FF7A86",
      },
      borderRadius: { sm: 10, DEFAULT: 14, lg: 18, xl: 24 },
      fontFamily: {
        display: ["Sora_600SemiBold"],
        body: ["Manrope_400Regular"],
        medium: ["Manrope_500Medium"],
        semibold: ["Manrope_600SemiBold"],
      },
      letterSpacing: { calm: "-0.02em" },
    },
  },
  plugins: [],
};
