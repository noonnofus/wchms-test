import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import JSON files (if manually loading translations)
import en_US from "@/locales/en_US/common.json";
import ja_JP from "@/locales/ja_JP/common.json";

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            English: { translation: en_US },
            Japanese: { translation: ja_JP },
        },
        supportedLngs: ["English", "Japanese"],
        fallbackLng: "Japanese",
        detection: {
            order: ["cookie", "localStorage", "navigator"],
            caches: ["cookie", "localStorage"],
        },
        interpolation: {
            escapeValue: false,
        },
        returnObjects: true,
        lng: "Japanese",
    });

export default i18n;
