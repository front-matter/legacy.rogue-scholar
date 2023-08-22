import { createRestAPIClient } from "masto"

export const masto = createRestAPIClient({
  url: String(process.env.NEXT_PUBLIC_MASTODON_API_URL),
  accessToken: process.env.NEXT_PUBLIC_MASTODON_API_TOKEN,
})
