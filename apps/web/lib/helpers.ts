// import Cors from "cors"
import { capitalize, isObject, isString, truncate } from "lodash"
import path from "path"
const he = require("he")
const fs = require("fs")
const download = require("image-downloader")

import { Mod97_10 } from "@konfirm/iso7064"
import fetch from "cross-fetch"
import { fromUnixTime, getUnixTime } from "date-fns"
import { franc } from "franc"
import nodePandoc from "node-pandoc-promise"
import sanitizeHtml from "sanitize-html"
const { CrockfordBase32 } = require("crockford-base32")

import { BlogType } from "@/types/blog"

export function getBaseURL() {
  const url =
    process?.env?.NEXT_PUBLIC_SITE_URL ||
    process?.env?.VERCEL_URL ||
    "http://localhost:3000"

  return url.includes("http") ? url : `https://${url}`
}

export function formatPrice({
  locale,
  currency,
  amount,
}: {
  locale?: string
  currency?: string
  amount?: number
}) {
  return new Intl.NumberFormat(locale ?? "en-US", {
    style: "currency",
    currency: currency ?? "USD",
    minimumFractionDigits: 0,
  }).format((amount ?? 0) / 100)
}

/**
 * This helper invalidates the router cache so that the next navigation will run the middleware again
 * See https://github.com/clerkinc/javascript/blob/712c8ea792693a335d9bf39c28e550216cb71bcb/packages/nextjs/src/client/invalidateNextRouterCache.ts for more details
 */
export const invalidateNextRouterCache = () => {
  if (typeof window === "undefined") return

  const invalidate = (cache: any) => {
    Object.keys(cache).forEach((key) => {
      delete cache[key]
    })
  }

  try {
    invalidate((window as any).next.router.sdc)
    invalidate((window as any).next.router.sbc)
  } catch (e) {
    return
  }
}

export const isUrl = (url: any) => {
  try {
    return new URL(url)
  } catch (error) {
    return false
  }
}

export const isValidUrl = (url = "") => {
  try {
    const ourl = new URL(url)

    return (
      ourl !== null &&
      ["https:", "http:", "data:", "mailto:"].includes(ourl.protocol)
    )
  } catch (err) {
    return false
  }
}

export const isDoi = (doi: any) => {
  try {
    return new URL(doi).hostname === "doi.org"
  } catch (error) {
    return false
  }
}

export const isOrcid = (orcid: any) => {
  try {
    return new URL(orcid).hostname === "orcid.org"
  } catch (error) {
    return false
  }
}

export const isRor = (ror: any) => {
  try {
    return new URL(ror).hostname === "ror.org"
  } catch (error) {
    return false
  }
}

// from @extractus/feed-extractor
export const toISODateString = (dstr) => {
  try {
    return dstr ? new Date(dstr).toISOString().split(".")[0] + "Z" : null
  } catch (err) {
    return ""
  }
}

export const toISODate = (dstr) => {
  return fromUnixTime(dstr)
}

export const toISOString = (dstr) => {
  const date = fromUnixTime(dstr)

  return toISODateString(date)
}

export const toUnixTime = (dstr) => {
  const date = new Date(dstr)

  return getUnixTime(date)
}

// from https://stackoverflow.com/questions/784586/convert-special-characters-to-html-in-javascript
export const decodeHtmlCharCodes = (str: any) => {
  if (!isString(str)) return str

  return he.decode(str)
}

export const getPagination = (page, size) => {
  const from = page > 1 ? (page - 1) * size : 0
  const to = from + size - 1

  return { from, to }
}

