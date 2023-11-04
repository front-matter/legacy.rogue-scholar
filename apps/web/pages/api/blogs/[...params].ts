import {
  extract,
  extractFromXml,
} from "@extractus/feed-extractor"
import {
  compact,
  get,
  isArray,
  isEmpty,
  isNull,
  isObject,
  isString,
  omit,
} from "lodash"
import type { NextApiRequest, NextApiResponse } from "next"
import normalizeUrl from "normalize-url"

const xml2js = require("xml2js")

import {
  authorIDs,
  decodeHtmlCharCodes,
  detectLanguage,
  // extractImage,
  getAbstract,
  getContent,
  getImages,
  getReferences,
  getRelationships,
  getSlug,
  getTitle,
  isOrcid,
  isRor,
  normalizeAuthor,
  normalizeTag,
  parseGenerator,
  toUnixTime,
} from "@/lib/helpers"
import { supabase } from "@/lib/supabaseClient"
import { BlogType } from "@/types/blog"

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

export async function extractAllPostsByBlog(
  blogSlug: string,
  page = 1,
  updateAll = false
) {
  const blog: BlogType = await getSingleBlog(blogSlug)

  let url = new URL(blog.feed_url || "")
  const generator = blog.generator?.split(" ")[0]

  // limit number of pages for free plan to 5 (50 posts)
  page = blog.plan === "Starter" ? Math.min(page, 5) : page
  const startPage = page > 0 ? (page - 1) * 50 + 1 : 1
  const endPage = page > 0 ? page * 50 + 50 : 50

  // handle pagination depending on blogging platform and whether we use their API
  switch (generator) {
    case "WordPress":
      if (blog.use_api) {
        url = new URL(blog.home_page_url as string)
        url.searchParams.append("rest_route", "/wp/v2/posts")
        url.searchParams.append("page", String(page))
        url.searchParams.append("per_page", String(50))
        url.searchParams.append("_embed", String(1))
      } else {
        url.searchParams.append("paged", String(page))
      }
      break
    case "WordPress.com":
      if (blog.use_api) {
        const site = new URL(blog.home_page_url as string).hostname

        url.hostname = "public-api.wordpress.com"
        url.pathname = "/rest/v1.1/sites/" + site + "/posts/"
        url.searchParams.append("page", String(page))
        url.searchParams.append("number", String(50))
      } else {
        url.searchParams.append("paged", String(page))
      }
      break
    case "Blogger":
      url.searchParams.set("start-index", String(startPage))
      url.searchParams.set("max-results", String(50))
      break
  }
  const feed_url = String(url.href)

  let blogWithPosts = {}
  //console.log(blog.slug, blog.feed_format)

  try {
    if ((blog.feed_format as string) === "application/atom+xml") {
      const res = await fetch(feed_url)
      let xml = await res.text()

      try {
        const json = await xml2js.parseStringPromise(xml)
        const builder = new xml2js.Builder()

        if (!updateAll) {
          json.feed["entry"] = json.feed["entry"].filter((post) => {
            return post.updated[0] > (blog.updated_at || 0)
          })
          xml = builder.buildObject(json)
        } else if (["Hugo", "Jekyll", "Quarto"].includes(String(generator))) {
          const postCount = json.feed["entry"].length

          if (postCount > 50) {
            json.feed["entry"] = json.feed["entry"].slice(startPage, endPage)
            xml = builder.buildObject(json)
          }
        }
      } catch (error) {
        console.log(error)
      }

      blogWithPosts = await extractFromXml(xml, {
        useISODateFormat: true,
        descriptionMaxLen: 500,
        getExtraEntryFields: (feedEntry) => {
          // console.log(feedEntry)
          let author: any =
            get(feedEntry, "author", null) ||
            get(feedEntry, "authors", null) ||
            get(feedEntry, "dc:creator", [])

          if (isString(author)) {
            author = {
              name: author,
              uri: null,
            }
          }

          if (isNull(author) || isEmpty(author)) {
            author = blog.authors || []
          }

          if (!isArray(author)) {
            author = [author]
          }

          const authors = author.map((auth) => {
            auth = normalizeAuthor(auth)
            if (isOrcid(get(auth, "url", null))) {
              auth["uri"] = get(auth, "url")
            }

            let url = authorIDs[auth["name"]] || null

            url ??= isOrcid(get(auth, "uri", null))
              ? get(auth, "uri")
              : null || isRor(get(auth, "uri", null))
              ? get(auth, "uri")
              : null
            return {
              name: get(auth, "name", null),
              url: url,
            }
          })
          const blog_slug = blogSlug
          const blog_name = blog.title
          const blog_id = blog.id
          let url: any = get(feedEntry, "link", [])

          if (isArray(url) && url.length > 0) {
            url = url.find((link) => get(link, "@_rel", null) === "alternate")
            url = get(url, "@_href", null)
          }
          if (isObject(url)) {
            url = get(url, "@_href", null)
          }
          if (isNull(url) || isEmpty(url)) {
            url = get(feedEntry, "url", null)
          }
          url = decodeHtmlCharCodes(url)
          url = normalizeUrl(url, {
            stripWWW: false,
            removeQueryParameters: [
              "ref",
              "referrer",
              "origin",
              "source",
              "utm_content",
              "utm_medium",
              "utm_campaign",
              "utm_source",
            ],
          })
          let base_url = url

          if (blog.relative_url === "blog") {
            base_url = blog.home_page_url
          }
          // link to archived version of post if blog is archived
          let archive_url: any = null

          if (blog.status === "archived" && blog.archive_prefix) {
            archive_url = blog.archive_prefix + url
          }
          const content_html = getContent(feedEntry)
          const summary = getAbstract(content_html)
          const images = getImages(
            content_html,
            base_url,
            blog.home_page_url as string
          )
          let image: any =
            get(feedEntry, "media:content.@_url", null) ||
            get(feedEntry, "enclosure.@_url", null) ||
            (images || [])
              .filter((image) => image.width || 0 >= 200)
              .find((image) => image.src) ||
            (images || [])
              .filter((image: any) => {
                if (image["src"] === "") {
                  return false
                }
                const url = new URL(image["src"])

                if (["s.w.org", "i.creativecommons.org"].includes(url.host)) {
                  return false
                } else {
                  return true
                }
              })
              .find((image) => image.src) ||
            null

          image = image ? image.src : null

          const published_at = toUnixTime(
            get(feedEntry, "pubDate", null) ||
              get(feedEntry, "date_published", null) ||
              get(feedEntry, "published", "1970-01-01")
          )
          let updated_at = toUnixTime(get(feedEntry, "updated", "1970-01-01"))

          if (published_at > updated_at) {
            updated_at = published_at
          }
          const language = detectLanguage(content_html || "en")
          const relationships = content_html
            ? getRelationships(content_html)
            : []
          const reference = content_html ? getReferences(content_html) : []
          let tags = []
            .concat(get(feedEntry, "category", []))
            .map((tag: string | null) => {
              tag = decodeHtmlCharCodes(
                get(tag, "@_term", null) || get(tag, "#text", null) || tag
              )
              return tag ? normalizeTag(tag) : null
            })
            .slice(0, 5)

          if (isEmpty(tags)) {
            tags = get(feedEntry, "tags", [])
            if (isArray(tags)) {
              tags = compact(
                tags.map((tag: string | null) => {
                  return tag ? normalizeTag(tag) : null
                })
              ).slice(0, 5)
            } else {
              tags = []
            }
          }
          let title =
            get(feedEntry, "title.#text", null) ||
            get(feedEntry, "title", null) ||
            ""

          if (isString(title)) {
            title = getTitle(title)
          } else {
            title = ""
          }

          return {
            authors,
            blog_id,
            blog_name,
            blog_slug,
            content_html,
            summary,
            published_at,
            updated_at,
            image,
            images,
            language,
            reference,
            relationships,
            tags,
            title,
            url,
            archive_url,
          }
        },
      })
    }
  } catch (error) {
    console.log(error, blog.slug)
  }

  return get(blogWithPosts, "entries", [])
}

