import { extract, FeedData } from '@extractus/feed-extractor'
import fs from 'fs'
import { get, isObject, omit, pick } from 'lodash'
import path from 'path'

// const archiver = require('archiver')
import { getAllConfigs } from '../blogs'

export interface AuthorType {
  name: string
  url?: string
}

export interface PostType {
  id: string
  link?: string
  isPermalink?: boolean
  title?: string
  description?: string
  published?: Date
  authors?: AuthorType[]
  image?: string
  tags?: string[]
}

export interface BlogType extends FeedData {
  id?: string
  title?: string
  category?: string[]
  description?: string
  language?: string
  homePageUrl?: string
  feedUrl?: string
  icon?: string
  favicon?: string
  generator?: string
  license?: boolean
  preview?: boolean
  items?: PostType[]
}

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

const parseGenerator = (generator: any) => {
  if (isObject(generator)) {
    const name = generator['#text']
    const version = generator['@_version']

    return name + (version ? ' ' + version : '')
  } else if (isString(generator)) {
    try {
      const url = new URL(generator)

      if (url.hostname === 'wordpress.org') {
        const name = 'Wordpress'
        const version = url.searchParams.get('v')

        return name + (version ? ' ' + version : '')
      } else if (url.hostname === 'wordpress.com') {
        const name = 'Wordpress (.com)'

        return name
      }
    } catch (error) {
      // console.log(error)
    }
    return generator.replace(
      /^(\w+)(.+)(v?\d{1,2}\.\d{1,2}\.\d{1,3})$/gm,
      '$1 $3'
    )
  } else {
    return null
  }
}

// const idAsSlug = (id: string) => {
//   return id.replace(/https?:\/\/doi\.org\//, '').replace(/\//g, '-')
// }

export async function writeSingleBlog(blogSlug) {
  // create blog directory if it doesn't exist
  const folderPath = path.resolve(process.cwd(), `public/${blogSlug}`)

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }

  let blog = await getSingleBlog(blogSlug, { includePosts: true })

  // reformat feed into JSON Feed format
  blog['version'] = 'https://jsonfeed.org/version/1.1'

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

export async function getSingleBlog(blogSlug, { includePosts = false } = {}) {
  const configs = await getAllConfigs()
  const config = configs.find((config) => config.id === blogSlug)
  let blog: BlogType = config

  try {
    blog = await extract(config.feedUrl, {
      useISODateFormat: true,
      getExtraFeedFields: (feedData) => {
        const id = config.id
        const feedUrl = config.feedUrl
        let homePageUrl = []
          .concat(get(feedData, 'link', null))
          .find((link) => get(link, '@_rel', null) === 'alternate')

        homePageUrl =
          config.homePageUrl ||
          get(homePageUrl, '@_href', null) ||
          get(feedData, 'link', null)
        let generator = get(feedData, 'generator', null)

        generator = parseGenerator(generator)
        let description =
          get(feedData, 'description.#text', null) ||
          get(feedData, 'description', null) ||
          get(feedData, 'subtitle.#text', null) ||
          get(feedData, 'subtitle', null)

        description = isString(description) ? description : null
        let language = get(feedData, 'language', null) || config.language
        // normalize language to ISO 639-1, e.g. en-US -> en
        // en is the default language

        language = language ? language.split('-')[0] : 'en'
        let favicon = get(feedData, 'image.url', null) || config.favicon

        favicon =
          favicon !== 'https://s0.wp.com/i/buttonw-com.png' ? favicon : null
        const license =
          get(feedData, 'rights.#text', null) || config.license === false
            ? null
            : 'https://creativecommons.org/licenses/by/4.0/legalcode'
        const category = config.category
        const preview = config.preview

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
          preview,
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
  } catch (error) {
    console.error(error)
  }

  if (includePosts) {
    blog.items = blog['entries']
  } else {
    blog = omit(blog, ['entries'])
  }

  return blog
}

export default async function handler(req, res) {
  const blog = await getSingleBlog(req.query.slug)

  res.status(200).json(blog)
}
