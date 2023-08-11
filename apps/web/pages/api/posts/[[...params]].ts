import GhostAdminAPI from "@tryghost/admin-api"
import { fromUnixTime, subDays } from "date-fns"
import fs from "fs"
import parse from "html-react-parser"
import { isEmpty } from "lodash"
import { v4 as uuidv4 } from "uuid"

import { getEpub, getMetadata, toUnixTime } from "@/lib/helpers"
import { supabaseAdmin } from "@/lib/server/supabase-admin"
import {
  postsSelect,
  postsWithBlogSelect,
  postsWithContentSelect,
  supabase,
} from "@/lib/supabaseClient"
import { typesense } from "@/lib/typesenseClient"
import {
  extractAllPostsByBlog,
  extractUpdatedPostsByBlog,
} from "@/pages/api/blogs/[...params]"
import { PostType } from "@/types/blog"
import { PostSearchParams, PostSearchResponse } from "@/types/typesense"

const ghostAdmin = new GhostAdminAPI({
  url: process.env.NEXT_PUBLIC_GHOST_API_URL,
  key: process.env.NEXT_PUBLIC_GHOST_ADMIN_API_KEY,
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
      "tags,title,authors.name,authors.url,summary,content_html,reference",
    filter_by: `published_at:>${toUnixTime(
      SevenDaysAgo
    )} && blog_id:!=[gzqej46, y3h0g22] && language:=[en]`,
    sort_by: "published_at:asc",
    per_page: 15,
  }

  const data: PostSearchResponse = await typesense
    .collections("posts")
    .documents()
    .search(searchParameters)
  const posts = data.hits?.map((hit) => hit.document)

  return posts
}

export async function createGhostMember(user) {
  const response = await ghostAdmin.members.edit({
    name: user.name,
    email: user.email,
    newsletters: [
      {
        id: process.env.NEXT_PUBLIC_GHOST_API_DIGEST_NEWSLETTER_ID,
      },
    ],
  })

  return response
}

export async function upsertSinglePost(post: PostType) {
  if (isEmpty(post.title)) {
    return null
  }

  const { data, error } = await supabaseAdmin
    .from("posts")
    .upsert(
      {
        authors: post.authors,
        blog_id: post.blog_id,
        blog_name: post.blog_name,
        content_html: post.content_html,
        images: post.images,
        updated_at: post.updated_at,
        published_at: post.published_at,
        image: post.image,
        language: post.language,
        reference: post.reference,
        summary: post.summary,
        tags: post.tags,
        title: post.title,
        url: post.url,
      },
      { onConflict: "url", ignoreDuplicates: false }
    )
    .select("id, indexed_at, updated_at, not_indexed")
    .single()

  if (error) {
    throw error
  }

  // workaround for comparing two timestamps in supabase
  const { data: post_to_update } = await supabaseAdmin
    .from("posts")
    .update({
      not_indexed: (data.indexed_at || 0) < (data.updated_at || 1),
    })
    .eq("id", data.id)
    .select("id")
    .single()

  return post_to_update
}

export async function upsertAllPosts(page: number = 1) {
  const { data: blogs } = await supabase
    .from("blogs")
    .select("id")
    .eq("status", "active")

  if (!blogs) {
    return []
  }

  const data = await Promise.all(
    blogs.map((blog) => extractAllPostsByBlog(blog.id, page))
  )
  const posts = data.flat()

  await Promise.all(posts.map((post) => upsertSinglePost(post)))
  return posts
}

export async function upsertUpdatedPosts(page: number = 1) {
  const { data: blogs } = await supabase
    .from("blogs")
    .select("id")
    .eq("status", "active")

  if (!blogs) {
    return []
  }
  const data = await Promise.all(
    blogs.map((blog) => extractUpdatedPostsByBlog(blog.id, page))
  )

  const posts = data.flat()

  await Promise.all(posts.map((post) => upsertSinglePost(post)))
  return posts
}

