import { extract } from "@extractus/feed-extractor"
import isRelativeUrl from "is-relative-url"
import {
  camelCase,
  get,
  isArray,
  isEmpty,
  isNull,
  isObject,
  isString,
  omit,
  startCase,
  uniq,
} from "lodash"
import normalizeUrl from "normalize-url"
import sanitizeHtml from "sanitize-html"
const extractUrls = require("extract-urls")
const jsdom = require("jsdom")
const { JSDOM } = jsdom

// import { is } from "date-fns/locale"

import {
  decodeHtmlCharCodes,
  detectLanguage,
  getAbstract,
  getMastodonAccount,
  isDoi,
  isOrcid,
  isRor,
  isValidUrl,
  parseGenerator,
  registerMastodonAccount,
  toISOString,
  toUnixTime,
} from "@/lib/helpers"
// import { masto } from "@/lib/mastoClient"
import { supabaseAdmin } from "@/lib/server/supabase-admin"
import {
  blogWithPostsSelect,
  postsWithBlogSelect,
  supabase,
} from "@/lib/supabaseClient"
import { typesense } from "@/lib/typesenseClient"
import { upsertSinglePost } from "@/pages/api/posts/[[...params]]"
import { AuthorType, BlogType, PostType } from "@/types/blog"
import { PostSearchParams, PostSearchResponse } from "@/types/typesense"

export const authorIDs = {
  "Kristian Garza": "https://orcid.org/0000-0003-3484-6875",
  "Roderic Page": "https://orcid.org/0000-0002-7101-9767",
  "Tejas S. Sathe": "https://orcid.org/0000-0003-0449-4469",
  "Meghal Shah": "https://orcid.org/0000-0002-2085-659X",
  "Liberate Science": "https://ror.org/0342dzm54",
  "David M. Shotton": "https://orcid.org/0000-0001-5506-523X",
  "Lars Willighagen": "https://orcid.org/0000-0002-4751-4637",
  "Marco Tullney": "https://orcid.org/0000-0002-5111-2788",
  "Andrew Heiss": "https://orcid.org/0000-0002-3948-3914",
  "Henry Rzepa": "https://orcid.org/0000-0002-8635-8390",
  "Sebastian Karcher": "https://orcid.org/0000-0001-8249-7388",
}

const normalizeAuthor = (author: AuthorType) => {
  // workaround for https://doi.org/10.59350/h4fhq-2t215
  if (author["name"] === "GPT-4") {
    author["name"] = "Tejas S. Sathe"
  } else if (author["name"] === "davidshotton") {
    author["name"] = "David M. Shotton"
  } else if (author["name"] === "Morgan & Ethan") {
    author["name"] = "Morgan Ernest"
  } else if (author["name"] === "Marco") {
    author["name"] = "Marco Tullney"
  } else if (author["name"] === "NFernan") {
    author["name"] = "Norbisley Fernández"
  } else if (author["name"] === "skarcher@syr.edu") {
    author["name"] = "Sebastian Karcher"
  }
  author["name"] = author["name"].replace(/, MD$/, "")
  return author
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
    if (isDoi(url)) {
      const uri = new URL(url)

      if (uri.protocol === "http") {
        uri.protocol = "https"
      }
      if (uri.host === "dx.doi.org") {
        uri.host = "doi.org"
      }
      url = uri.href
    } else {
      url = url.toLowerCase()
    }
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

const normalizeTag = (tag: string) => {
  const fixedTags = {
    aPKC: "aPKC",
    CrossRef: "Crossref",
    DataCite: "DataCite",
    EU: "EU",
    USA: "USA",
    OSTP: "OSTP",
    ElasticSearch: "ElasticSearch",
    FoxP: "FoxP",
    GigaByte: "GigaByte",
    GigaDB: "GigaDB",
    GraphQL: "GraphQL",
    "JSON-LD": "JSON-LD",
    microCT: "MicroCT",
    MTE14: "MTE14",
    "Pre-Print": "Preprint",
    "Q&A": "Q&A",
    ResearchGate: "ResearchGate",
    RStats: "RStats",
    ScienceEurope: "Science Europe",
    TreeBASE: "TreeBASE",
    WikiCite: "WikiCite",
    WikiData: "WikiData",
  }

  tag = tag.replace("#", "")
  tag = get(fixedTags, tag, startCase(camelCase(tag)).replace(/ /g, ""))
  return tag
}

export function getSlug(url: string) {
  const uri = new URL(url)

  if (!["www", "blog", "medium"].includes(uri.host.split(".")[0])) {
    url = uri.host.split(".")[0]
  } else if (uri.host.split(".").length > 2) {
    url = uri.host.split(".")[1]
  } else if (uri.host.split(".")[0] === "medium") {
    url = uri.pathname
  }
  url = url.replace(/-/g, "_")
  return url
}

export function getContent(feedEntry: any) {
  let content_html =
    get(feedEntry, "content:encoded", null) ||
    get(feedEntry, "content.#text", null) ||
    get(feedEntry, "description", null) ||
    ""

  content_html = sanitizeHtml(content_html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  })

  // const dom = new JSDOM(`<!DOCTYPE html>${content_html}`)

  // // extract images from content and store locally
  // dom.window.document.querySelectorAll("img").forEach(async (image) => {
  //   return await getImage(image, blog_home_page_url)
  // })

  return content_html
}