export const toWords = (number: number) => {
  return number
}

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export const initMiddleware = (middleware) => {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

// Initialize the cors middleware
// export const cors = initMiddleware(
//   Cors({
//     methods: ["GET", "POST", "OPTIONS"],
//   })
// )

// from https://github.com/wooorm/iso-639-3/blob/main/iso6393-to-1.json
export const iso6393To1 = {
  aar: "aa",
  abk: "ab",
  afr: "af",
  aka: "ak",
  amh: "am",
  ara: "ar",
  arg: "an",
  asm: "as",
  ava: "av",
  ave: "ae",
  aym: "ay",
  aze: "az",
  bak: "ba",
  bam: "bm",
  bel: "be",
  ben: "bn",
  bis: "bi",
  bod: "bo",
  bos: "bs",
  bre: "br",
  bul: "bg",
  cat: "ca",
  ces: "cs",
  cha: "ch",
  che: "ce",
  chu: "cu",
  chv: "cv",
  cor: "kw",
  cos: "co",
  cre: "cr",
  cym: "cy",
  dan: "da",
  deu: "de",
  div: "dv",
  dzo: "dz",
  ell: "el",
  eng: "en",
  epo: "eo",
  est: "et",
  eus: "eu",
  ewe: "ee",
  fao: "fo",
  fas: "fa",
  fij: "fj",
  fin: "fi",
  fra: "fr",
  fry: "fy",
  ful: "ff",
  gla: "gd",
  gle: "ga",
  glg: "gl",
  glv: "gv",
  grn: "gn",
  guj: "gu",
  hat: "ht",
  hau: "ha",
  hbs: "sh",
  heb: "he",
  her: "hz",
  hin: "hi",
  hmo: "ho",
  hrv: "hr",
  hun: "hu",
  hye: "hy",
  ibo: "ig",
  ido: "io",
  iii: "ii",
  iku: "iu",
  ile: "ie",
  ina: "ia",
  ind: "id",
  ipk: "ik",
  isl: "is",
  ita: "it",
  jav: "jv",
  jpn: "ja",
  kal: "kl",
  kan: "kn",
  kas: "ks",
  kat: "ka",
  kau: "kr",
  kaz: "kk",
  khm: "km",
  kik: "ki",
  kin: "rw",
  kir: "ky",
  kom: "kv",
  kon: "kg",
  kor: "ko",
  kua: "kj",
  kur: "ku",
  lao: "lo",
  lat: "la",
  lav: "lv",
  lim: "li",
  lin: "ln",
  lit: "lt",
  ltz: "lb",
  lub: "lu",
  lug: "lg",
  mah: "mh",
  mal: "ml",
  mar: "mr",
  mkd: "mk",
  mlg: "mg",
  mlt: "mt",
  mon: "mn",
  mri: "mi",
  msa: "ms",
  mya: "my",
  nau: "na",
  nav: "nv",
  nbl: "nr",
  nde: "nd",
  ndo: "ng",
  nep: "ne",
  nld: "nl",
  nno: "nn",
  nob: "nb",
  nor: "no",
  nya: "ny",
  oci: "oc",
  oji: "oj",
  ori: "or",
  orm: "om",
  oss: "os",
  pan: "pa",
  pli: "pi",
  pol: "pl",
  por: "pt",
  pus: "ps",
  que: "qu",
  roh: "rm",
  ron: "ro",
  run: "rn",
  rus: "ru",
  sag: "sg",
  san: "sa",
  sin: "si",
  slk: "sk",
  slv: "sl",
  sme: "se",
  smo: "sm",
  sna: "sn",
  snd: "sd",
  som: "so",
  sot: "st",
  spa: "es",
  sqi: "sq",
  srd: "sc",
  srp: "sr",
  ssw: "ss",
  sun: "su",
  swa: "sw",
  swe: "sv",
  tah: "ty",
  tam: "ta",
  tat: "tt",
  tel: "te",
  tgk: "tg",
  tgl: "tl",
  tha: "th",
  tir: "ti",
  ton: "to",
  tsn: "tn",
  tso: "ts",
  tuk: "tk",
  tur: "tr",
  twi: "tw",
  uig: "ug",
  ukr: "uk",
  urd: "ur",
  uzb: "uz",
  ven: "ve",
  vie: "vi",
  vol: "vo",
  wln: "wa",
  wol: "wo",
  xho: "xh",
  yid: "yi",
  yor: "yo",
  zha: "za",
  zho: "zh",
  zul: "zu",
}

export const detectLanguage = (text: string) => {
  const iso693Language = franc(text)

  return iso6393To1[iso693Language]
}

export const generateBlogId = () => {
  // generates base32 encoded string with 5 digits from random number
  // With base32 there are 32 possible digits, so 5 digits gives 32^5 possible combinations
  // random_int = SecureRandom.random_number(32 ** 4..(32 ** 5) - 1)

  const randomNumber = Math.floor(Math.random() * 32 ** 5) + 1
  const encoded = CrockfordBase32.encode(randomNumber).toLowerCase()
  const checksum = Mod97_10.checksum(randomNumber.toString())

  return encoded + checksum
}

export function validateUrl(url: string) {
  const response = fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Not found")
      else return url
    })
    .catch((error) => {
      console.log(error)
      return null
    })

  return response
}

