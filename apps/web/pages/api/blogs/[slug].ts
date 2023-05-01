import { extract, FeedData } from '@extractus/feed-extractor'
// import Ajv, { DefinedError, JSONSchemaType } from 'ajv'
import {
  capitalize,
  get,
  isArray,
  isObject,
  mapKeys,
  omit,
  snakeCase,
} from 'lodash'

// const archiver = require('archiver')
import { getAllConfigs } from '../blogs'

const itemKeys = {
  description: 'summary',
  published: 'datePublished',
}

export interface AuthorType {
  name: string
  url?: string
  avatar?: string
}

export interface PostType {
  id?: string
  url?: string
  title?: string
  summary?: string
  datePublished?: string
  dateModified?: string
  authors?: AuthorType[]
  image?: string
  thumbnail?: string
  contentHtml?: string
  contentText?: string
  tags?: string[]
  language?: string
  issn?: string
}

export interface BlogType
  extends Omit<FeedData, 'entries' | 'published' | 'link'> {
  version?: string
  id?: string
  title?: string
  category?: string
  description?: string
  language?: string
  baseUrl?: string
  homePageUrl?: string
  feedUrl?: string
  icon?: string
  favicon?: string
  dateModified?: string
  dateIndexed?: string
  generator?: string
  hasLicense?: boolean
  license?: string
  feedFormat?: string
  items?: PostType[]
  expired?: boolean
}

// const postSchema: JSONSchemaType<PostType> = {
//   type: 'object',
//   properties: {
//     id: { type: 'string', nullable: true },
//     url: { type: 'string', nullable: true },
//     title: { type: 'string', nullable: true },
//     contentHtml: { type: 'string' },
//     contentText: { type: 'string' },
//     summary: { type: 'string', nullable: true },
//     image: { type: 'string' },
//     thumbnail: { type: 'string' },
//     datePublished: { type: 'string', nullable: true },
//     dateModified: { type: 'string', nullable: true },
//     authors: { type: 'array', nullable: true },
//     tags: { type: 'array' },
//     language: { type: 'string' },
//   },
//   required: ['id'],
//   additionalProperties: true,
// }

// const blogSchema: JSONSchemaType<BlogType> = {
//   type: 'object',
//   properties: {
//     version: { type: 'string', nullable: true },
//     id: { type: 'string', nullable: true },
//     feedUrl: { type: 'string', nullable: true },
//     title: { type: 'string', nullable: true },
//     items: { type: 'array', nullable: true },
//     homePageUrl: { type: 'string', nullable: true },
//     description: { type: 'string', nullable: true },
//     icon: { type: 'string', nullable: true },
//     favicon: { type: 'string', nullable: true },
//     language: { type: 'string', nullable: true },
//     feedFormat: { type: 'string', nullable: true },
//     dateModified: { type: 'string', nullable: true },
//     dateIndexed: { type: 'string', nullable: true },
//     category: { type: 'string', nullable: true },
//     generator: { type: 'string', nullable: true },
//     hasLicense: { type: 'boolean', nullable: true },
//     license: { type: 'string', nullable: true },
//     expired: { type: 'boolean', nullable: true },
//   },
//   required: ['id', 'feedUrl', 'items'],
//   additionalProperties: true,
// }

// const ajv = new Ajv()
// const validateBlog = ajv.compile(blogSchema)
// const validatePost = ajv.compile(postSchema)

// from @extractus/feed-extractor
const toISODateString = (dstr) => {
  try {
    return dstr ? new Date(dstr).toISOString().split('.')[0] + 'Z' : null
  } catch (err) {
    return ''
  }
}

export const isDoi = (doi: any) => {
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
    let name = generator['#text']

    if (name === 'WordPress.com') {
      name = 'WordPress (.com)'
    } else if (name === 'Wordpress') {
      // versions prior to 6.1
      name = 'WordPress'
    }
    const version = generator['@_version']

    return name + (version ? ' ' + version : '')
  } else if (isString(generator)) {
    if (generator === 'Wowchemy (https://wowchemy.com)') {
      return 'Hugo'
    }
    try {
      const url = new URL(generator)

      if (url.hostname === 'wordpress.org') {
        const name = 'WordPress'
        const version = url.searchParams.get('v')

        return name + (version ? ' ' + version : '')
      } else if (url.hostname === 'wordpress.com') {
        const name = 'WordPress (.com)'

        return name
      }
    } catch (error) {
      // console.log(error)
    }
    generator = generator.replace(
      /^(\w+)(.+)(-?v?\d{1,2}\.\d{1,2}\.\d{1,3})$/gm,
      '$1 $3'
    )
    return capitalize(generator)
  } else {
    return null
  }
}

