import { extract } from "@extractus/feed-extractor"
import { stripTags, truncate } from "bellajs"
import fetch from "cross-fetch"
import isRelativeUrl from "is-relative-url"
import {
  capitalize,
  get,
  isArray,
  isEmpty,
  isNull,
  isObject,
  isString,
  omit,
  uniq,
} from "lodash"
import normalizeUrl from "normalize-url"
const extractUrls = require("extract-urls")

import {
  decodeHtmlCharCodes,
  detectLanguage,
  isDoi,
  isOrcid,
  isRor,
  isValidUrl,
  toISOString,
  toUnixTime,
} from "@/lib/helpers"
import { supabaseAdmin } from "@/lib/server/supabase-admin"
import {
  blogsSelect,
  blogWithPostsSelect,
  postsWithBlogSelect,
  supabase,
} from "@/lib/supabaseClient"
import { typesense } from "@/lib/typesenseClient"
import { upsertSinglePost } from "@/pages/api/posts/[[...params]]"
import { BlogType, PostType } from "@/types/blog"
import { PostSearchResponse } from "@/types/typesense"

export async function updateAllBlogs() {
  const { data: blogs } = await supabase
    .from("blogs")
    .select("id")
    .in("status", ["approved", "active"])

  if (!blogs) {
    return []
  }

  await Promise.all(blogs.map((blog) => upsertSingleBlog(blog.id)))
}

// from https://github.com/extractus/feed-extractor/blob/main/src/utils/normalizer.js
export const buildDescription = (val, maxlen) => {
  const stripped = stripTags(String(val))

  return truncate(stripped, maxlen).replace(/\n+/g, " ")
}

export const authorIDs = {
  "Kristian Garza": "https://orcid.org/0000-0003-3484-6875",
  "Roderic Page": "https://orcid.org/0000-0002-7101-9767",
  "Liberate Science": "https://ror.org/0342dzm54",
}

const getReferences = (content_html: string) => {
  // extract links from references section,defined as the text after the tag
  // "References</h2>", "References</h3>" or "References</h4>
  const reference_html = content_html.split(
    /(?:References|Referenzen)<\/(?:h2|h3|h4)>/,
    2
  )

  if (reference_html.length == 1) {
    return []
  }
  // strip optional text after references, using <hr>, <hr />, <h2, <h3, <h4 as tag
  reference_html[1] = reference_html[1].split(
    /(?:<hr \/>|<hr>|<h2|<h3|<h4)/,
    2
  )[0]
  let urls = extractUrls(reference_html[1])

  if (!urls || urls.length == 0) {
    return []
  }
  urls = urls.map((url) => {
    url = normalizeUrl(url, {
      removeQueryParameters: [
        "ref",
        "referrer",
        "origin",
        "utm_content",
        "utm_medium",
        "utm_campaign",
        "utm_source",
      ],
    })
    url = isDoi(url) ? url.toLowerCase() : url
    return url
  })
  urls = uniq(urls)
  urls = urls.map((url, index) => {
    const doi = isDoi(url)

    if (doi) {
      return {
        key: `ref${index + 1}`,
        doi: url,
      }
    } else {
      return {
        key: `ref${index + 1}`,
        url: url,
      }
    }
  })
  return urls
}

// export const extract = async (url, options = {}, fetchOptions = {}) => {
//   if (!isValidUrl(url)) {
//     throw new Error("Input param must be a valid URL")
//   }
//   console.log(fetchOptions)

//   const data = await retrieve(url, {
//     method: "GET",
//     mode: "cors",
//     headers: {
//       "Content-Type": "application/atom+xml",
//       //"application/rss+xml, application/atom+xml, application/json",
//     },
//   })

//   if (!data.text && !data.json) {
//     throw new Error(`Failed to load content from "${url}"`)
//   }

//   const { type, json, text } = data

//   return type === "json"
//     ? extractFromJson(json, options)
//     : extractFromXml(text, options)
// }