// export async function validateFeedUrl(url: string) {
//   const res = await fetch(url)

//   if (res.status === 200) {
//     const contentType = res.headers.get("content-type")?.split(";")[0]

//     if (
//       [
//         "application/rss+xml",
//         "application/atom+xml",
//         "application/xml",
//         "text/xml",
//         "application/json+feed",
//       ].includes(contentType as string)
//     ) {
//       return url
//     } else if (contentType === "text/html") {
//       // parse homepage for feed url
//       const html = await res.text()
//       const feedLink = html.match(
//         /<link[^>]+(type="application\/(rss\+xml|atom\+xml)"|type="application\/(rss|atom)"[^>]+(rel="alternate"|rel="alternate feed"))[^>]+(href="([^"]+)")[^>]*>/gi
//       )?.[0] as string
//       const feedUrl = feedLink.match(/href="([^"]+)"/i)?.[1] as string

//       return feedUrl
//     } else {
//       throw new Error("Invalid feed format")
//     }
//   } else {
//     return null
//   }
// }

// export function normalizeImage(image: string) {
//   const imageUrl = new URL(image)
//   if (imageUrl.hostname === "images.unsplash.com") {

//   return image
// }

export async function extractImage(
  src: string,
  blog_home_page_url: string,
  blog_id: string
) {
  if (!src) return null

  // determine host, only store images hosted by blog
  if (new URL(src).hostname !== new URL(blog_home_page_url).hostname)
    return null

  let pathname = src.substring(0, src.lastIndexOf("/"))

  // replace host path with local folder
  pathname = pathname.replace(blog_home_page_url, `/public/images/${blog_id}`)

  // use full path
  const dest = path.join(process.cwd(), pathname)

  // create folder if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  // download image
  download
    .image({ url: src, dest: dest })
    .then(({ filename }) => {
      console.log("Saved to", filename) // saved to /path/to/dest/image.jpg
    })
    .catch((err) => console.error(err))

  return pathname
}

export function getAbstract(html: string, maxlen: number = 450) {
  html = html
    .replace(/(<br>|<p>)/g, " ")
    .replace(/(h1>|h2>|h3>|h4>)/g, "strong>")
  const sanitized = sanitizeHtml(html, {
    allowedTags: ["b", "i", "em", "strong", "sub", "sup"],
    allowedAttributes: {},
  })

  // use separator regex to split on sentence boundary
  const truncated = truncate(sanitized, {
    length: maxlen,
    omission: "",
    separator: /(?<=\w{3}[.!?])\s+/,
  })
    .replace(/\n+/g, " ")
    .trim()

  return decodeHtmlCharCodes(truncated)
}

export function parseGenerator(generator: any) {
  if (isObject(generator)) {
    let name = generator["#text"]

    if (name === "WordPress.com") {
      name = "WordPress (.com)"
    } else if (name === "Wordpress") {
      // versions prior to 6.1
      name = "WordPress"
    }
    const version = generator["@_version"]

    return name + (version ? " " + version : "")
  } else if (isString(generator)) {
    if (generator === "Wowchemy (https://wowchemy.com)") {
      return "Hugo"
    }
    try {
      const url = new URL(generator)

      if (url.hostname === "wordpress.org") {
        const name = "WordPress"
        const version = url.searchParams.get("v")

        return name + (version ? " " + version : "")
      } else if (url.hostname === "wordpress.com") {
        const name = "WordPress (.com)"

        return name
      }
    } catch (error) {
      // console.log(error)
    }
    generator = generator.replace(
      /^(\w+)(.+)(-?v?\d{1,2}\.\d{1,2}\.\d{1,3})$/gm,
      "$1 $3"
    )
    return capitalize(generator)
  } else {
    return null
  }
}

