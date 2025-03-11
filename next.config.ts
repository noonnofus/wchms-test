import type { NextConfig } from "next";
const i18nConfig = require("./next-i18next.config.ts");

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.cache = false;
        return config;
    },
};

module.exports = {
    i18n: {
        defaultLocale: "en_US", // ✅ Correctly define i18n here
        locales: ["en_US", "ja_JP"], // ✅ Ensure locales is an array
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com`,
            },
        ],
    },
};

export default nextConfig;
