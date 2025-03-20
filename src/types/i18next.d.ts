import "i18next";
import en_US from "@/locales/en_US/common.json";
import ja_JP from "@/locales/ja_JP/common.json";

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "ns1";
        resources: {
            en_US: typeof en_US;
            ja_JP: typeof ja_JP;
        };
    }
}
