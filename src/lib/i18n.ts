import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import JSON files (if manually loading translations)
import en_US from "@/../public/locales/en_US/common.json";
import ja_JP from "@/../public/locales/ja_JP/common.json";

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en_US: { translation: en_US },
            ja_JP: { translation: ja_JP },
        },
        supportedLngs: ["en_US", "ja_JP"],
        fallbackLng: "en_US",
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
        interpolation: {
            escapeValue: false,
        },
        returnObjects: true,
        lng: "ja_JP",
    });

export default i18n;
