// import Cors from "cors"
import {
  capitalize,
  compact,
  get,
  isObject,
  isString,
  startCase,
  truncate,
  uniq,
} from "lodash"
import path from "path"
const he = require("he")
const fs = require("fs")
const extractUrls = require("extract-urls")
const download = require("image-downloader")
const { CrockfordBase32 } = require("crockford-base32")
const jsdom = require("jsdom")
const { JSDOM } = jsdom

import { Mod97_10 } from "@konfirm/iso7064"
import fetch from "cross-fetch"
import { fromUnixTime, getUnixTime } from "date-fns"
import { franc } from "franc"
import nodePandoc from "node-pandoc-promise"
import normalizeUrl from "normalize-url"
import sanitizeHtml from "sanitize-html"

import { AuthorType, BlogType, FundingType, ImageType } from "@/types/blog"

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
    return ["doi.org", "dx.doi.org"].includes(new URL(doi).hostname)
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
  if (!isString(str)) return ""

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
  if (!html) return null
  html = html
    .replace(/(<br>|<p>)/g, " ")
    .replace(/(h1>|h2>|h3>|h4>)/g, "strong>")
  const sanitized = sanitizeHtml(html, {
    allowedTags: ["b", "i", "em", "strong", "sub", "sup"],
    allowedAttributes: {},
  })

  // remove incomplete last sentence if ellipsis at the end of abstract
  // TODO: check for end of abstract
  if (sanitized.includes("[…]")) {
    maxlen = sanitized.length - 4
  }

  // use separator regex to split on sentence boundary
  const truncated = truncate(sanitized, {
    length: maxlen,
    omission: "",
    separator: /(?<=\w{3}[.!?])\s+/,
  })
    .replace(/\n+/g, " ")
    .trim()

  return truncated
}

export function getTitle(html: string) {
  if (!html) return null
  html = html
    .replace(/(<br>|<p>)/g, " ")
    .replace(/(h1>|h2>|h3>|h4>)/g, "strong>")

  // remove strong tags around the whole title
  html = html.replace(/^<strong>(.*)<\/strong>/g, "$1")
  const sanitized = sanitizeHtml(html, {
    allowedTags: ["b", "i", "em", "strong", "sub", "sup"],
    allowedAttributes: {},
  })

  return decodeHtmlCharCodes(sanitized).trim()
}

