// import Cors from "cors"
import { isString } from "lodash"
const he = require("he")

import { Mod97_10 } from "@konfirm/iso7064"
import fetch from "cross-fetch"
import { fromUnixTime, getUnixTime } from "date-fns"
import { franc } from "franc"
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const { CrockfordBase32 } = require("crockford-base32")

import { supabaseAdmin } from "@/lib/server/supabase-admin"
import { BlogType, PostType } from "@/types/blog"

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

export function normalizeImage(image: string) {
  return image
}

export async function extractImages(blog: BlogType, posts: PostType[]) {
  if (!blog || !blog.images_folder || !posts) return null

  const extractedImages = await Promise.all(
    posts.map(async (post) => {
      const dom = new JSDOM(`<!DOCTYPE html>${post.content_html}`)

      const images = dom.window.document.querySelectorAll("img")

      return images.forEach(async (image) => {
        const src = image.getAttribute("src")

        if (src.startsWith(blog.images_folder)) {
          const filename = src.substring(String(blog.images_folder).length)
          const response = await fetch(src)
          const blob = await response.blob()

          const { data, error } = await supabaseAdmin.storage
            .from("images")
            .upload(`${blog.id}/${filename}`, blob)

          if (error) {
            throw error
          }
          console.log(data)

          // save filename in images table
          const res = await supabaseAdmin
            .from("images")
            .upsert(
              {
                name: filename,
                blog_id: blog.id,
                created_at: new Date(),
              },
              { onConflict: "id", ignoreDuplicates: false }
            )
            .select("id, name")
            .maybeSingle()

          console.log(res)
          return filename
        }
      })
    })
  )

  console.log(extractedImages)
  return null
}
