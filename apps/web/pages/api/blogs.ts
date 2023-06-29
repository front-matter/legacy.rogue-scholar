import fs from "fs"
import * as hcl from "hcl2-parser"
import path from "path"

import { blogsSelect, supabase } from "@/lib/supabaseClient"

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

export default async function handler(_, res) {
  const { data, error } = await supabase
    .from("blogs")
    .select(blogsSelect)
    .order("title", { ascending: true })

  if (error) {
    console.log(error)
  }

  res.statusCode = 200
  res.json(data)
}
