import { supabase } from "@/lib/supabaseClient"

export default async function handler(req, res) {
  const slug = req.query.params?.[0]

  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[1] !==
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  ) {
    res.status(401).json({ message: "Unauthorized" })
  } else if (req.method === "GET") {
    if (slug) {
      console.log(slug)
      const { data, error } = await supabase.auth.admin.getUserById(slug)

      if (error) {
        return res.status(500).json({ error })
      }

      if (!data) {
        return res.status(404).json({ error: "Not found" })
      }
      console.log(data)

      return res.status(200).json(data)
    } else {
      // const {
      //   data: { users },
      //   error,
      // } = await supabase.auth.admin.listUsers({
      //   page: 1,
      //   perPage: 100,
      // })
      const { data: users, error } = await supabase
        .from("subscribers")
        .select("*")

      if (error) {
        return res.status(500).json({ error })
      }
      console.log(users)

      return res.status(200).json(users)
    }
  } else if (req.method === "POST") {
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}
