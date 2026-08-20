/** Design tokens — Élan lumineux. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "#FBF8F1",
        surface: "#FFFFFF",
        raised: "#F3EFE7",
        line: "#D9D5CC",
        ink: "#17233B",
        muted: "#526078",
        subtle: "#687386",
        action: "#31579D",
        "action-pressed": "#24447E",
        "action-ink": "#FFFFFF",
        progress: "#26734A",
        "progress-pressed": "#1D5A3A",
        "progress-ink": "#FFFFFF",
        impulse: "#FBE4D5",
        reflection: "#ECE7F7",
        growth: "#E2F0E5",
        success: "#26734A",
        "success-surface": "#E2F0E5",
        warning: "#8A4B08",
        "warning-surface": "#FFF0D5",
        danger: "#B4233C",
        "danger-surface": "#FCE8EC",
        "danger-ink": "#FFFFFF",
        focus: "#31579D",
        disabled: "#A8AFBA",
      },
      borderRadius: { sm: 10, DEFAULT: 14, lg: 18, xl: 24 },
      fontFamily: {
        display: ["Sora_600SemiBold"],
        body: ["Manrope_400Regular"],
        medium: ["Manrope_500Medium"],
        semibold: ["Manrope_600SemiBold"],
      },
      letterSpacing: { calm: "-0.02em" },
      // 48 dp satisfait Android et dépasse le minimum iOS de 44 pt.
      minHeight: { touch: 48 },
      minWidth: { touch: 48 },
    },
  },
  plugins: [],
};
