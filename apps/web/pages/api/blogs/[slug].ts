import { extract, FeedData } from '@extractus/feed-extractor'
import fs from 'fs'
import { get, pick } from 'lodash'
import path from 'path'

// const archiver = require('archiver')
import { getAllBlogs } from '../blogs'

const isDoi = (doi: string) => {
  try {
    return new URL(doi).hostname === 'doi.org'
  } catch (error) {
    return false
  }
}

const isOrcid = (orcid: string) => {
  try {
    return new URL(orcid).hostname === 'orcid.org'
  } catch (error) {
    return false
  }
}

const isString = (str: any) => {
  return typeof str === 'string' || str instanceof String ? true : false
}

// const idAsSlug = (id: string) => {
//   return id.replace(/https?:\/\/doi\.org\//, '').replace(/\//g, '-')
// }

export async function writeOneBlog(blogSlug) {
  // create blog directory if it doesn't exist
  const folderPath = path.resolve(process.cwd(), `public/${blogSlug}`)

  if (!fs.existsSync(folderPath)) {
    console.log(folderPath)
    fs.mkdirSync(folderPath)
  }

  let blog = await getSingleBlog(blogSlug)

  // reformat feed into JSON Feed format
  blog['version'] = 'https://jsonfeed.org/version/1.1'
  blog['items'] = blog.entries
  // filter entries to only include DOIs
  // blog['items'] = blog.entries.filter((blog) => {
  //   return isDoi(blog.id)
  // })
  // .map((post) => {
  //   const postId = idAsSlug(post.id)
  //   const postPath = path.resolve(
  //     process.cwd(),
  //     `public/${blog.id}/${postId}.json`
  //   )

  //   fs.writeFileSync(postPath, JSON.stringify(post))
  // })
  blog = pick(blog, [
    'version',
    'id',
    'title',
    'description',
    'language',
    'license',
    'category',
    'homePageUrl',
    'feedUrl',
    'favicon',
    'generator',
    'items',
  ])

  const blogPath = path.resolve(process.cwd(), `public/${blog.id}/blog.json`)

  fs.writeFileSync(blogPath, JSON.stringify(blog))
}

export async function getSingleBlog(blogSlug) {
  const blogs = await getAllBlogs()
  const blog = blogs.find((blog) => blog.id === blogSlug)

  interface Feed extends FeedData {
    id?: string
    description?: string
    feedUrl?: string
    homePageUrl?: string
    favicon?: string
    language?: string
    license?: string
    category?: string
    generator?: string
  }

  const feed: Feed = await extract(blog.feed_url, {
    useISODateFormat: true,
    getExtraFeedFields: (feedData) => {
      // console.log(feedData)
      const id = blog.id
      const feedUrl = blog.feed_url
      let homePageUrl = []
        .concat(get(feedData, 'link', null))
        .find((link) => get(link, '@_rel', null) === 'alternate')

      homePageUrl =
        get(homePageUrl, '@_href', null) || get(feedData, 'link', null)
      const generator =
        get(feedData, 'generator.#text', null) ||
        get(feedData, 'generator', null)
      let description =
        get(feedData, 'description.#text', null) ||
        get(feedData, 'description', null) ||
        get(feedData, 'subtitle.#text', null) ||
        get(feedData, 'subtitle', null)

      description = isString(description) ? description : null
      const language = get(feedData, 'language', null) || blog.language
      const favicon = get(feedData, 'image.url', null) || blog.favicon
      const license = get(feedData, 'rights.#text', null) || blog.license
      const category = blog.category
      const environment = blog.environment || 'production'

      return {
        id,
        feedUrl,
        homePageUrl,
        generator,
        description,
        favicon,
        language,
        license,
        category,
        environment,
      }
    },
    getExtraEntryFields: (feedEntry) => {
      // console.log(feedEntry)
      const author =
        get(feedEntry, 'author', null) || get(feedEntry, 'dc:creator', null)
      const authors = [].concat(author).map((author) => {
        return {
          name: get(author, 'name', null) || author,
          url: isOrcid(get(author, 'uri', null))
            ? get(author, 'uri', null)
            : null,
        }
      })
      const id =
        get(feedEntry, 'id.#text', null) ||
        get(feedEntry, 'guid.#text', null) ||
        get(feedEntry, 'id', null)
      // let link =
      //   []
      //     .concat(get(feedEntry, 'link', null))
      //     .find((link) => get(link, '@_rel', null) === 'alternate') ||
      //   get(feedEntry, 'link.@_href', null) ||
      //   get(feedEntry, 'link', null) ||
      //   id

      // link = get(link, '@_href', null)
      const isPermalink =
        isDoi(id) ||
        get(feedEntry, 'guid.@_isPermalink', null) ||
        get(feedEntry, 'id.@_isPermalink', null)
      const tags = []
        .concat(get(feedEntry, 'category', []))
        .map(
          (tag) => get(tag, '@_term', null) || get(tag, '#text', null) || tag
        )
        .slice(0, 5)
      const image =
        get(feedEntry, 'media:content.@_url', null) ||
        get(feedEntry, 'enclosure.@_url', null)
      const published =
        get(feedEntry, 'pubDate', null) || get(feedEntry, 'published', null)
      const modified = get(feedEntry, 'updated', null)
      const contentHtml =
        get(feedEntry, 'content:encoded', null) ||
        get(feedEntry, 'content.#text', null) ||
        get(feedEntry, 'description', null)

      return {
        id,
        // link,
        isPermalink: Boolean(isPermalink),
        tags,
        authors,
        image,
        published,
        modified,
        contentHtml,
      }
    },
  })

  return feed
}

export default async function handler(req, res) {
  const blog = await getSingleBlog(req.query.slug)

  res.status(200).json(blog)
}
