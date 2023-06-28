import { getPagination } from "@/lib/helpers"
import { postsSelect, supabase } from "@/lib/supabaseClient"

export async function getPosts(blogSlug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(postsSelect)
    .eq("blog_id", blogSlug)
    .order("date_published", { ascending: false })

  if (error) {
    console.log(error)
  }

  if (data) {
    return data
  }
}

export default async function handler(req, res) {
  // const query = req.query.query as string
  const page = (req.query.page as number) || 0
  const { from, to } = getPagination(page, 15)

  const { data: posts, error } = await supabase
    .from("posts")
    .select(postsSelect)
    .range(from, to)
    .order("date_published", { ascending: false })

  if (error) {
    console.log(error)
  }

  res.statusCode = 200
  res.json(posts)
}