export function getFunding(funding: FundingType) {
  if (funding.funder_name && funding.award_number && funding.award_uri) {
    return {
      str: "Research funded by the " + funding.funder_name + " under ",
      link_str: funding.award_number,
      url: funding.award_uri,
    }
  } else if (funding.funder_name) {
    return { str: "Research funded by the " + funding.funder_name + "." }
  } else {
    return null
  }
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

// extract blog post metadata from REST API
export async function extractWordpressPost(
  post: any,
  blog: BlogType,
  categories: any
) {
  const users = userIDs[blog.slug as string] || []
  const authors = [].concat(post.author).map((id) => {
    const name = users.find((u) => u.id === id)?.name
    const uri = authorIDs[name] || null

    return { name: name, url: uri }
  })
  const content_html = sanitizeHtml(get(post, "content.rendered", ""))
  const reference = getReferences(content_html)
  const relationships = getRelationships(content_html)
  const url = normalizeUrl(post.link, { forceHttps: true, stripWWW: false })
  const images = getImages(content_html, url)
  const image = images.length > 0 ? images[0]?.src : null
  const tags = compact(
    post.categories.map((id) => {
      const cat = categories.find((c) => c.id === id)

      return cat ? normalizeTag(cat.name) : null
    })
  ).slice(0, 5)

  return {
    authors: authors,
    blog_id: blog.id,
    blog_name: blog.title,
    blog_slug: blog.slug,
    content_html: content_html,
    summary: getAbstract(content_html),
    published_at: toUnixTime(post.date_gmt),
    updated_at: toUnixTime(post.modified_gmt),
    image: image,
    images: images,
    language: blog.language,
    reference: reference,
    relationships: relationships,
    tags: tags,
    title: get(post, "title.rendered", ""),
    url: url,
  }
}

export async function extractWordpresscomPost(post: any, blog: BlogType) {
  const authors = [].concat(post.author).map((author) => {
    return { name: author["name"], url: author["URL"] }
  })
  const content_html = sanitizeHtml(post.content)
  const summary = getAbstract(post.excerpt) || getTitle(post.title)
  const reference = getReferences(content_html)
  const relationships = getRelationships(content_html)
  const url = normalizeUrl(post.URL, { forceHttps: true, stripWWW: false })
  const images = getImages(content_html, url)
  const image = images.length > 0 ? images[0]?.src : null
  const tags = compact(
    Object.keys(post.tags).map((tag) => normalizeTag(tag))
  ).slice(0, 5)

  return {
    authors: authors,
    blog_id: blog.id,
    blog_name: blog.title,
    blog_slug: blog.slug,
    content_html: content_html,
    summary: summary,
    published_at: toUnixTime(post.date),
    updated_at: toUnixTime(post.modified),
    image: image,
    images: images,
    language: blog.language,
    reference: reference,
    relationships: relationships,
    tags: tags,
    title: getTitle(post.title),
    url: url,
  }
}

export async function extractGhostPost(post: any, blog: BlogType) {
  const authors = post.authors.map((auth) => {
    return {
      name: auth.name,
      url: auth.website,
    }
  })
  const content_html = sanitizeHtml(post.html)
  const summary = getAbstract(post.excerpt)
  const reference = getReferences(content_html)
  const relationships = getRelationships(content_html)
  const url = normalizeUrl(post.url)
  const images = getImages(content_html, url)
  const image = images.length >= 1 ? images[0]?.src : null
  const tags = compact(
    post.tags.map((tag) => normalizeTag(tag.name)).slice(0, 5)
  )

  return {
    authors: authors,
    blog_id: blog.id,
    blog_name: blog.title,
    blog_slug: blog.slug,
    content_html: content_html,
    summary: summary,
    published_at: toUnixTime(post.published_at),
    updated_at: toUnixTime(post.updated_at),
    image: image,
    images: images,
    language: blog.language,
    reference: reference,
    relationships: relationships,
    tags: tags,
    title: post.title,
    url: url,
  }
}

export async function extractSubstackPost(post: any, blog: BlogType) {
  const authors = post.publishedBylines.map((auth) => {
    auth = normalizeAuthor(auth)

    const url = authorIDs[auth["name"]] || null

    return {
      name: get(auth, "name", null),
      url: url,
    }
  })
  const title = getTitle(post.title)
  const summary = getAbstract(post.body_html)
  const reference = getReferences(post.body_html)
  const relationships = getRelationships(post.body_html)
  const images = getImages(post.content_html, post.url)
  const published_at = toUnixTime(post.post_date)
  const tags = post.postTags.map((tag) => normalizeTag(tag.name)).slice(0, 5)

  return {
    authors: authors,
    blog_id: blog.id,
    blog_name: blog.title,
    blog_slug: blog.slug,
    content_html: post.body_html,
    summary: summary,
    published_at: published_at,
    updated_at: published_at,
    image: post.cover_image,
    images: images,
    language: blog.language,
    reference: reference,
    relationships: relationships,
    tags: tags,
    title: title,
    url: post.canonical_url,
  }
}

export async function extractJekyllPost(post: any, blog: BlogType) {
  const base_url = blog.home_page_url as string
  const authors = post.author.map((auth) => {
    return {
      name: auth.name,
      url: auth.uri,
    }
  })
  const content_html = sanitizeHtml(get(post, "content.0._", ""))
  const summary = getAbstract(get(post, "summary.0._", ""))
  const reference = getReferences(content_html)
  const relationships = getRelationships(content_html)
  const url = normalizeUrl(get(post, "link.0.$.href", null))
  const images = getImages(content_html, base_url)
  const image = images.length >= 1 ? images[0]?.src : null
  const tags = compact(
    post.category
      .map((tag) => {
        return tag ? normalizeTag(get(tag, "$.term", null)) : null
      })
      .slice(0, 5)
  )

  return {
    authors: authors,
    blog_id: blog.id,
    blog_name: blog.title,
    blog_slug: blog.slug,
    content_html: content_html,
    summary: summary,
    published_at: toUnixTime(post.published[0]),
    updated_at: toUnixTime(post.updated[0]),
    image: image,
    images: images,
    language: blog.language,
    reference: reference,
    relationships: relationships,
    tags: tags,
    title: get(post, "title.0._", ""),
    url: url,
  }
}

export function getContent(feedEntry: any) {
  let content_html =
    get(feedEntry, "content:encoded", null) ||
    get(feedEntry, "content.#text", null) ||
    get(feedEntry, "description", null) ||
    get(feedEntry, "content_html", null) ||
    ""

  content_html = sanitizeHtml(content_html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  })

  // const dom = new JSDOM(`<!DOCTYPE html>${content_html}`)

  // // extract images from content and store locally
  // dom.window.document.querySelectorAll("img").forEach(async (image) => {
  //   return await getImage(image, blog_home_page_url)
  // })

  return content_html
}

