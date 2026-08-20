// Miroir TypeScript des tokens NativeWind pour les API natives.
// Aucune couleur en dur ailleurs dans l'application.
export const theme = {
  background: "#FBF8F1",
  surface: "#FFFFFF",
  surfaceRaised: "#F3EFE7",
  border: "#D9D5CC",
  text: "#17233B",
  textMuted: "#526078",
  textSubtle: "#687386",
  action: "#31579D",
  actionPressed: "#24447E",
  onAction: "#FFFFFF",
  progress: "#26734A",
  progressPressed: "#1D5A3A",
  onProgress: "#FFFFFF",
  impulseSurface: "#FBE4D5",
  reflectionSurface: "#ECE7F7",
  growthSurface: "#E2F0E5",
  danger: "#B4233C",
  onDanger: "#FFFFFF",
  // Alias temporaires : les écrans existants migreront avec la story 16.
  lime: "#31579D",
  limePressed: "#24447E",
  limeInk: "#FFFFFF",
} as const;
