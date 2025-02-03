import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./translations/en.json";
import hi from "./translations/hi.json";
import fr from "./translations/fr.json";
import es from "./translations/es.json";

const storedLanguage = localStorage.getItem("language") || "en";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            hi: { translation: hi },
            fr: { translation: fr },
            es: { translation: es },
        },
        lng: storedLanguage,
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    });

export default i18n;