export function getImages(content_html: string, url: string) {
  const dom = new JSDOM(`<!DOCTYPE html>${content_html}`)
  const images: ImageType[] = Array.from(
    dom.window.document.querySelectorAll("img")
  )
    .map((image: any) => {
      const src = image.getAttribute("src")
      let srcset = image.getAttribute("srcset")

      if (isString(srcset)) {
        srcset = srcset
          .split(", ")
          .map((src) => (isValidUrl(src) ? src : `${url}/${src}`))
          .join(", ")
      }
      return {
        src: isValidUrl(src) ? src : `${url}/${src}`,
        srcset: srcset,
        width: image.getAttribute("width"),
        height: image.getAttribute("height"),
        sizes: image.getAttribute("sizes"),
        alt: image.getAttribute("alt"),
      }
    })
    .filter((image) => image["src"] !== null && image["src"] !== "")
  // find images in figure tags
  const figures: ImageType[] = Array.from(
    dom.window.document.querySelectorAll("figure")
  )
    .map((figure: any) => {
      let src = figure.querySelector("img")?.getAttribute("src")

      // if img tag is missing, try to get src from a tag
      if (!src) {
        src = figure.querySelector("a")?.getAttribute("href")
      }
      const figcaption = figure.querySelector("figcaption")

      return {
        src: src,
        alt: figcaption ? figcaption.textContent : null,
      }
    })
    .filter(
      (figure) =>
        figure["src"] &&
        ["jpg", "jpeg", "png", "gif"].includes(figure["src"].split(".").pop())
    )

  return images.concat(figures)
}

export async function getImage(image: any, blog_home_page_url: string) {
  const src = image.getAttribute("src")
  let srcset = image.getAttribute("srcset")

  if (isString(srcset)) {
    srcset = srcset
      .split(", ")
      .map((src) => (isValidUrl(src) ? src : `${blog_home_page_url}${src}`))
      .join(", ")
  }

  return {
    src: src,
    srcset: srcset,
    width: image.getAttribute("width"),
    height: image.getAttribute("height"),
    sizes: image.getAttribute("sizes"),
    alt: image.getAttribute("alt"),
  }
}

export const getReferences = (content_html: string) => {
  // extract links from references section,defined as the text after the tag
  // "References</h2>", "References</h3>" or "References</h4>
  const reference_html = content_html.split(
    /(?:References|Referenzen)<\/(?:h2|h3|h4)>/,
    2
  )

  if (reference_html.length == 1) {
    return []
  }
  // strip optional text after references, using <hr>, <hr />, <h2, <h3, <h4 as tag
  reference_html[1] = reference_html[1].split(
    /(?:<hr \/>|<hr>|<h2|<h3|<h4)/,
    2
  )[0]
  let urls = getUrls(reference_html[1])

  if (!urls || urls.length == 0) {
    return []
  }
  urls = urls.map((url, index) => {
    const doi = isDoi(url)

    if (doi) {
      return {
        key: `ref${index + 1}`,
        doi: url,
      }
    } else {
      return {
        key: `ref${index + 1}`,
        url: url,
      }
    }
  })
  return urls
}

const getUrls = (html: string) => {
  let urls = extractUrls(html)

  if (!urls || urls.length == 0) {
    return []
  }
  urls = urls.map((url) => {
    url = normalizeUrl(url, {
      removeQueryParameters: [
        "ref",
        "referrer",
        "origin",
        "utm_content",
        "utm_medium",
        "utm_campaign",
        "utm_source",
      ],
    })
    if (isDoi(url)) {
      const uri = new URL(url)

      if (uri.protocol === "http") {
        uri.protocol = "https"
      }
      if (uri.host === "dx.doi.org") {
        uri.host = "doi.org"
      }
      url = uri.href
    } else {
      url = url.toLowerCase()
    }
    return url
  })
  urls = uniq(urls)
  return urls
}

