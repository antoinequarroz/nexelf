import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import progressionFr from "./locales/progression.fr.json";
import progressionEn from "./locales/progression.en.json";
import supportFr from "./locales/support.fr.json";
import supportEn from "./locales/support.en.json";

// i18n dès le premier écran, même en mono-langue.
// La règle qui compte : aucune chaîne de texte en dur dans un composant.
// Si elle tient, ajouter une langue est une après-midi. Sinon, une semaine.
const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: { fr: { translation: { ...fr, progression: progressionFr, support: supportFr } }, en: { translation: { ...en, progression: progressionEn, support: supportEn } } },
  lng: getLocales()[0]?.languageCode ?? "fr",
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

export default i18n;
