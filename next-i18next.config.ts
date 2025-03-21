/** @type {import('next-i18next').UserConfig} */
const i18nConfig = {
    i18n: {
        defaultLocale: "en_US",
        locales: ["en_US", "ja_JP"],
    },
    localePath: "@/locales",
};

module.exports = i18nConfig;
