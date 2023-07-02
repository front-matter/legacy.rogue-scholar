import { getPagination } from "@/lib/helpers"
import { supabaseAdmin } from "@/lib/server/supabase-admin"
import {
  postsSelect,
  postsWithBlogSelect,
  supabase,
} from "@/lib/supabaseClient"
import {
  extractAllPostsByBlog,
  extractUpdatedPostsByBlog,
  getAllConfigs,
} from "@/pages/api/blogs/[[...params]]"
import { PostType } from "@/types/blog"

export async function upsertSinglePost(post: PostType) {
  const { data, error } = await supabaseAdmin.from("posts").upsert(
    {
      authors: post.authors,
      blog_id: post.blog_id,
      content_html: post.content_html,
      date_modified: post.date_modified,
      date_published: post.date_published,
      date_indexed: new Date().toISOString(),
      image: post.image,
      language: post.language,
      references: post.references,
      summary: post.summary,
      tags: post.tags,
      title: post.title,
      url: post.url,
    },
    { onConflict: "url", ignoreDuplicates: false }
  )

  if (error) {
    throw error
  }

  return data
}

export async function upsertAllPosts() {
  const configs = await getAllConfigs()
  let posts = await Promise.all(
    configs.map((config) => extractAllPostsByBlog(config.id))
  )

  posts = posts.flat()
  await Promise.all(posts.map((post) => upsertSinglePost(post)))
  return posts
}

export async function upsertUpdatedPosts() {
  const configs = await getAllConfigs()
  let posts = await Promise.all(
    configs.map((config) => extractUpdatedPostsByBlog(config.id))
  )

  posts = posts.flat()
  await Promise.all(posts.map((post) => upsertSinglePost(post)))
  return posts
}

export default async function handler(req, res) {
  const slug = req.query.params?.[0]

  const query = req.query.query || "doi.org"
  const page = (req.query.page as number) || 1
  const { from, to } = getPagination(page, 15)

  if (req.method === "GET") {
    if (slug === "unregistered") {
      const { data: posts, error } = await supabase
        .from("posts")
        .select(postsWithBlogSelect)
        .not("blogs.prefix", "is", "null")
        .not("id", "like", "%doi_org%")
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
        .like("id", "%doi_org%")
        .eq("not_indexed", true)
        .limit(15)

      if (error) {
        console.log(error)
      }

      res.status(200).json(posts)
    } else if (slug) {
      const { data: post } = await supabase
        .from("posts")
        .select(postsWithBlogSelect)
        .eq("uuid", slug)
        .single()

      if (!post) {
        res.status(404).json({ message: "Post not found" })
      } else {
        res.status(200).json(post)
      }
    } else {
      const { data: posts } = await supabase
        .from("posts")
        .select(postsSelect)
        .textSearch("fts", query, {
          type: "plain",
          config: "english",
        })
        .order("date_published", { ascending: false })
        .range(from, to)

      res.status(200).json(posts)
    }
  } else if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[1] !==
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  ) {
    res.status(401).json({ message: "Unauthorized" })
  } else if (req.method === "POST") {
    if (slug) {
      const { data: post } = await supabase
        .from("posts")
        .select(postsSelect)
        .eq("uuid", slug)
        .single()

      if (!post) {
        res.status(404).json({ message: "Post not found" })
      } else if ((await upsertSinglePost(post)) == null) {
        res.status(200).json(post)
      } else {
        res.status(400).json({ message: "Post could not be updated" })
      }
    } else {
      const posts = await upsertUpdatedPosts()

      res.status(200).json(posts)
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}
