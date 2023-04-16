import fs from 'fs'
import * as hcl from 'hcl2-parser'
import path from 'path'

import { getSingleBlog, writeSingleBlog } from './blogs/[slug]'

const optionalKeys = [
  'title',
  'description',
  'language',
  'license',
  'category',
  'favicon',
  'generator',
  'preview',
]

export async function getAllConfigs() {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || 'development'
  const filePath = path.resolve('rogue-scholar.hcl')
  const hclString = fs.readFileSync(filePath)
  const configs = hcl
    .parseToObject(hclString)[0]
    .blog.map((config) => {
      // enforce optional keys exist
      for (const key of optionalKeys) {
        config[key] = config[key] == null ? null : config[key]
      }
      return config
    })
    .filter((config) => {
      return env != 'production' || !config.preview
    })

  return configs
}

export async function getAllBlogs() {
  const configs = await getAllConfigs()

  return Promise.all(
    configs.map(async (blog) => {
      return await getSingleBlog(blog.id, { includePosts: false })
    })
  )
}

export async function writeAllBlogs(blogs) {
  for (const blog of blogs) {
    await writeSingleBlog(blog.id)
  }
}

export default async (_req, res) => {
  let blogs = await getAllBlogs()

  blogs = blogs.sort(function (a, b) {
    if (a.title.toUpperCase() < b.title.toUpperCase()) {
      return -1
    }
    if (a.title.toUpperCase() > b.title.toUpperCase()) {
      return 1
    }
    return 0
  })

  res.statusCode = 200
  res.json(blogs)
}
