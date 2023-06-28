import { getAllConfigs } from "@/pages/api/blogs"
import { upsertSingleBlog } from "@/pages/api/blogs/[slug]"

export async function updateAllBlogs() {
  const configs = await getAllConfigs()

  await Promise.all(configs.map((config) => upsertSingleBlog(config.id)))
}

export default async function handler(req, res) {
  if (
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