export default async function handler(req, res) {
  const slug = req.query.params?.[0]
  const query = req.query.query || ""
  let page = (req.query.page as number) || 1

  page = Number(page)
  const update = req.query.update
  const format = req.query.format || "json"
  const locale = req.query.locale || "en-US"
  const style = req.query.style || "apa"
  const prefixes = [
    "10.34732",
    "10.53731",
    "10.54900",
    "10.57689",
    "10.59348",
    "10.59349",
    "10.59350",
  ]
  const formats = ["bibtex", "ris", "csl", "citation"]

  if (req.method === "GET") {
    if (slug === "unregistered") {
      const { data: posts, error } = await supabase
        .from("posts")
        .select(postsWithBlogSelect)
        .not("blogs.prefix", "is", "null")
        .is("doi", null)
        .limit(15)

      if (error) {
        console.log(error)
      }

      res.status(200).json(posts)
    } else if (slug === "not_indexed") {
      const { data: posts, error } = await supabase
        .from("posts")
        .select(postsWithBlogSelect)
        .not("blogs.prefix", "is", "null")
        .not("doi", "is", "null")
        .eq("not_indexed", true)
        .limit(15)

      if (error) {
        console.log(error)
      }

      res.status(200).json(posts)
    } else if (prefixes.includes(slug)) {
      const doi = `https://doi.org/${slug}/${req.query.params?.[1]}`
      const { data: post } = await supabase
        .from("posts")
        .select(postsWithContentSelect)
        .eq("doi", doi)
        .single()

      if (!post) {
        res.status(404).json({ message: "Post not found" })
      } else {
        if (format === "json") {
          res.status(200).json(post)
        } else if (format === "epub" && process.env.NODE_ENV !== "production") {
          try {
            const filePath = await getEpub(post)
            const imageBuffer = fs.readFileSync(filePath)

            res.setHeader("Content-Type", "application/epub+zip")
            res.send(imageBuffer)
          } catch (e: any) {
            if (!(e instanceof Error)) {
              e = new Error(e)
            }
            res.status(400).json({ error: true, message: e.message })
          }
        } else if (formats.includes(format)) {
          const contentTypes = {
            bibtex: "application/x-bibtex",
            ris: "application/x-research-info-systems",
            csl: "application/vnd.citationstyles.csl+json",
            citation: `text/x-bibliography; style=${style}; locale=${locale}`,
          }
          const contentType = contentTypes[format]
          const metadata = await getMetadata({
            doi: post.doi,
            contentType: contentType,
          })

          if (metadata) {
            res.setHeader("Content-Type", contentType)
            res.send(metadata)
          } else {
            res.status(404).json({ error: true, message: "Metdata not found" })
          }
        }
      }
    } else {
      const searchParameters: PostSearchParams = {
        q: query,
        query_by:
          "tags,title,authors.name,authors.url,summary,content_html,reference",
        sort_by: req.query.query ? "_text_match:desc" : "published_at:desc",
        per_page: 15,
        page: page && page > 0 ? page : 1,
      }
      const data: PostSearchResponse = await typesense
        .collections("posts")
        .documents()
        .search(searchParameters)

      res.status(200).json(data)
    }
  } else if (
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
    } else if (slug) {
      const { data: post } = await supabase
        .from("posts")
        .select(postsSelect)
        .eq("id", slug)
        .single()

      if (!post) {
        res.status(404).json({ message: "Post not found" })
      } else if ((await upsertSinglePost(post)) == null) {
        res.status(200).json(post)
      } else {
        res.status(400).json({ message: "Post could not be updated" })
      }
    } else {
      let posts: PostType[] = []

      if (update === "all") {
        // const { data: posts_to_update } = await supabase
        //   .from("posts")
        //   .select("*")
        //   .is("not_indexed", null)

        // if (posts_to_update) {
        //   await Promise.all(
        //     posts_to_update.map((post) => {
        //       post.not_indexed = post.indexed_at < post.updated_at
        //       upsertSinglePost(post)
        //     })
        //   )
        // }

        posts = await upsertAllPosts(page)
      } else {
        posts = await upsertUpdatedPosts(page)
      }
      res.status(200).json(posts)
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}
