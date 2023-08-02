/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config")

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        tls: false,
        net: false,
        path: false,
        child_process: false,
      }
    }

    return config
  },
  i18n,
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  async headers() {
    return [
      {
        source: "/:slug.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/feed+json",
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/signup",
        destination: "/auth/signup",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/:slug.json",
        destination: "/api/blogs/:slug",
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.chjh.nl",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "substackcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flavoursofopen.science",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "blog.front-matter.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.rogue-scholar.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ideasurg.pub",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "irishplants.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "libscie.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "blog.oa.works",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "opencitations.hypotheses.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.samuelmoore.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "syldavia-gazette.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upstream.force11.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "x-dev.pages.jsc.fz-juelich.de",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "elephantinthelab.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.scholcommlab.ca",
        pathname: "/**",
      },
    ],
  },
}

module.exports = nextConfig