export async function getSingleBlog(blogSlug, { includePosts = false } = {}) {
  const configs = await getAllConfigs()
  const config = configs.find((config) => config.id === blogSlug)
  let blog: BlogType = config

  try {
    blog = await extract(config.feedUrl, {
      useISODateFormat: true,
      getExtraFeedFields: (feedData) => {
        // console.log(feedData)
        // required properties from config
        const id = config.id
        const version = 'https://jsonfeed.org/version/1.1'
        const feedUrl = config.feedUrl
        const category = config.category
        // only display blog in preview unless dateIndexed is set
        const dateIndexed = config.dateIndexed
        const issn = config.issn
        const baseUrl = config.baseUrl
        const title = (
          config.title ||
          get(feedData, 'title.#text', null) ||
          get(feedData, 'title', null)
        ).trim()

        let homePageUrl = []
          .concat(get(feedData, 'link', null))
          .find((link) => get(link, '@_rel', null) === 'alternate')

        homePageUrl =
          config.homePageUrl ||
          get(homePageUrl, '@_href', null) ||
          get(feedData, 'id', null) ||
          get(feedData, 'link', null)

        if (baseUrl !== null && homePageUrl !== null) {
          homePageUrl = baseUrl + homePageUrl
        }
        let feedFormat = []
          .concat(get(feedData, 'link', null))
          .find((link) => get(link, '@_rel', null) === 'self')

        feedFormat =
          get(feedFormat, '@_type', null) ||
          get(feedData, '@_xmlns', null) === 'http://www.w3.org/2005/Atom'
            ? 'application/atom+xml'
            : null ||
              get(feedData, 'atom:link.@_type', null) ||
              'application/rss+xml'

        let generator = get(feedData, 'generator', null) || config.generator

        generator = parseGenerator(generator)

        let description =
          get(feedData, 'description.#text', null) ||
          get(feedData, 'description', null) ||
          get(feedData, 'subtitle.#text', null) ||
          get(feedData, 'subtitle', null) ||
          config.description

        description = isString(description) ? description.trim() : null

        let language =
          get(feedData, 'language', null) ||
          get(feedData, '@_xml:lang', null) ||
          config.language
        // normalize language to ISO 639-1, e.g. en-US -> en
        // en is the default language

        language = language ? language.split('-')[0] : 'en'

        let favicon = get(feedData, 'image.url', null) || config.favicon

        favicon =
          favicon !== 'https://s0.wp.com/i/buttonw-com.png' ? favicon : null

        const license =
          get(feedData, 'rights.#text', null) || config.hasLicense === false
            ? null
            : 'https://creativecommons.org/licenses/by/4.0/legalcode'
        const dateModified = toISODateString(
          get(feedData, 'pubDate', null) ||
            get(feedData, 'lastBuildDate', null) ||
            get(feedData, 'updated', null) ||
            get(feedData, 'modified', null) ||
            get(feedData, 'published', null) ||
            get(feedData, 'issued', null)
        )

        return {
          id,
          version,
          feedUrl,
          category,
          title,
          baseUrl,
          homePageUrl,
          feedFormat,
          generator,
          description,
          favicon,
          language,
          dateIndexed,
          dateModified,
          license,
          issn,
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
          get(feedEntry, 'id', null) ||
          get(feedEntry, 'guid', null)

        let url = get(feedEntry, 'link', null)

        if (isArray(url)) {
          url = url.find((link) => get(link, '@_rel', null) === 'alternate')
          url = get(url, '@_href', null)
        }
        if (isObject(url)) {
          url = get(url, '@_href', null)
        }
        console.log(url)

        const tags = []
          .concat(get(feedEntry, 'category', []))
          .map(
            (tag) => get(tag, '@_term', null) || get(tag, '#text', null) || tag
          )
          .slice(0, 5)
        const image =
          get(feedEntry, 'media:content.@_url', null) ||
          get(feedEntry, 'enclosure.@_url', null)
        const thumbnail = get(feedEntry, 'media:thumbnail.@_url', null)
        const datePublished = toISODateString(
          get(feedEntry, 'pubDate', null) || get(feedEntry, 'published', null)
        )
        const dateModified = toISODateString(get(feedEntry, 'updated', null))
        const contentHtml =
          get(feedEntry, 'content:encoded', null) ||
          get(feedEntry, 'content.#text', null) ||
          get(feedEntry, 'description', null)

        return {
          id,
          url,
          tags,
          authors,
          image,
          thumbnail,
          datePublished,
          dateModified,
          contentHtml,
        }
      },
    })
  } catch (error) {
    console.error(error)
  }

  if (includePosts) {
    blog.items = blog['entries']
      .map((entry) => {
        // validate post against JSON Schema
        // if (!validatePost(entry)) {
        //   for (const err of validatePost.errors as DefinedError[]) {
        //     switch (err.keyword) {
        //       case 'type':
        //         // err type is narrowed here to have "type" error params properties
        //         console.log(err.params.type)
        //         break
        //       // ...
        //     }
        //   }
        // }
        console.log(entry)
        // remove obsolete keys
        entry = omit(entry, ['link'])
        if (blog.baseUrl) {
          entry.id = blog.baseUrl + entry.id
          entry.url = blog.baseUrl + entry.url
        }
        // rename keys
        return mapKeys(entry, function (_, key) {
          return get(itemKeys, key, key)
        })
      })
      .slice(0, 15)
  }

  blog = omit(blog, ['entries', 'published', 'link', 'baseUrl'])

  // validate blog against JSON Schema
  // if (!validateBlog(blog)) {
  //   for (const err of validateBlog.errors as DefinedError[]) {
  //     switch (err.keyword) {
  //       case 'type':
  //         // err type is narrowed here to have "type" error params properties
  //         console.log(err.params.type)
  //         break
  //       // ...
  //     }
  //   }
  // }

  return blog
}

export default async function handler(req, res) {
  let blog = await getSingleBlog(req.query.slug, { includePosts: true })
  const host = req.headers.host
  const protocol = req.headers['x-forwarded-proto'] || 'http'

  blog.id = `${protocol}://${host}/${blog.id}`
  blog = mapKeys(blog, function (_, key) {
    return snakeCase(key)
  })
  if (blog.items) {
    blog.items = blog.items.map((post) => {
      // rename obsolete keys
      post = mapKeys(post, function (_, key) {
        return get(itemKeys, key, key)
      })
      // turn keys into snake_case
      return mapKeys(post, function (_, key) {
        return snakeCase(key)
      })
    })
  }
  blog = omit(blog, ['is_preview', 'feed_format'])

  res.status(200).json(blog)
}