export const getRelationships = (content_html: string) => {
  // extract links from Acknowledgments section,defined as the text after the tag
  // "Acknowledgments</h2>", "Acknowledgments</h3>" or "Acknowledgments</h4>
  const relationships_html = content_html.split(
    /(?:Acknowledgments)<\/(?:h2|h3|h4)>/,
    2
  )

  if (relationships_html.length == 1) {
    return []
  }

  // strip optional text after notes, using <hr>, <hr />, <h2, <h3, <h4 as tag
  relationships_html[1] = relationships_html[1].split(
    /(?:<hr \/>|<hr>|<h2|<h3|<h4)/,
    2
  )[0]

  // split notes into sentences and classify relationship type for each sentence
  const sentences = relationships_html[1].split(/(?<=\w{3}[.!?])\s+/)

  const relationships = sentences
    .map((sentence) => {
      sentence = sentence.trim()
      const urls = getUrls(sentence).filter((url) => {
        const uri = new URL(url)

        return uri.host !== "orcid.org"
      })

      // detect type of relationship, default is generic relationship
      let type = "IsRelatedTo"

      if (sentence.search(/(originally published|cross-posted)/i) > -1) {
        type = "IsIdenticalTo"
      } else if (sentence.search(/peer-reviewed version/i) > -1) {
        type = "IsPreprintOf"
      } else if (sentence.search(/work was funded/i) > -1) {
        type = "HasAward"
      } else {
        // console.log(sentence)
      }
      return urls.map((url) => {
        return {
          type: type,
          url: url,
        }
      })
    })
    .flat()

  return relationships
}

export const normalizeTag = (tag: string) => {
  const fixedTags = {
    aPKC: "aPKC",
    CrossRef: "Crossref",
    DataCite: "DataCite",
    EU: "EU",
    USA: "USA",
    OSTP: "OSTP",
    ElasticSearch: "ElasticSearch",
    FoxP: "FoxP",
    GigaByte: "GigaByte",
    GigaDB: "GigaDB",
    GraphQL: "GraphQL",
    JATS: "JATS",
    JISC: "JISC",
    "JSON-LD": "JSON-LD",
    microCT: "MicroCT",
    MTE14: "MTE14",
    "Pre-Print": "Preprint",
    "Q&A": "Q&A",
    ResearchGate: "ResearchGate",
    RStats: "RStats",
    ScienceEurope: "Science Europe",
    TreeBASE: "TreeBASE",
    "Web 2.0": "Web 2.0",
    WikiCite: "WikiCite",
    WikiData: "WikiData",
  }

  if (!tag) return null
  tag = tag.replace("#", "")
  tag = get(fixedTags, tag, startCase(tag))
  return tag
}

export const userIDs = {
  rzepa: [{ id: 1, name: "Henry Rzepa" }],
  rossmounce: [{ id: 1, name: "Ross Mounce" }],
}

export const authorIDs = {
  "Kristian Garza": "https://orcid.org/0000-0003-3484-6875",
  "Roderic Page": "https://orcid.org/0000-0002-7101-9767",
  "Tejas S. Sathe": "https://orcid.org/0000-0003-0449-4469",
  "Meghal Shah": "https://orcid.org/0000-0002-2085-659X",
  "Liberate Science": "https://ror.org/0342dzm54",
  "David M. Shotton": "https://orcid.org/0000-0001-5506-523X",
  "Lars Willighagen": "https://orcid.org/0000-0002-4751-4637",
  "Marco Tullney": "https://orcid.org/0000-0002-5111-2788",
  "Andrew Heiss": "https://orcid.org/0000-0002-3948-3914",
  "Sebastian Karcher": "https://orcid.org/0000-0001-8249-7388",
  "Colin Elman": "https://orcid.org/0000-0003-1004-4640",
  "Veronica Herrera": "https://orcid.org/0000-0003-4935-1226",
  "Dessislava Kirilova": "https://orcid.org/0000-0002-3824-9982",
  "Corin Wagen": "https://orcid.org/0000-0003-3315-3524",
  "Adèniké Deane-Pratt": "https://orcid.org/0000-0001-9940-9233",
  "Angela Dappert": "https://orcid.org/0000-0003-2614-6676",
  "Laura Rueda": "https://orcid.org/0000-0001-5952-7630",
  "Rachael Kotarski": "https://orcid.org/0000-0001-6843-7960",
  "Florian Graef": "https://orcid.org/0000-0002-0716-5639",
  "Adam Farquhar": "https://orcid.org/0000-0001-5331-6592",
  "Tom Demeranville": "https://orcid.org/0000-0003-0902-4386",
  "Martin Fenner": "https://orcid.org/0000-0003-1419-2405",
  "Sünje Dallmeier-Tiessen": "https://orcid.org/0000-0002-6137-2348",
  "Maaike Duine": "https://orcid.org/0000-0003-3412-7192",
  "Kirstie Hewlett": "https://orcid.org/0000-0001-5853-0432",
  "Amir Aryani": "https://orcid.org/0000-0002-4259-9774",
  "Xiaoli Chen": "https://orcid.org/0000-0003-0207-2705",
  "Patricia Herterich": "https://orcid.org/0000-0002-4542-9906",
  "Josh Brown": "https://orcid.org/0000-0002-8689-4935",
  "Robin Dasler": "https://orcid.org/0000-0002-4695-7874",
  "Markus Stocker": "https://orcid.org/0000-0001-5492-3212",
  "Robert Petryszak": "https://orcid.org/0000-0001-6333-2182",
  "Robert Huber": "https://orcid.org/0000-0003-3000-0020",
  "Henry Rzepa": "https://orcid.org/0000-0002-8635-8390",
}

