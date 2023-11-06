const { CrockfordBase32 } = require("crockford-base32")

import { Mod97_10 } from "@konfirm/iso7064"
import { fromUnixTime, getUnixTime } from "date-fns"

import { FundingType } from "@/types/blog"

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

export const isOrcid = (orcid: any) => {
  try {
    return new URL(orcid).hostname === "orcid.org"
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

export const generateBlogId = () => {
  // generates base32 encoded string with 5 digits from random number
  // With base32 there are 32 possible digits, so 5 digits gives 32^5 possible combinations
  // random_int = SecureRandom.random_number(32 ** 4..(32 ** 5) - 1)

  const randomNumber = Math.floor(Math.random() * 32 ** 5) + 1
  const encoded = CrockfordBase32.encode(randomNumber).toLowerCase()
  const checksum = Mod97_10.checksum(randomNumber.toString())

  return encoded + checksum
}

// export async function extractImage(
//   src: string,
//   blog_home_page_url: string,
//   blog_id: string
// ) {
//   if (!src) return null

//   // determine host, only store images hosted by blog
//   if (new URL(src).hostname !== new URL(blog_home_page_url).hostname)
//     return null

//   let pathname = src.substring(0, src.lastIndexOf("/"))

//   // replace host path with local folder
//   pathname = pathname.replace(blog_home_page_url, `/public/images/${blog_id}`)

//   // use full path
//   const dest = path.join(process.cwd(), pathname)

//   // create folder if it doesn't exist
//   if (!fs.existsSync(dest)) {
//     fs.mkdirSync(dest, { recursive: true })
//   }

//   // download image
//   download
//     .image({ url: src, dest: dest })
//     .then(({ filename }) => {
//       console.log("Saved to", filename) // saved to /path/to/dest/image.jpg
//     })
//     .catch((err) => console.error(err))

//   return pathname
// }

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

// export async function getEpub(post: any) {
//   const doi = post.doi.substring(16).replace("/", "-")

//   // sanitize html for epub conversion
//   const src: string = sanitizeHtml(post.content_html, {
//     allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
//   })
//   // console.log(post.content_html)
//   // const dom = new JSDOM(`<!DOCTYPE html>${post.content_html}`)

//   // // remove data-image-meta attribute, as it breaks epub conversion
//   // dom.window.document.querySelectorAll("img").forEach(async (image) => {
//   //   image.removeAttribute("data-image-meta")
//   // })
//   const title = post.title
//   const author = post.authors?.map((a: any) => a.name).join(", ")
//   const date = new Date(toISODate(post.published_at)).toLocaleDateString(
//     "en-US",
//     {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     }
//   )
//   const publisher = post.blog_name
//   const rights = `Copyright © ${new Date(
//     toISODate(post.published_at)
//   ).getFullYear()} ${author}.`
//   const abstract = sanitizeHtml(post.summary, {
//     allowedTags: [],
//     allowedAttributes: {},
//   })
//   const args = [
//     "-f",
//     "html",
//     "-t",
//     "epub",
//     "-o",
//     "./public/epub/" + doi + ".epub",
//     "--standalone",
//     "--template",
//     "./lib/default.epub3",
//     "--data-dir",
//     "./lib",
//     "--extract-media",
//     "./public/epub/media",
//     "--metadata",
//     `title=${title}`,
//     "--metadata",
//     `author=${author}`,
//     "--metadata",
//     `date=${date}`,
//     "--metadata",
//     `publisher=${publisher}`,
//     "--metadata",
//     `identifier=${post.doi}`,
//     "--metadata",
//     `lang=${post.language}`,
//     "--metadata",
//     `subject=${post.tags?.join(", ")}`,
//     "--metadata",
//     `abstract=${abstract}`,
//     "--metadata",
//     `rights=${rights}`,
//     "--css",
//     "./lib/epub.css",
//   ]
//   // const pandocPath = process.env.NEXT_PUBLIC_PANDOC_BINARY_PATH

//   await nodePandoc(src, args)
//   const filePath = path.join(process.cwd(), `/public/epub/${doi}.epub`)

//   return filePath
// }
