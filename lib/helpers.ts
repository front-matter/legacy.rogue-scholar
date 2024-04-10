const { CrockfordBase32 } = require("crockford-base32")

import { Mod97_10 } from "@konfirm/iso7064"
import { fromUnixTime, getUnixTime } from "date-fns"
import doi from "doi-utils"

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

export const isROR = (ror: any) => {
  try {
    return new URL(ror).hostname === "ror.org"
  } catch (error) {
    return false
  }
}

export function isRogueScholarDoi(doi: string): boolean {
  const prefixes = [
    "10.59350",
    "10.53731",
    "10.54900",
    "10.57689",
    "10.59348",
    "10.59349",
    "10.59704",
  ]
  try {
    const prefix = new URL(doi || "").pathname.split("/")?.[1]
    if (prefixes.some((x) => x == prefix)) {
      return true
    } else {
      return false
    }
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

export const generateBlogSlug = () => {
  // generates base32 encoded string with 5 digits from random number
  // With base32 there are 32 possible digits, so 5 digits gives 32^5 possible combinations
  // random_int = SecureRandom.random_number(32 ** 4..(32 ** 5) - 1)

  const randomNumber = Math.floor(Math.random() * 32 ** 5) + 1
  const encoded = CrockfordBase32.encode(randomNumber).toLowerCase()
  const checksum = Mod97_10.checksum(randomNumber.toString())

  return encoded + checksum
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
