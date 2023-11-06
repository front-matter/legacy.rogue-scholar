import type { NextApiRequest, NextApiResponse } from "next"

type ResponseData = {
  message: string
}

// redirect from obsolete blog IDs
export const blogIDs = {
  tcw6w29: "andrewheiss",
  "468ap65": "behind_the_science",
  "8q8xh52": "brembs",
  y3h0g22: "researchsoft",
  n6x4a73: "chjh",
  "62prc14": "chroknowlogy",
  prmb582: "csl",
  ak4s224: "markrubin",
  sxp4r07: "danielskatz",
  k0zyf54: "donnywinston",
  "6aswq28": "norbisley",
  "526jy42": "elephantinthelab",
  mdh1h61: "epub_fis",
  hjkgw43: "flavoursofopen",
  f0m0e38: "front_matter",
  "3ffcd46": "gigablog",
  "3cxcm20": "ideas",
  tyfqw20: "iphylo",
  "2bzkh64": "irishplants",
  h56tk29: "jabberwocky_ecology",
  "8epr274": "joss",
  "1senr81": "x_dev",
  "6hezn63": "lab_sub",
  yzgx124: "leidenmadtrics",
  h49ct36: "libscie",
  z4b9d78: "eve",
  h7bpg11: "oa_works",
  gzqej46: "opencitations",
  s1e9w75: "quantixed",
  "5764g49": "sfmatheson",
  gr1by89: "samuelmoore",
  dkvra02: "svpow",
  njrre84: "scholcommlab",
  ez7c883: "clearskiesadam",
  sfkfh60: "kj_garza",
  "4tzex21": "rubinpsyc",
  f4wdg32: "syldavia_gazette",
  y55kq35: "syntaxus_baccata",
  "7gyq558": "tarleb",
  "4425y27": "grieve_smith",
  pm0p222: "upstream",
  "34zkv26": "wisspub",
  e22ws68: "ropensci",
  d86r900: "ropensci_fr",
  k0crp01: "ropensci_es",
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const slug = req.query.params?.[0]
  const action = req.query.params?.[1]

  if (req.method === "GET") {
    if (slug && action === "posts") {
      const id = blogIDs[slug] || slug

      res.redirect(`https://api.rogue-scholar.org/blogs/${id}/posts`)
    } else if (slug) {
      const id = blogIDs[slug] || slug

      res.redirect(`https://api.rogue-scholar.org/blogs/${id}`)
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}
