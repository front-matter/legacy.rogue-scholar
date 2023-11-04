import GhostAdminAPI from "@tryghost/admin-api"
import { fromUnixTime, subDays } from "date-fns"
import parse from "html-react-parser"
import type { NextApiRequest, NextApiResponse } from "next"
import { v4 as uuidv4 } from "uuid"

import { toUnixTime } from "@/lib/helpers"
import { typesense } from "@/lib/typesenseClient"
import { PostType } from "@/types/blog"
import { PostSearchParams, PostSearchResponse } from "@/types/typesense"

type ResponseData = {
  message: string
}

const ghostAdmin = new GhostAdminAPI({
  url: process.env.NEXT_PUBLIC_SYLDAVIA_GAZETTE_GHOST_API_URL,
  key: process.env.NEXT_PUBLIC_SYLDAVIA_GAZETTE_GHOST_ADMIN_API_KEY,
  version: "v5.0",
})

export async function createGhostPost(data) {
  const content_html = data
    ?.map((post) => {
      const authors = post.authors?.map((author) => author.name).join(", ")
      const published_at = fromUnixTime(
        post.published_at || 0
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      return `<h3>${
        post.title
      }</h3> <p>Published ${published_at} in <a href="https://rogue-scholar.org/blogs/${
        post.blog_id
      }">${post.blog_name}</a></br>${authors}<br/><a href="${
        post.doi || post.url
      }">${post.doi || post.url}</a><p> ${parse(String(post.summary))}`
    })
    .join("<br/>")

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const images = data?.map((post) => post.image)
  const image = images[Math.floor(Math.random() * images.length)]

  const post: PostType = {
    id: uuidv4(),
    title: `Rogue Scholar Digest ${today}`,
    content_html: `This is a summary of the Rogue Scholar blog posts published last week. Find out more (including search for other posts) via <a href="https://rogue-scholar.org/posts">Rogue Scholar</a>. ${content_html}`,
    authors: [
      {
        name: "Martin Fenner",
        email: "martin@front-matter.io",
        url: "https://orcid.org/0000-0003-1419-2405",
      },
    ],
    tags: ["Digest"],
    image: image,
    published_at: toUnixTime(today),
  }
  const html = post.content_html
  const response = await ghostAdmin.posts.add(
    {
      title: post.title,
      summary: post.summary,
      authors: post.authors?.map((author) => author.email),
      tags: post.tags,
      status: "draft",
      feature_image: post.image,
      published_at: fromUnixTime(post.published_at || Date.now()),
      html,
    },
    { source: "html" }
  )

  return response
}

export async function createDigest() {
  const midnight = new Date().setHours(2, 0, 0, 0) // TODO get UTC time
  const SevenDaysAgo = subDays(midnight, 7)

  const searchParameters: PostSearchParams = {
    q: "*",
    query_by:
      "tags,title,doi,authors.name,authors.url,reference.url,summary,content_html",
    filter_by: `published_at:>${toUnixTime(SevenDaysAgo)} && language:=[en]`,
    sort_by: "published_at:asc",
    per_page: 10,
  }

  const data: PostSearchResponse = await typesense
    .collections("posts")
    .documents()
    .search(searchParameters)
  const posts = data.hits?.map((hit) => hit.document)

  return posts
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const slug = req.query.params?.[0]
  const action = req.query.params?.[1]
  let path = slug

  if (action) {
    path = `${slug}/${action}`
  }

  // if (req.method === "GET" && path) {
  //   res.redirect(`https://api.rogue-scholar.org/posts/${path}`)
  // } 
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[1] !==
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  ) {
    res.status(401).json({ message: "Unauthorized" })
  } else if (req.method === "POST") {
    if (slug === "digest") {
      const data = await createDigest()
      const response = await createGhostPost(data)

      res.status(200).json(response)
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}
