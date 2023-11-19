import type { NextApiRequest, NextApiResponse } from "next"

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const slug = req.query.params?.[0]
  const action = req.query.params?.[1]
  let path = slug

  if (action) {
    path = `${slug}/${action}`
  }

  if (req.method === "GET" && path) {
    res.redirect(`https://api.rogue-scholar.org/posts/${path}`)
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}
