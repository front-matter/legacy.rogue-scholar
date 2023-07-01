import { extract } from "@extractus/feed-extractor"
import { stripTags, truncate } from "bellajs"
import fs from "fs"
import * as hcl from "hcl2-parser"
import isRelativeUrl from "is-relative-url"
import {
  capitalize,
  get,
  isArray,
  isObject,
  isString,
  omit,
  uniq,
} from "lodash"
import normalizeUrl from "normalize-url"
import path from "path"
const extractUrls = require("extract-urls")

import {
  decodeHtmlCharCodes,
  getPagination,
  isDoi,
  isOrcid,
  isRor,
  toISODateString,
} from "@/lib/helpers"
import { supabaseAdmin } from "@/lib/server/supabase-admin"
import {
  blogsSelect,
  blogWithPostsSelect,
  postsSelect,
  postsWithBlogSelect,
  supabase,
} from "@/lib/supabaseClient"
import { upsertSinglePost } from "@/pages/api/posts/[[...params]]"
import { BlogType, PostType } from "@/types/blog"

const optionalKeys = [
  "current_feed_url",
  "base_url",
  "title",
  "description",
  "language",
  "category",
  "favicon",
  "generator",
  "indexed_at",
  "prefix",
  "expired",
]

export async function getAllConfigs() {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || "development"
  const filePath = path.resolve("rogue-scholar.hcl")
  const hclString = fs.readFileSync(filePath)
  const configs = hcl
    .parseToObject(hclString)[0]
    .blog.map((config: { [x: string]: any }) => {
      // enforce optional keys exist
      for (const key of optionalKeys) {
        config[key] = config[key] == null ? null : config[key]
      }
      return config
    })
    .filter((config: { indexed_at: any }) => {
      return env != "production" || config.indexed_at
    })

  return configs
}

export async function updateAllBlogs() {
  const configs = await getAllConfigs()

  await Promise.all(configs.map((config) => upsertSingleBlog(config.id)))
}
// from https://github.com/extractus/feed-extractor/blob/main/src/utils/normalizer.js
export const buildDescription = (val, maxlen) => {
  const stripped = stripTags(String(val))

  return truncate(stripped, maxlen).replace(/\n+/g, " ")
}

export const authorIDs = {
  "Roderic Page": "https://orcid.org/0000-0002-7101-9767",
  "Liberate Science": "https://ror.org/0342dzm54",
}

