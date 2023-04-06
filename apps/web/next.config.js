/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  I18n,
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
}

module.exports = nextConfig
