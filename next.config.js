/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverActions: true,
    },
    reactStrictMode: true,
    swcMinify: true,
};

module.exports = nextConfig
// export default nextConfig;
