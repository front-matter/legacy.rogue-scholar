import {
  extract,
  extractFromJson,
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
import normalizeUrl from "normalize-url"

const xml2js = require("xml2js")

import {
  authorIDs,
  decodeHtmlCharCodes,
  detectLanguage,
  extractGhostPost,
  extractJekyllPost,
  extractSubstackPost,
  extractWordpresscomPost,
  extractWordpressPost,
  // extractImage,
  getAbstract,
  getContent,
  getImages,
  getMastodonAccount,
  getReferences,
  getRelationships,
  getSlug,
  getTitle,
  isOrcid,
  isRor,
  normalizeAuthor,
  normalizeTag,
  parseGenerator,
  registerMastodonAccount,
  toISOString,
  toUnixTime,
} from "@/lib/helpers"
import { ghostApi } from "@/lib/server/ghost"
import { supabaseAdmin } from "@/lib/server/supabase-admin"
// import { masto } from "@/lib/mastoClient"
import {
  blogWithPostsSelect,
  postsWithBlogSelect,
  supabase,
} from "@/lib/supabaseClient"
import { typesense } from "@/lib/typesenseClient"
import { upsertSinglePost } from "@/pages/api/posts/[[...params]]"
import { BlogType, PostType } from "@/types/blog"
import { PostSearchParams, PostSearchResponse } from "@/types/typesense"

export async function extractAllPostsByBlog(
  blogSlug: string,
  page = 1,
  updateAll = false
) {
  const blog: BlogType = await getSingleBlog(blogSlug)

  const url = new URL(blog.feed_url || "")
  const generator = blog.generator?.split(" ")[0]

  // limit number of pages for free plan to 5 (50 posts)
  page = blog.plan === "Starter" ? Math.min(page, 5) : page
  let startPage = page > 0 ? (page - 1) * 50 + 1 : 1

  // handle pagination depending on blogging platform and whether we use their API
  switch (generator) {
    case "WordPress":
      if (blog.use_api) {
        url.searchParams.delete("feed")
        url.searchParams.append("rest_route", "/wp/v2/posts")
        url.searchParams.append("page", String(page))
        url.searchParams.append("per_page", String(50))
      } else {
        url.searchParams.append("paged", String(page))
      }
      break
    case "WordPress (.com)":
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
    case "Substack":
      startPage = page > 0 ? (page - 1) * 50 : 0

      url.pathname = "api/v1/posts/"
      url.searchParams.set("sort", "new")
      url.searchParams.set("offset", String(startPage))
      url.searchParams.set("limit", "50")
  }
  const feed_url = String(url.href)

  let blogWithPosts = {}
  //console.log(blog.slug, blog.feed_format)

  try {
    if (generator === "Substack") {
      const res = await fetch(feed_url)

      if (res.status < 400) {
        const items = await res.json()

        blogWithPosts["entries"] = await Promise.all(
          items.map((post: any) => extractSubstackPost(post, blog))
        )
      } else {
        blogWithPosts["entries"] = []
      }
    } else if (generator === "WordPress" && blog.use_api) {
      const resp = await fetch(feed_url)
      const posts = await resp.json()
      const rest = await fetch(
        `${blog.home_page_url}/?rest_route=/wp/v2/categories&per_page=100`
      )
      const categories = await rest.json()

      blogWithPosts["entries"] = await Promise.all(
        []
          .concat(posts)
          .map((post: any) => extractWordpressPost(post, blog, categories))
      )
    } else if (generator === "WordPress (.com)" && blog.use_api) {
      const res = await fetch(feed_url)
      const response = await res.json()
      const posts = response.posts || []

      blogWithPosts["entries"] = await Promise.all(
        posts.map((post: any) => extractWordpresscomPost(post, blog))
      )
    } else if (generator === "Ghost" && blog.use_api) {
      const api = await ghostApi(
        blog.home_page_url as string,
        blog.slug as string
      )
      const posts = await api.posts.browse({
        page: page,
        limit: 50,
        order: "updated_at DESC",
        include: "tags,authors",
      })

      blogWithPosts["entries"] = await Promise.all(
        posts.map((post: any) => extractGhostPost(post, blog))
      )
    } else if (
      generator === "Jekyll" &&
      blog.feed_format === "application/atom+xml"
    ) {
      const res = await fetch(feed_url)
      const xml = await res.text()

      const json = await xml2js.parseStringPromise(xml)

      if (!updateAll) {
        json.feed["entry"] = json.feed["entry"].filter((post) => {
          return post.updated[0] > (blog.modified_at as string)
        })
      }

      blogWithPosts["entries"] = await Promise.all(
        json.feed["entry"].map((post: any) => extractJekyllPost(post, blog))
      )
    } else if (["application/feed+json"].includes(blog.feed_format as string)) {
      const res = await fetch(feed_url)
      const json = await res.json()

      if (!updateAll) {
        try {
          json["items"] = json["items"].filter((post) => {
            return post.date_modified > (blog.modified_at as string)
          })
        } catch (error) {
          console.log(error)
        }
      }

      blogWithPosts = await extractFromJson(json, {
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
          const blog_id = blog.id
          const blog_name = blog.title
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
          const content_html = getContent(feedEntry)
          const summary = getAbstract(content_html)
          const images = getImages(content_html, url)
          const image =
            get(feedEntry, "media:content.@_url", null) ||
            get(feedEntry, "enclosure.@_url", null) ||
            (images || [])
              .filter((image) => image.width || 0 >= 200)
              .map((image) => image.src)[0] ||
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
              .map((image) => image.src)[0] ||
            null

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
          let tags = compact(
            []
              .concat(get(feedEntry, "category", []))
              .map((tag: string | null) => {
                tag = decodeHtmlCharCodes(
                  get(tag, "@_term", null) || get(tag, "#text", null) || tag
                )
                return tag ? normalizeTag(tag) : null
              })
          ).slice(0, 5)

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
          }
        },
      })
    } else if (
      ["application/atom+xml", "application/rss+xml"].includes(
        blog.feed_format as string
      )
    ) {
      const res = await fetch(feed_url)
      let xml = await res.text()

      if (!updateAll) {
        try {
          const json = await xml2js.parseStringPromise(xml)

          json.feed["entry"] = json.feed["entry"].filter((post) => {
            return post.updated[0] > (blog.modified_at as string)
          })
          const builder = new xml2js.Builder()

          xml = builder.buildObject(json)
        } catch (error) {
          console.log(error)
        }
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
          // link to archived version of post if blog is archived
          let archive_url: any = null

          if (blog.status === "archived" && blog.archive_prefix) {
            archive_url = blog.archive_prefix + url
          }
          const content_html = getContent(feedEntry)
          const summary = getAbstract(content_html)
          const images = getImages(content_html, url)
          const image =
            get(feedEntry, "media:content.@_url", null) ||
            get(feedEntry, "enclosure.@_url", null) ||
            (images || [])
              .filter((image) => image.width || 0 >= 200)
              .map((image) => image.src)[0] ||
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
              .map((image) => image.src)[0] ||
            null

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

  let posts = blogWithPosts ? blogWithPosts["entries"] : []

  // handle pagination depending on blogging platform
  const postCount = posts.length

  startPage = page > 0 ? (page - 1) * 50 : 0
  const endPage = page > 0 ? page * 50 : 50

  if (
    postCount > 50 &&
    ["Hugo", "Jekyll", "Quarto", "Ghost"].includes(String(generator))
  ) {
    posts = posts.slice(startPage, endPage)
  }

  return posts
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
    .eq("blog_slug", blogSlug)
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

  //  find timestamp from last modified post
  const { data: posts } = await supabase
    .from("posts")
    .select("updated_at, blog_slug")
    .eq("blog_slug", blog.slug)
    .order("updated_at", { ascending: false })
    .limit(1)

  blog.modified_at =
    posts && posts.length > 0
      ? toISOString(posts[0].updated_at) || "1970-01-01T00:00:00Z"
      : "1970-01-01T00:00:00Z"

  const { data, error } = await supabaseAdmin.from("blogs").upsert(
    {
      id: blog.id,
      slug: blog.slug,
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
      use_mastodon: blog.use_mastodon,
    },
    { onConflict: "slug", ignoreDuplicates: false }
  )

  if (error) {
    throw error
  }

  return data
}

export async function getSingleBlog(blogSlug: string) {
  const { data: config } = await supabase
    .from("blogs")
    .select(
      "id, slug, feed_url, current_feed_url, home_page_url, archive_prefix, feed_format, modified_at, use_mastodon, generator, favicon, title, category, status, user_id, authors, plan, use_api"
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
    modified_at: config["modified_at"],
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
  }

  try {
    blog = await extract(config["feed_url"], {
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
        }
      },
    })
  } catch (error) {
    console.log(error)
  }

  return omit(blog, ["published", "link", "entries"])
}

