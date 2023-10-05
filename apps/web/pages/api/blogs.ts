import { supabase } from "@/lib/supabaseClient"
import { upsertSingleBlog } from "@/pages/api/blogs/[...params]"

export async function updateAllBlogs() {
  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug")
    .in("status", ["approved", "active"])

  if (!blogs) {
    return []
  }

  await Promise.all(blogs.map((blog) => upsertSingleBlog(blog.slug)))
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