export const normalizeAuthor = (author: AuthorType) => {
  // workaround for https://doi.org/10.59350/h4fhq-2t215
  if (author["name"] === "GPT-4") {
    author["name"] = "Tejas S. Sathe"
  } else if (author["name"] === "davidshotton") {
    author["name"] = "David M. Shotton"
  } else if (author["name"] === "Morgan & Ethan") {
    author["name"] = "Morgan Ernest"
  } else if (author["name"] === "Marco") {
    author["name"] = "Marco Tullney"
  } else if (author["name"] === "NFernan") {
    author["name"] = "Norbisley Fernández"
  } else if (author["name"] === "skarcher@syr.edu") {
    author["name"] = "Sebastian Karcher"
  } else if (author["name"] === "celman@maxwell.syr.edu") {
    author["name"] = "Colin Elman"
  } else if (author["name"] === "colinelman@twcny.rr.com") {
    author["name"] = "Colin Elman"
  } else if (author["name"] === "veronica.herrera@uconn.edu") {
    author["name"] = "Veronica Herrera"
  } else if (author["name"] === "dessi.kirilova@syr.edu") {
    author["name"] = "Dessislava Kirilova"
  } else if (author["name"] === "benosteen") {
    author["name"] = "Ben O'Steen"
  } else if (author["name"] === "marilena_daquino") {
    author["name"] = "Marilena Daquino"
  } else if (author["name"] === "markmacgillivray") {
    author["name"] = "Mark MacGillivray"
  } else if (author["name"] === "richarddjones") {
    author["name"] = "Richard Jones"
  } else if (author["name"] === "maaikeduine") {
    author["name"] = "Maaike Duine"
  } else if (author["name"] === "suenjedt") {
    author["name"] = "Sünje Dallmeier-Tiessen"
  } else if (author["name"] === "kirstiehewlett") {
    author["name"] = "Kirstie Hewlett"
  } else if (author["name"] === "pherterich") {
    author["name"] = "Patricia Herterich"
  } else if (author["name"] === "adeanepratt") {
    author["name"] = "Adèniké Deane-Pratt"
  } else if (author["name"] === "angeladappert") {
    author["name"] = "Angela Dappert"
  } else if (author["name"] === "RachaelKotarski") {
    author["name"] = "Rachael Kotarski"
  } else if (author["name"] === "fgraef") {
    author["name"] = "Florian Graef"
  } else if (author["name"] === "adamfarquhar") {
    author["name"] = "Adam Farquhar"
  } else if (author["name"] === "tomdemeranville") {
    author["name"] = "Tom Demeranville"
  } else if (author["name"] === "mfenner") {
    author["name"] = "Martin Fenner"
  }
  author["name"] = author["name"].replace(/, MD$/, "")
  return author
}

export function getSlug(url: string) {
  const uri = new URL(url)

  if (!["www", "blog", "medium"].includes(uri.host.split(".")[0])) {
    url = uri.host.split(".")[0]
  } else if (uri.host.split(".").length > 2) {
    url = uri.host.split(".")[1]
  } else if (uri.host.split(".")[0] === "medium") {
    url = uri.pathname
  }
  url = url.replace(/-/g, "_")
  return url
}