export async function getMastodonBot(blog: BlogType) {
  const acct = get(blog, "slug", "")
  const data = await getMastodonAccount(acct)

  return data
}

export default async function handler(req, res) {
  const slug = req.query.params?.[0]
  const action = req.query.params?.[1]

  const query = req.query.query || ""
  const page = (req.query.page as number) || 1
  const update = req.query.update

  if (req.method === "GET") {
    if (action === "posts") {
      const searchParameters: PostSearchParams = {
        q: query,
        filter_by: `blog_slug:=${slug}`,
        query_by:
          "tags,title,doi,authors.name,authors.url,reference.url,summary,content_html",
        sort_by: req.query.query ? "_text_match:desc" : "published_at:desc",
        per_page: 10,
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
    }
    if (action === "mastodon") {
      // const blog: BlogType = await getSingleBlog(slug)
      // const data = await getMastodonAccount(blog.slug || "")
      const data = await registerMastodonAccount(slug)

      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).json({ message: "Not Found" })
      }
    } else {
      const { data: blog, error } = await supabase
        .from("blogs")
        .select(blogWithPostsSelect)
        .eq("slug", slug)

      if (error) {
        return res.status(400).json({ message: error })
      }

      if (blog) {
        res.status(200).json(blog[0])
      } else {
        res.status(404).json({ message: "Not Found" })
      }
    }
  } else if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[1] !==
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  ) {
    res.status(401).json({ message: "Unauthorized" })
  } else if (req.method === "POST") {
    if (action === "index") {
      const { error } = await supabase
        .from("posts")
        .update({ not_indexed: true })
        .eq("blog_slug", slug)

      if (error) {
        console.log(error)
      }

      res
        .status(200)
        .json({ message: `Indexing all posts for blog ${slug} started` })
    } else if (action === "posts") {
      let posts: PostType[] = []

      try {
        const updateAll = update === "all" ? true : false

        posts = await extractAllPostsByBlog(slug, page, updateAll)
      } catch (error) {
        console.log(error)
      }
      if (posts) {
        await Promise.all(posts.map((post) => upsertSinglePost(post)))
        res.status(200).json(posts)
      } else {
        res.status(404).json({ message: "Posts not found" })
      }
    } else if (action === "mastodon") {
      const blog: BlogType = await getSingleBlog(slug)

      const data = await getMastodonAccount(blog.slug || "")

      if (data) {
        res.status(200).json(data)
      } else {
        const data = await registerMastodonAccount(blog)

        if (data) {
          res.status(200).json(data)
        } else {
          res.status(404).json({ message: "Not Found" })
        }
      }
    } else {
      const blog = await upsertSingleBlog(slug)

      res.status(200).json(blog)
    }
  }
}
