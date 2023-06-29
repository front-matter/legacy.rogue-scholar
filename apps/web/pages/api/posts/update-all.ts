import { getAllPosts } from "@/pages/api/posts/update"

export default async function handler(req, res) {
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[1] !==
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  ) {
    res.status(401).json({ message: "Unauthorized" })
  } else if (req.method === "POST") {
    const posts = await getAllPosts()

    res.status(200).json(posts)
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}
