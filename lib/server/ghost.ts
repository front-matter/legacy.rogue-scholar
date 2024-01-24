import GhostContentAPI from "@tryghost/content-api"

export async function ghostApi(url: string, slug: string) {
  return new GhostContentAPI({
    url,
    key: process.env[`NEXT_PUBLIC_${slug.toUpperCase()}_GHOST_API_KEY`],
    version: "v5.0",
  })
}
