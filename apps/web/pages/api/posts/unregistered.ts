import { postsSelect, supabase } from "@/lib/supabaseClient"

export default async function handler(_, res) {
  const { data: posts, error } = await supabase
    .from("posts")
    .select(postsSelect)
    .not("blogs.prefix", "is", "null")
    .not("id", "like", "%doi_org%")
    .limit(15)

  if (error) {
    console.log(error)
  }

  res.status(200).json(posts)
}
