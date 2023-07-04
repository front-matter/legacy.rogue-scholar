import Cors from "cors"
import { isString } from "lodash"
const he = require("he")
import { franc } from 'franc'

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
export const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
  })
)

// from https://github.com/wooorm/iso-639-3/blob/main/iso6393-to-1.json
export const iso6393To1 = {
  aar: 'aa',
  abk: 'ab',
  afr: 'af',
  aka: 'ak',
  amh: 'am',
  ara: 'ar',
  arg: 'an',
  asm: 'as',
  ava: 'av',
  ave: 'ae',
  aym: 'ay',
  aze: 'az',
  bak: 'ba',
  bam: 'bm',
  bel: 'be',
  ben: 'bn',
  bis: 'bi',
  bod: 'bo',
  bos: 'bs',
  bre: 'br',
  bul: 'bg',
  cat: 'ca',
  ces: 'cs',
  cha: 'ch',
  che: 'ce',
  chu: 'cu',
  chv: 'cv',
  cor: 'kw',
  cos: 'co',
  cre: 'cr',
  cym: 'cy',
  dan: 'da',
  deu: 'de',
  div: 'dv',
  dzo: 'dz',
  ell: 'el',
  eng: 'en',
  epo: 'eo',
  est: 'et',
  eus: 'eu',
  ewe: 'ee',
  fao: 'fo',
  fas: 'fa',
  fij: 'fj',
  fin: 'fi',
  fra: 'fr',
  fry: 'fy',
  ful: 'ff',
  gla: 'gd',
  gle: 'ga',
  glg: 'gl',
  glv: 'gv',
  grn: 'gn',
  guj: 'gu',
  hat: 'ht',
  hau: 'ha',
  hbs: 'sh',
  heb: 'he',
  her: 'hz',
  hin: 'hi',
  hmo: 'ho',
  hrv: 'hr',
  hun: 'hu',
  hye: 'hy',
  ibo: 'ig',
  ido: 'io',
  iii: 'ii',
  iku: 'iu',
  ile: 'ie',
  ina: 'ia',
  ind: 'id',
  ipk: 'ik',
  isl: 'is',
  ita: 'it',
  jav: 'jv',
  jpn: 'ja',
  kal: 'kl',
  kan: 'kn',
  kas: 'ks',
  kat: 'ka',
  kau: 'kr',
  kaz: 'kk',
  khm: 'km',
  kik: 'ki',
  kin: 'rw',
  kir: 'ky',
  kom: 'kv',
  kon: 'kg',
  kor: 'ko',
  kua: 'kj',
  kur: 'ku',
  lao: 'lo',
  lat: 'la',
  lav: 'lv',
  lim: 'li',
  lin: 'ln',
  lit: 'lt',
  ltz: 'lb',
  lub: 'lu',
  lug: 'lg',
  mah: 'mh',
  mal: 'ml',
  mar: 'mr',
  mkd: 'mk',
  mlg: 'mg',
  mlt: 'mt',
  mon: 'mn',
  mri: 'mi',
  msa: 'ms',
  mya: 'my',
  nau: 'na',
  nav: 'nv',
  nbl: 'nr',
  nde: 'nd',
  ndo: 'ng',
  nep: 'ne',
  nld: 'nl',
  nno: 'nn',
  nob: 'nb',
  nor: 'no',
  nya: 'ny',
  oci: 'oc',
  oji: 'oj',
  ori: 'or',
  orm: 'om',
  oss: 'os',
  pan: 'pa',
  pli: 'pi',
  pol: 'pl',
  por: 'pt',
  pus: 'ps',
  que: 'qu',
  roh: 'rm',
  ron: 'ro',
  run: 'rn',
  rus: 'ru',
  sag: 'sg',
  san: 'sa',
  sin: 'si',
  slk: 'sk',
  slv: 'sl',
  sme: 'se',
  smo: 'sm',
  sna: 'sn',
  snd: 'sd',
  som: 'so',
  sot: 'st',
  spa: 'es',
  sqi: 'sq',
  srd: 'sc',
  srp: 'sr',
  ssw: 'ss',
  sun: 'su',
  swa: 'sw',
  swe: 'sv',
  tah: 'ty',
  tam: 'ta',
  tat: 'tt',
  tel: 'te',
  tgk: 'tg',
  tgl: 'tl',
  tha: 'th',
  tir: 'ti',
  ton: 'to',
  tsn: 'tn',
  tso: 'ts',
  tuk: 'tk',
  tur: 'tr',
  twi: 'tw',
  uig: 'ug',
  ukr: 'uk',
  urd: 'ur',
  uzb: 'uz',
  ven: 've',
  vie: 'vi',
  vol: 'vo',
  wln: 'wa',
  wol: 'wo',
  xho: 'xh',
  yid: 'yi',
  yor: 'yo',
  zha: 'za',
  zho: 'zh',
  zul: 'zu'
}

export const detectLanguage = (text: string) => {
  const iso693Language = franc(text)
  return iso6393To1[iso693Language]
}
