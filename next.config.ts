import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.cache = false;
        return config;
    },
};

module.exports = {
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
