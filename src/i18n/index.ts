import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import es from "./es.json";

function getUserLanguagePreferences(): string[] {
  const deviceLocales = getLocales();
  const preferences: string[] = [];

  // Add user's preferred languages in order
  for (const locale of deviceLocales) {
    if (locale.languageCode) {
      // Add full locale (e.g., 'es-MX')
      if (locale.regionCode) {
        preferences.push(`${locale.languageCode}-${locale.regionCode}`);
      }
      // Add language-only (e.g., 'es')
      if (!preferences.includes(locale.languageCode)) {
        preferences.push(locale.languageCode);
      }
    }
  }

  // English as final fallback
  if (!preferences.includes("en")) {
    preferences.push("en");
  }

  return preferences.length ? preferences : ["en"];
}
const userLanguagePreferences = getUserLanguagePreferences();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: userLanguagePreferences[0], // Primary language preference
  fallbackLng: userLanguagePreferences.slice(1), // Remaining preferences as fallbacks
  interpolation: {
    escapeValue: false,
  },
  // Enable clean key separation
  keySeparator: ".",
  nsSeparator: false, // Disable namespace separator since we're not using namespaces
});

export default i18n;
