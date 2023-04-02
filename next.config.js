/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    largePageDataBytes: 256 * 1000,
  },
}

module.exports = nextConfig
