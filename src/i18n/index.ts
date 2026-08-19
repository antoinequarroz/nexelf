import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

// i18n dès le premier écran, même en mono-langue.
// La règle qui compte : aucune chaîne de texte en dur dans un composant.
// Si elle tient, ajouter une langue est une après-midi. Sinon, une semaine.
const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en } },
  lng: getLocales()[0]?.languageCode ?? "fr",
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

export default i18n;
