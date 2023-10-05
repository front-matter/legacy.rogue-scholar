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
      {
        source: "/blogs/tcw6w29",
        destination: "/blogs/andrewheiss",
        permanent: true,
      },
      {
        source: "/blogs/468ap65",
        destination: "/blogs/behind_the_science",
        permanent: true,
      },
      {
        source: "/blogs/8q8xh52",
        destination: "/blogs/brembs",
        permanent: true,
      },
      {
        source: "/blogs/y3h0g22",
        destination: "/blogs/researchsoft",
        permanent: true,
      },
      {
        source: "/blogs/n6x4a73",
        destination: "/blogs/chjh",
        permanent: true,
      },
      {
        source: "/blogs/62prc14",
        destination: "/blogs/chroknowlogy",
        permanent: true,
      },
      {
        source: "/blogs/prmb582",
        destination: "/blogs/csl",
        permanent: true,
      },
      {
        source: "/blogs/ak4s224",
        destination: "/blogs/markrubin",
        permanent: true,
      },
      {
        source: "/blogs/sxp4r07",
        destination: "/blogs/danielskatz",
        permanent: true,
      },
      {
        source: "/blogs/k0zyf54",
        destination: "/blogs/donnywinston",
        permanent: true,
      },
      {
        source: "/blogs/6aswq28",
        destination: "/blogs/norbisley",
        permanent: true,
      },
      {
        source: "/blogs/526jy42",
        destination: "/blogs/elephantinthelab",
        permanent: true,
      },
      {
        source: "/blogs/mdh1h61",
        destination: "/blogs/epub_fis",
        permanent: true,
      },
      {
        source: "/blogs/hjkgw43",
        destination: "/blogs/flavoursofopen",
        permanent: true,
      },
      {
        source: "/blogs/f0m0e38",
        destination: "/blogs/front_matter",
        permanent: true,
      },
      {
        source: "/blogs/3ffcd46",
        destination: "/blogs/gigablog",
        permanent: true,
      },
      {
        source: "/blogs/3cxcm20",
        destination: "/blogs/ideas",
        permanent: true,
      },
      {
        source: "/blogs/tyfqw20",
        destination: "/blogs/iphylo",
        permanent: true,
      },
      {
        source: "/blogs/2bzkh64",
        destination: "/blogs/irishplants",
        permanent: true,
      },
      {
        source: "/blogs/h56tk29",
        destination: "/blogs/jabberwocky_ecology",
        permanent: true,
      },
      {
        source: "/blogs/8epr274",
        destination: "/blogs/joss",
        permanent: true,
      },
      {
        source: "/blogs/1senr81",
        destination: "/blogs/x_dev",
        permanent: true,
      },
      {
        source: "/blogs/6hezn63",
        destination: "/blogs/lab_sub",
        permanent: true,
      },
      {
        source: "/blogs/yzgx124",
        destination: "/blogs/leidenmadtrics",
        permanent: true,
      },
      {
        source: "/blogs/h49ct36",
        destination: "/blogs/libscie",
        permanent: true,
      },
      {
        source: "/blogs/z4b9d78",
        destination: "/blogs/eve",
        permanent: true,
      },
      {
        source: "/blogs/h7bpg11",
        destination: "/blogs/oa_works",
        permanent: true,
      },
      {
        source: "/blogs/gzqej46",
        destination: "/blogs/opencitations",
        permanent: true,
      },
      {
        source: "/blogs/s1e9w75",
        destination: "/blogs/quantixed",
        permanent: true,
      },
      {
        source: "/blogs/5764g49",
        destination: "/blogs/sfmatheson",
        permanent: true,
      },
      {
        source: "/blogs/gr1by89",
        destination: "/blogs/samuelmoore",
        permanent: true,
      },
      {
        source: "/blogs/dkvra02",
        destination: "/blogs/svpow",
        permanent: true,
      },
      {
        source: "/blogs/njrre84",
        destination: "/blogs/scholcommlab",
        permanent: true,
      },
      {
        source: "/blogs/ez7c883",
        destination: "/blogs/clearskiesadam",
        permanent: true,
      },
      {
        source: "/blogs/sfkfh60",
        destination: "/blogs/kj_garza",
        permanent: true,
      },
      {
        source: "/blogs/4tzex21",
        destination: "/blogs/rubinpsyc",
        permanent: true,
      },
      {
        source: "/blogs/f4wdg32",
        destination: "/blogs/syldavia_gazette",
        permanent: true,
      },
      {
        source: "/blogs/y55kq35",
        destination: "/blogs/syntaxus_baccata",
        permanent: true,
      },
      {
        source: "/blogs/7gyq558",
        destination: "/blogs/tarleb",
        permanent: true,
      },
      {
        source: "/blogs/4425y27",
        destination: "/blogs/grieve_smith",
        permanent: true,
      },
      {
        source: "/blogs/pm0p222",
        destination: "/blogs/upstream",
        permanent: true,
      },
      {
        source: "/blogs/34zkv26",
        destination: "/blogs/wisspub",
        permanent: true,
      },
      {
        source: "/api/posts/not_indexed",
        destination: "https://api.rogue-scholar.org/posts/not_indexed",
        permanent: true,
        basePath: false,
      },
      {
        source: "/api/posts/unregistered",
        destination: "https://api.rogue-scholar.org/posts/unregistered",
        permanent: true,
        basePath: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/:slug.json",
        destination: "/api/blogs/:slug",
      },
      {
        source: "/posts/:slug.bib",
        destination: "/api/posts/:slug?format=bibtex",
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
        hostname: "db.rogue-scholar.org",
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
