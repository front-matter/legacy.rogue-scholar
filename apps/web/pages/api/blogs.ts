import fs from "fs"
import * as hcl from "hcl2-parser"
import path from "path"

import { blogsSelect, supabase } from "@/lib/supabaseClient"
import { upsertSingleBlog } from "@/pages/api/blogs/[slug]"

const optionalKeys = [
  "current_feed_url",
  "base_url",
  "title",
  "description",
  "language",
  "category",
  "favicon",
  "generator",
  "indexed_at",
  "prefix",
  "expired"
]

export async function getAllConfigs() {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || "development"
  const filePath = path.resolve("rogue-scholar.hcl")
  const hclString = fs.readFileSync(filePath)
  const configs = hcl
    .parseToObject(hclString)[0]
    .blog.map((config: { [x: string]: any }) => {
      // enforce optional keys exist
      for (const key of optionalKeys) {
        config[key] = config[key] == null ? null : config[key]
      }
      return config
    })
    .filter((config: { indexed_at: any }) => {
      return env != "production" || config.indexed_at
    })

  return configs
}

export async function updateAllBlogs() {
  const configs = await getAllConfigs()
  await Promise.all(configs.map((config) => upsertSingleBlog(config.id)))
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data: blogs, error } = await supabase
    .from("blogs")
    .select(blogsSelect)
    .order("title", { ascending: true })

    if (error) {
      console.log(error)
    }

    res.status(200).json(blogs)
  } else if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[1] !==
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  ) {
    res.status(401).json({ message: "Unauthorized" })
  } else if (req.method === "POST") {
    const blogs = await updateAllBlogs()
    res.status(200).json(blogs)
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}