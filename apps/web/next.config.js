/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
      }
    }

    return config
  },
  i18n,
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  async redirects() {
    return [
      {
        source: '/blogs/:slug',
        destination: '/:slug',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:slug.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/feed+json',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/:slug.json',
        destination: '/api/blogs/:slug',
      },
    ]
  },
}

module.exports = nextConfig