export async function getSingleBlog(blogSlug: string) {
  const { data: config } = await supabase
    .from("blogs")
    .select(
      "id, slug, feed_url, current_feed_url, home_page_url, archive_prefix, feed_format, updated_at, modified_at, use_mastodon, generator, favicon, title, category, status, user_id, authors, plan, use_api, relative_url, filter"
    )
    .eq("slug", blogSlug)
    .maybeSingle()

  if (!config) {
    return {}
  }

  let blog: BlogType = {
    id: config["id"],
    slug: config["slug"],
    version: "https://jsonfeed.org/version/1.1",
    feed_url: config["feed_url"],
    updated_at: Number(config["updated_at"]),
    home_page_url: config["home_page_url"],
    archive_prefix: config["archive_prefix"],
    feed_format: config["feed_format"],
    title: config["title"],
    generator: config["generator"],
    description: config["description"],
    favicon: config["favicon"],
    language: config["language"],
    license: "https://creativecommons.org/licenses/by/4.0/legalcode",
    category: config["category"],
    status: config["status"],
    plan: config["plan"],
    user_id: config["user_id"],
    authors: config["authors"],
    use_mastodon: config["use_mastodon"],
    use_api: config["use_api"],
    relative_url: config["relative_url"],
    filter: config["filter"],
  }

  try {
    blog = await extract(config["feed_url"], {
      useISODateFormat: true,
      getExtraFeedFields: (feedData) => {
        // console.log(feedData)
        const title = decodeHtmlCharCodes(
          config["title"] ||
            get(feedData, "title.#text", null) ||
            get(feedData, "title", null) ||
            ""
        ).trim()
        const current_feed_url = config["current_feed_url"]
        let home_page_url =
          config["home_page_url"] ||
          []
            .concat(get(feedData, "link", []))
            .find((link) => get(link, "@_rel", null) === "alternate") ||
          [].concat(get(feedData, "link", []))[0]

        if (isObject(home_page_url)) {
          home_page_url = get(home_page_url, "@_href", null)
        }
        home_page_url = home_page_url
          ? home_page_url.replace(/\/+$/g, "")
          : null
        let feed_format = config["feed_format"]

        if (!feed_format) {
          ;[]
            .concat(get(feedData, "link", []))
            .find((link) => get(link, "@_rel", null) === "self") || {}

          feed_format =
            get(feed_format, "@_type", null) ||
            get(feedData, "@_xmlns", null) === "http://www.w3.org/2005/Atom"
              ? "application/atom+xml"
              : null ||
                get(feedData, "atom:link.@_type", null) ||
                (get(feedData, "version", null) && "application/feed+json") ||
                config["feed_format"] ||
                "application/rss+xml"
        }
        let generator = get(feedData, "generator", null)

        generator = parseGenerator(generator) || config["generator"]

        let description =
          config["description"] ||
          get(feedData, "description.#text", null) ||
          get(feedData, "description", null) ||
          get(feedData, "subtitle.#text", null) ||
          get(feedData, "subtitle", null)

        description = isString(description)
          ? decodeHtmlCharCodes(description).trim()
          : null

        let language: string =
          get(feedData, "language", null) ||
          get(feedData, "@_xml:lang", null) ||
          "en"
        // normalize language to ISO 639-1, e.g. en-US -> en
        // en is the default language

        language = language.split("-")[0]

        let favicon =
          config["favicon"] ||
          get(feedData, "image.url", null) ||
          get(feedData, "icon", null)

        favicon =
          favicon !== "https://s0.wp.com/i/buttonw-com.png" ? favicon : null
        const slug = config["slug"] || getSlug(config["feed_url"])

        return {
          id: config["id"],
          slug,
          version: "https://jsonfeed.org/version/1.1",
          feed_url: config["feed_url"],
          modified_at: config["modified_at"],
          updated_at: config["updated_at"],
          current_feed_url,
          home_page_url,
          archive_prefix: config["archive_prefix"],
          feed_format,
          title,
          generator,
          description,
          favicon,
          language,
          license: "https://creativecommons.org/licenses/by/4.0/legalcode",
          category: config["category"],
          status: config["status"],
          plan: config["plan"],
          user_id: config["user_id"],
          authors: config["authors"],
          use_mastodon: config["use_mastodon"],
          use_api: config["use_api"],
          relative_url: config["relative_url"],
          filter: config["filter"],
        }
      },
    })
  } catch (error) {
    console.log(error)
  }

  return omit(blog, ["published", "link", "entries"])
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