const getReferences = (content_html: string) => {
  // extract links from references section,defined as the text after the tag
  // "References</h2>", "References</h3>" or "References</h4>
  const reference_html = content_html.split(/References<\/(?:h2|h3|h4)>/, 2)

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

export async function extractAllPostsByBlog(blogSlug: string) {
  const blog: BlogType = await getSingleBlog(blogSlug)

  try {
    const blogWithPosts = await extract(blog.feed_url as string, {
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
        const content_html =
          get(feedEntry, "content:encoded", null) ||
          get(feedEntry, "content.#text", null) ||
          get(feedEntry, "description", null)
        let summary = buildDescription(content_html, 500)

        summary = decodeHtmlCharCodes(summary)
        const date_published = toISODateString(
          get(feedEntry, "pubDate", null) ||
            get(feedEntry, "published", "1970-01-01")
        )
        let date_modified = toISODateString(
          get(feedEntry, "updated", "1970-01-01")
        )

        if (date_published && date_modified && date_published > date_modified) {
          date_modified = date_published
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
        // const id =
        //   get(feedEntry, 'id.#text', null) ||
        //   get(feedEntry, 'guid.#text', null) ||
        //   get(feedEntry, 'id', null) ||
        //   get(feedEntry, 'guid', null) ||
        //   url;
        const image =
          get(feedEntry, "media:content.@_url", null) ||
          get(feedEntry, "enclosure.@_url", null)
        const language =
          get(feedEntry, "dc:language", null) ||
          get(feedEntry, "language", null) ||
          blog.language
        const references = content_html ? getReferences(content_html) : []
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
          content_html,
          summary,
          date_modified,
          date_published,
          image,
          language,
          references,
          tags,
          title,
          url,
        }
      },
    })

    const posts: PostType[] = blogWithPosts["entries"] || []

    return posts
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function extractUpdatedPostsByBlog(blogSlug: string) {
  const blog: BlogType = await getSingleBlog(blogSlug)
  const posts = await extractAllPostsByBlog(blogSlug)

  return posts.filter((post) => {
    return (post.date_modified as string) > (blog.modified_at as string)
  })
}

export async function getAllPostsByBlog(blogSlug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(postsWithBlogSelect)
    .eq("blog_id", blogSlug)
    .order("date_published", { ascending: false })

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
      indexed_at: blog.indexed_at,
      modified_at: blog.modified_at,
      language: blog.language,
      favicon: blog.favicon,
      license: blog.license,
      category: blog.category,
      generator: blog.generator,
      prefix: blog.prefix,
      expired: blog.expired,
    },
    { onConflict: "id", ignoreDuplicates: false }
  )

  if (error) {
    throw error
  }

  return data
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
  const configs = await getAllConfigs()
  const config = configs.find((config) => config.id === blogSlug)

  let blog: BlogType = await extract(config.feed_url, {
    useISODateFormat: true,
    getExtraFeedFields: (feedData) => {
      // console.log(feedData)
      // required properties from config
      const id = config.id
      const version = "https://jsonfeed.org/version/1.1"
      const feed_url = config.feed_url
      const category = config.category
      const indexed_at = config.indexed_at
      const title = decodeHtmlCharCodes(
        config.title ||
          get(feedData, "title.#text", null) ||
          get(feedData, "title", null)
      ).trim()
      const current_feed_url = config.current_feed_url
      let home_page_url = []
        .concat(get(feedData, "link", []))
        .find((link) => get(link, "@_rel", null) === "alternate")

      home_page_url =
        config.home_page_url ||
        get(home_page_url, "@_href", null) ||
        get(feedData, "id", null) ||
        get(feedData, "link", null)

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

      generator = parseGenerator(generator) || config.generator

      let description =
        config.description ||
        get(feedData, "description.#text", null) ||
        get(feedData, "description", null) ||
        get(feedData, "subtitle.#text", null) ||
        get(feedData, "subtitle", null)

      description = isString(description)
        ? decodeHtmlCharCodes(description).trim()
        : null

      let language =
        get(feedData, "language", null) ||
        get(feedData, "@_xml:lang", null) ||
        config.language
      // normalize language to ISO 639-1, e.g. en-US -> en
      // en is the default language

      language = language ? language.split("-")[0] : "en"

      let favicon = get(feedData, "image.url", null) || config.favicon

      favicon =
        favicon !== "https://s0.wp.com/i/buttonw-com.png" ? favicon : null

      const license = get(feedData, "rights.#text", null)
        ? null
        : "https://creativecommons.org/licenses/by/4.0/legalcode"
      const prefix = config.prefix
      const expired = config.expired

      return {
        id,
        version,
        feed_url,
        current_feed_url,
        home_page_url,
        feed_format,
        title,
        category,
        generator,
        description,
        favicon,
        language,
        license,
        indexed_at,
        prefix,
        expired,
      }
    },
  })
  // find timestamp from last modified post
  const { data: posts } = await supabase
    .from("posts")
    .select("date_modified, blog_id")
    .eq("blog_id", blog.id)
    .order("date_modified", { ascending: false })
    .limit(1)

  blog.modified_at =
    posts && posts.length > 0 ? posts[0].date_modified : "1970-01-01T00:00:00Z"
  blog = omit(blog, ["published", "link", "entries"])
  return blog
}

export default async function handler(req, res) {
  const slug = req.query.params?.[0]
  const action = req.query.params?.[1]

  const query = req.query.query || "doi.org"
  const page = (req.query.page as number) || 0
  const { from, to } = getPagination(page, 15)

  if (req.method === "GET") {
    if (slug) {
      if (action === "posts") {
        const { data: posts, error } = await supabase
          .from("posts")
          .select(postsSelect)
          .eq("blog_id", slug)
          .textSearch("fts", query, {
            type: "plain",
            config: "english",
          })
          .order("date_published", { ascending: false })
          .range(from, to)

        if (error) {
          return res.status(400).json({ message: error })
        }

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
        const posts = await extractUpdatedPostsByBlog(slug)

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
