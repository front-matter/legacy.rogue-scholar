import { postsSelect, supabase } from "@/lib/supabaseClient"

export default async function handler(req, res) {
  const { data: posts, error } = await supabase
    .from("posts")
    .select(postsSelect)
    .not("blogs.prefix", "is", "null")
    .like("id", "%doi_org%")
    .lt("date_indexed", req.query.slug)
    .limit(15)

  if (error) {
    console.log(error)
  }

  res.status(200).json(posts)
}