export async function extractAllPostsByBlog(blogSlug: string, page = 1) {
  const blog: BlogType = await getSingleBlog(blogSlug)

  let feed_url = blog.feed_url
  const generator = blog.generator?.split(" ")[0]

  // handle pagination depending on blogging platform
  switch (generator) {
    case "WordPress":
      feed_url = `${blog.feed_url}?paged=${page}`
      break
    case "Blogger":
      const startPage = page > 0 ? (page - 1) * 10 + 1 : 1

      feed_url = `${blog.feed_url}?start-index=${startPage}&max-results=10`
      break
  }

  try {
    const blogWithPosts = await extract(feed_url as string, {
      useISODateFormat: true,
      descriptionMaxLen: 500,
      getExtraEntryFields: (feedEntry) => {
        // console.log(feedEntry)
        let author: any =
          get(feedEntry, "author", null) || get(feedEntry, "dc:creator", [])

        if (isString(author)) {
          author = {
            name: author,
            uri: null,
          }
        }

        if (isEmpty(author) || isNull(get(author, "name", null))) {
          author = blog.authors || []
        }

        if (!isArray(author)) {
          author = [author]
        }

        const authors = author.map((auth) => {
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
        const blog_id = blog.id
        const blog_name = blog.title
        const content_html =
          get(feedEntry, "content:encoded", null) ||
          get(feedEntry, "content.#text", null) ||
          get(feedEntry, "description", null)
        let summary = buildDescription(content_html, 500)

        summary = decodeHtmlCharCodes(summary)
        const published_at = toUnixTime(
          get(feedEntry, "pubDate", null) ||
            get(feedEntry, "published", "1970-01-01")
        )
        let updated_at = toUnixTime(get(feedEntry, "updated", "1970-01-01"))

        if (published_at > updated_at) {
          updated_at = published_at
        }
        let url: any = get(feedEntry, "link", [])

        if (isArray(url) && url.length > 0) {
          url = url.find((link) => get(link, "@_rel", null) === "alternate")
          url = get(url, "@_href", null)
        }
        if (isObject(url)) {
          url = get(url, "@_href", null)
        }
        // feed contains relative urls
        if (isRelativeUrl(url)) {
          url = blog.base_url + url
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
        let image: any =
          get(feedEntry, "media:content.@_url", null) ||
          get(feedEntry, "enclosure.@_url", null)

        if (isString(image) && isValidUrl(image)) {
          image = decodeURIComponent(image)
        }
        const language = detectLanguage(content_html || "en")
        const reference = content_html ? getReferences(content_html) : []
        const tags = []
          .concat(get(feedEntry, "category", []))
          .map((tag) =>
            decodeHtmlCharCodes(
              get(tag, "@_term", null) || get(tag, "#text", null) || tag
            )
          )
          .slice(0, 5)
        let title =
          get(feedEntry, "title.#text", null) ||
          get(feedEntry, "title", null) ||
          ""

        title = decodeHtmlCharCodes(title).trim()

        return {
          authors,
          blog_id,
          blog_name,
          content_html,
          summary,
          published_at,
          updated_at,
          image,
          language,
          reference,
          tags,
          title,
          url,
        }
      },
    })

    // handle pagination depending on blogging platform
    let posts: PostType[] = []

    const startPage = page > 0 ? (page - 1) * 10 : 0
    const endPage = page > 0 ? page * 10 : 10

    switch (generator) {
      case "Jekyll":
      case "Hugo":
      case "Ghost":
        posts = (blogWithPosts["entries"] || []).slice(startPage, endPage)
        break
      default:
        posts = blogWithPosts["entries"] || []
    }

    return posts
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function extractUpdatedPostsByBlog(blogSlug: string, page = 1) {
  const blog: BlogType = await getSingleBlog(blogSlug)
  const posts = await extractAllPostsByBlog(blogSlug, page)

  return posts.filter((post) => {
    return toISOString(post.updated_at) || "" > (blog.modified_at as string)
  })
}

export async function getAllPostsByBlog(blogSlug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(postsWithBlogSelect)
    .eq("blog_id", blogSlug)
    .order("published_at", { ascending: false })

  if (error) {
    console.log(error)
  }

  if (data) {
    return data
  }
}

export async function upsertSingleBlog(blogSlug: string) {
  const blog: BlogType = await getSingleBlog(blogSlug)

  const { data, error } = await supabaseAdmin.from("blogs").upsert(
    {
      id: blog.id,
      title: blog.title,
      description: blog.description,
      feed_url: blog.feed_url,
      current_feed_url: blog.current_feed_url,
      home_page_url: blog.home_page_url,
      feed_format: blog.feed_format,
      modified_at: blog.modified_at,
      language: blog.language,
      category: blog.category,
      favicon: blog.favicon,
      license: blog.license,
      generator: blog.generator,
      status: blog.status,
      user_id: blog.user_id,
    },
    { onConflict: "id", ignoreDuplicates: false }
  )

  if (error) {
    throw error
  }

  return data
}

export async function validateFeedUrl(url: string) {
  const res = await fetch(url)

  if (res.status === 200) {
    const contentType = res.headers.get("content-type")?.split(";")[0]

    if (
      [
        "application/rss+xml",
        "application/atom+xml",
        "application/xml",
        "text/xml",
        "application/json+feed",
      ].includes(contentType as string)
    ) {
      return url
    } else if (contentType === "text/html") {
      // parse homepage for feed url
      const html = await res.text()
      const feedLink = html.match(
        /<link[^>]+(type="application\/(rss\+xml|atom\+xml)"|type="application\/(rss|atom)"[^>]+(rel="alternate"|rel="alternate feed"))[^>]+(href="([^"]+)")[^>]*>/gi
      )?.[0] as string
      const feedUrl = feedLink.match(/href="([^"]+)"/i)?.[1] as string

      return feedUrl
    } else {
      throw new Error("Invalid feed format")
    }
  } else {
    return null
  }
}

const parseGenerator = (generator: any) => {
  if (isObject(generator)) {
    let name = generator["#text"]

    if (name === "WordPress.com") {
      name = "WordPress (.com)"
    } else if (name === "Wordpress") {
      // versions prior to 6.1
      name = "WordPress"
    }
    const version = generator["@_version"]

    return name + (version ? " " + version : "")
  } else if (isString(generator)) {
    if (generator === "Wowchemy (https://wowchemy.com)") {
      return "Hugo"
    }
    try {
      const url = new URL(generator)

      if (url.hostname === "wordpress.org") {
        const name = "WordPress"
        const version = url.searchParams.get("v")

        return name + (version ? " " + version : "")
      } else if (url.hostname === "wordpress.com") {
        const name = "WordPress (.com)"

        return name
      }
    } catch (error) {
      // console.log(error)
    }
    generator = generator.replace(
      /^(\w+)(.+)(-?v?\d{1,2}\.\d{1,2}\.\d{1,3})$/gm,
      "$1 $3"
    )
    return capitalize(generator)
  } else {
    return null
  }
}

export async function getSingleBlog(blogSlug: string) {
  const { data: config } = await supabase
    .from("blogs")
    .select(
      "id, feed_url, current_feed_url, home_page_url, generator, title, category, status, user_id, authors"
    )
    .eq("id", blogSlug)
    .maybeSingle()

  if (!config) {
    return {}
  }

  const feed_url = await validateFeedUrl(config["feed_url"])

  if (!feed_url) {
    return {}
  }

  let blog: BlogType = await extract(feed_url, {
    useISODateFormat: true,
    getExtraFeedFields: (feedData) => {
      // console.log(feedData)
      const title = decodeHtmlCharCodes(
        config["title"] ||
          get(feedData, "title.#text", null) ||
          get(feedData, "title", null)
      ).trim()
      const current_feed_url = config["current_feed_url"]
      let home_page_url =
        []
          .concat(get(feedData, "link", []))
          .find((link) => get(link, "@_rel", null) === "alternate") ||
        config["home_page_url"]

      home_page_url = get(home_page_url, "@_href", null) || home_page_url

      let feed_format =
        []
          .concat(get(feedData, "link", []))
          .find((link) => get(link, "@_rel", null) === "self") || {}

      feed_format =
        get(feed_format, "@_type", null) ||
        get(feedData, "@_xmlns", null) === "http://www.w3.org/2005/Atom"
          ? "application/atom+xml"
          : null ||
            get(feedData, "atom:link.@_type", null) ||
            "application/rss+xml"

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

      let favicon = get(feedData, "image.url", null) || config["favicon"]

      favicon =
        favicon !== "https://s0.wp.com/i/buttonw-com.png" ? favicon : null

      return {
        id: config["id"],
        version: "https://jsonfeed.org/version/1.1",
        feed_url,
        current_feed_url,
        home_page_url,
        feed_format,
        title,
        generator,
        description,
        favicon,
        language,
        license: "https://creativecommons.org/licenses/by/4.0/legalcode",
        category: config["category"],
        status: config["status"],
        user_id: config["user_id"],
        authors: config["authors"],
      }
    },
  })
  // find timestamp from last modified post
  const { data: posts } = await supabase
    .from("posts")
    .select("updated_at, blog_id")
    .eq("blog_id", blog.id)
    .order("updated_at", { ascending: false })
    .limit(1)

  blog.modified_at =
    posts && posts.length > 0
      ? toISOString(posts[0].updated_at) || "1970-01-01T00:00:00Z"
      : "1970-01-01T00:00:00Z"
  blog = omit(blog, ["published", "link", "entries"])
  return blog
}

export default async function handler(req, res) {
  const slug = req.query.params?.[0]
  const action = req.query.params?.[1]

  const query = req.query.query || ""
  const page = (req.query.page as number) || 1
  const update = req.query.update

  if (req.method === "GET") {
    if (slug) {
      if (action === "posts") {
        const searchParameters = {
          q: query,
          filter_by: `blog_id:=${slug}`,
          query_by:
            "tags,title,authors.name,authors.url,summary,content_html,reference",
          sort_by: req.query.query ? "_text_match:desc" : "published_at:desc",
          per_page: 15,
          page: page && page > 0 ? page : 1,
        }
        const data: PostSearchResponse = await typesense
          .collections("posts")
          .documents()
          .search(searchParameters)
        const posts = data.hits?.map((hit) => hit.document)

        if (posts) {
          res.status(200).json(posts)
        } else {
          res.status(404).json({ message: "Not Found" })
        }
      } else {
        const { data: blog, error } = await supabase
          .from("blogs")
          .select(blogWithPostsSelect)
          .eq("id", slug)

        if (error) {
          return res.status(400).json({ message: error })
        }

        if (blog) {
          res.status(200).json(blog[0])
        } else {
          res.status(404).json({ message: "Not Found" })
        }
      }
    } else {
      const { data: blogs, error } = await supabase
        .from("blogs")
        .select(blogsSelect)
        .in("status", ["approved", "active"])
        .order("title", { ascending: true })

      if (error) {
        console.log(error)
      }

      res.status(200).json(blogs)
    }
  } else if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[1] !==
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  ) {
    res.status(401).json({ message: "Unauthorized" })
  } else if (req.method === "POST") {
    if (slug) {
      if (action === "posts") {
        let posts: PostType[] = []

        if (update === "all") {
          posts = await extractAllPostsByBlog(slug, page)
        } else {
          posts = await extractUpdatedPostsByBlog(slug, page)
        }
        if (posts) {
          await Promise.all(posts.map((post) => upsertSinglePost(post)))
          res.status(200).json(posts)
        } else {
          res.status(404).json({ message: "Posts not found" })
        }
      } else {
        const blog = await upsertSingleBlog(slug)

        res.status(200).json(blog)
      }
    } else {
      const blogs = await updateAllBlogs()

      res.status(200).json(blogs)
    }
  }
}