export async function getImage(image: any, blog_home_page_url: string) {
  const src = image.getAttribute("src")
  let srcset = image.getAttribute("srcset")

  if (isString(srcset)) {
    srcset = srcset
      .split(", ")
      .map((src) => (isValidUrl(src) ? src : `${blog_home_page_url}${src}`))
      .join(", ")
  }
  // store image locally
  // const imagePath = await extractImage(
  //   src,
  //   String(blog_home_page_url),
  //   String(blog_id)
  // )

  return {
    src: src,
    srcset: srcset,
    width: image.getAttribute("width"),
    height: image.getAttribute("height"),
    sizes: image.getAttribute("sizes"),
    alt: image.getAttribute("alt"),
  }
}

export async function extractAllPostsByBlog(blogSlug: string, page = 1) {
  const blog: BlogType = await getSingleBlog(blogSlug)

  const url = new URL(blog.feed_url || "")

  const generator = blog.generator?.split(" ")[0]

  // limit number of pages for free plan to 5 (50 posts)
  page = blog.plan === "Starter" ? Math.min(page, 5) : page

  // handle pagination depending on blogging platform
  switch (generator) {
    case "WordPress":
      url.searchParams.append("paged", String(page))
      break
    case "Blogger":
      const startPage = page > 0 ? (page - 1) * 10 + 1 : 1

      url.searchParams.set("start-index", String(startPage))
      url.searchParams.set("max-results", String(10))
      break
  }

  const feed_url = url.href
  let blogWithPosts = {}

  try {
    blogWithPosts = await extract(feed_url as string, {
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

        if (isNull(author) || isEmpty(author)) {
          author = blog.authors || []
        }

        if (!isArray(author)) {
          author = [author]
        }

        const authors = author.map((auth) => {
          auth = normalizeAuthor(auth)

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
        const blog_id = blogSlug
        const blog_name = blog.title
        const blog_slug = blog.slug
        const content_html = getContent(feedEntry)
        const summary = getAbstract(content_html)
        const dom = new JSDOM(`<!DOCTYPE html>${content_html}`)
        const images: Array<{
          src: string
          srcset: string
          width: number
          height: number
          sizes: string
          alt: string
        }> = Array.from(dom.window.document.querySelectorAll("img")).map(
          (image: any) => {
            const src = image.getAttribute("src")
            let srcset = image.getAttribute("srcset")

            if (isString(srcset)) {
              srcset = srcset
                .split(", ")
                .map((src) =>
                  isValidUrl(src) ? src : `${blog.home_page_url}${src}`
                )
                .join(", ")
            }

            return {
              src: isValidUrl(src) ? src : `${blog.home_page_url}${src}`,
              srcset: srcset,
              width: image.getAttribute("width"),
              height: image.getAttribute("height"),
              sizes: image.getAttribute("sizes"),
              alt: image.getAttribute("alt"),
            }
          }
        )

        const image =
          get(feedEntry, "media:content.@_url", null) ||
          get(feedEntry, "enclosure.@_url", null) ||
          (images || [])
            .filter((image) => image.width >= 200)
            .map((image) => image.src)[0] ||
          (images || [])
            .filter((image: any) => {
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

        const language = detectLanguage(content_html || "en")
        const reference = content_html ? getReferences(content_html) : []
        const tags = []
          .concat(get(feedEntry, "category", []))
          .map((tag: string) => {
            tag = decodeHtmlCharCodes(
              get(tag, "@_term", null) || get(tag, "#text", null) || tag
            )
            tag = normalizeTag(tag)
            return tag
          })
          .slice(0, 5)
        let title =
          get(feedEntry, "title.#text", null) ||
          get(feedEntry, "title", null) ||
          ""

        if (isString(title)) {
          title = decodeHtmlCharCodes(title).trim()
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
          tags,
          title,
          url,
        }
      },
    })
  } catch (error) {
    console.log(error, blog.slug)
  }

  let posts = blogWithPosts["entries"] || []

  // handle pagination depending on blogging platform
  const postCount = posts.length
  const startPage = page > 0 ? (page - 1) * 10 : 0
  const endPage = page > 0 ? page * 10 : 10

  if (
    postCount > 10 &&
    ["Jekyll", "Hugo", "Quarto", "Ghost"].includes(String(generator))
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
    { onConflict: "id", ignoreDuplicates: false }
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
      "id, slug, feed_url, current_feed_url, home_page_url, use_mastodon, generator, favicon, title, category, status, user_id, authors, plan"
    )
    .eq("id", blogSlug)
    .maybeSingle()

  if (!config) {
    return {}
  }

  let blog: BlogType = await extract(config["feed_url"], {
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
      home_page_url = home_page_url ? home_page_url.replace(/\/+$/g, "") : null
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
        plan: config["plan"],
        user_id: config["user_id"],
        authors: config["authors"],
        use_mastodon: config["use_mastodon"],
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
  } else if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[1] !==
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  ) {
    res.status(401).json({ message: "Unauthorized" })
  } else if (req.method === "POST") {
    if (action === "posts") {
      let posts: PostType[] = []

      try {
        if (update === "all") {
          posts = await extractAllPostsByBlog(slug, page)
        } else {
          posts = await extractUpdatedPostsByBlog(slug, page)
        }
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