// use DOI content negotiation to get metadata in various formats
export async function getMetadata({
  doi,
  contentType,
}: {
  doi: string
  contentType: string
}) {
  const res = await fetch(doi, {
    headers: { Accept: contentType },
  })

  if (res.status < 400) {
    return await res.text()
  } else {
    return null
  }
}

export async function getEpub(post: any) {
  const doi = post.doi.substring(16).replace("/", "-")

  // sanitize html for epub conversion
  const src: string = sanitizeHtml(post.content_html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  })
  // console.log(post.content_html)
  // const dom = new JSDOM(`<!DOCTYPE html>${post.content_html}`)

  // // remove data-image-meta attribute, as it breaks epub conversion
  // dom.window.document.querySelectorAll("img").forEach(async (image) => {
  //   image.removeAttribute("data-image-meta")
  // })
  const title = post.title
  const author = post.authors?.map((a: any) => a.name).join(", ")
  const date = new Date(toISODate(post.published_at)).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )
  const publisher = post.blog_name
  const rights = `Copyright © ${new Date(
    toISODate(post.published_at)
  ).getFullYear()} ${author}.`
  const abstract = sanitizeHtml(post.summary, {
    allowedTags: [],
    allowedAttributes: {},
  })
  const args = [
    "-f",
    "html",
    "-t",
    "epub",
    "-o",
    "./public/epub/" + doi + ".epub",
    "--standalone",
    "--template",
    "./lib/default.epub3",
    "--data-dir",
    "./lib",
    "--extract-media",
    "./public/epub/media",
    "--metadata",
    `title=${title}`,
    "--metadata",
    `author=${author}`,
    "--metadata",
    `date=${date}`,
    "--metadata",
    `publisher=${publisher}`,
    "--metadata",
    `identifier=${post.doi}`,
    "--metadata",
    `lang=${post.language}`,
    "--metadata",
    `subject=${post.tags?.join(", ")}`,
    "--metadata",
    `abstract=${abstract}`,
    "--metadata",
    `rights=${rights}`,
    "--css",
    "./lib/epub.css",
  ]
  // const pandocPath = process.env.NEXT_PUBLIC_PANDOC_BINARY_PATH

  await nodePandoc(src, args)
  const filePath = path.join(process.cwd(), `/public/epub/${doi}.epub`)

  return filePath
}

export async function getMastodonAccount(acct: string) {
  const url = `https://rogue-scholar.social/api/v1/accounts/lookup?acct=${acct}`
  const res = await fetch(url)

  if (res.status < 400) {
    return await res.json()
  } else {
    return null
  }
}

export async function getMastodonAccessToken() {
  const url = `${process.env.NEXT_PUBLIC_MASTODON_API_URL}/oauth/token`
  const res = await fetch(url, {
    method: "POST",
    body: `grant_type=client_credentials&client_id=${process.env.NEXT_PUBLIC_MASTODON_CLIENT_KEY}&client_secret=${process.env.NEXT_PUBLIC_MASTODON_CLIENT_SECRET}&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=read+write+follow+admin:read+admin:write`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  return await res.json()
}

export async function verifyMastodonAccount() {
  const token = await getMastodonAccessToken()

  console.log(token)
  const url = `${process.env.NEXT_PUBLIC_MASTODON_API_URL}/api/v1/accounts/verify_credentials`
  const res = await fetch(url, {
    headers: {
      Authentication: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
    },
  })

  if (res.status < 400) {
    return await res.json()
  } else {
    console.log(res)
    return null
  }
}

export async function registerMastodonAccount(blog: BlogType) {
  const token = await getMastodonAccessToken()

  console.log(token)
  const formData = new FormData()

  formData.append("username", blog.slug || "")
  formData.append(
    "email",
    `${process.env.NEXT_PUBLIC_MASTODON_EMAIL_PREFIX}+${blog.slug}@${process.env.NEXT_PUBLIC_MASTODON_EMAIL_DOMAIN}`
  )
  formData.append("password", process.env.NEXT_PUBLIC_MASTODON_PASSWORD || "")
  formData.append("agreement", "true")
  formData.append("locale", "en")

  const url = `${process.env.NEXT_PUBLIC_MASTODON_API_URL}/api/v1/accounts`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authentication: `Bearer ${token["access_token"]}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  })

  console.log(res)
  if (res.status < 400) {
    return await res.json()
  } else {
    return null
  }
}
