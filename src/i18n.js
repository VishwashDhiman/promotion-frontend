import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en.json";
import translationFR from "./locales/fr.json";

// Configuring i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      fr: { translation: translationFR }
    },
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language if translation not found
    interpolation: { escapeValue: false }
  });

export default i18n;