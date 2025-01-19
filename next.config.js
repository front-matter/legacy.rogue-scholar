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
      {
        source: "/posts",
        destination: "/",
        permanent: true,
      },
    ]
  },
  images: {
    unoptimized: true,
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
        hostname: "*.githubusercontent.com",
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
        hostname: "s0.wp.com",
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
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bjoern.brembs.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lab.sub.uni-goettingen.de",
        pathname: "/**",
      },
      {
        hostname: "*.blogspot.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        pathname: "/**",
      },
      {
        hostname: "*.files.wordpress.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wp.biologos.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tarleb.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "blog.dini.de",
        pathname: "/**",
      },
      {
        hostname: "blogs.tib.eu",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.unh.edu",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.staticflickr.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.businessinsider.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "citation.js.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.basicbooks.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "farrellmedia.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "digitalpress.fra1.cdn.digitaloceanspaces.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pics.filmaffinity.com",
        pathname: "/**",
      },
      {
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upstream.force11.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "grieve-smith.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "x-dev.pages.jsc.fz-juelich.de",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
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
      {
        protocol: "http",
        hostname: "gigasciencejournal.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s.w.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.leidenmadtrics.nl",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "eve.gd",
        pathname: "/**",
      },
    ],
  },
}

module.exports = nextConfig

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs")

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "front-matter-1e",
    project: "rogue-scholar",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
)
