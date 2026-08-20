import type { ImageSource } from "expo-image";

// Metro requires static `require` calls. Being registered here is not enough
// to render an asset: the manifest must also mark it `approved`.
export const bundledMediaSources: Readonly<Record<string, ImageSource>> = {
  "assets/media/derivatives/elan-cap-onboarding-ouverture-01.jpg": require("../../../assets/media/derivatives/elan-cap-onboarding-ouverture-01.jpg"),
  "assets/media/derivatives/elan-gesture-objectifs-trajectoire-01.jpg": require("../../../assets/media/derivatives/elan-gesture-objectifs-trajectoire-01.jpg"),
  "assets/media/derivatives/elan-horizon-accueil-matin-01.jpg": require("../../../assets/media/derivatives/elan-horizon-accueil-matin-01.jpg"),
  "assets/media/derivatives/placeholder-elan-portrait-01.svg": require("../../../assets/media/derivatives/placeholder-elan-portrait-01.svg"),
  "assets/media/derivatives/placeholder-elan-square-01.svg": require("../../../assets/media/derivatives/placeholder-elan-square-01.svg"),
};
