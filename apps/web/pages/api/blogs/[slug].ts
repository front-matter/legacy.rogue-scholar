import { extract, FeedData } from '@extractus/feed-extractor'
import { capitalize, get, isObject, mapKeys, omit, snakeCase } from 'lodash'

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
  feedFormat?: string
  icon?: string
  favicon?: string
  published?: Date
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

// const idAsSlug = (id: string) => {
//   return id.replace(/https?:\/\/doi\.org\//, '').replace(/\//g, '-')
// }

// export async function writeSingleBlog(blogSlug) {
//   // create blog directory if it doesn't exist
//   const folderPath = path.resolve(process.cwd(), `public/${blogSlug}`)

//   if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath)
//   }

//   let blog = await getSingleBlog(blogSlug, { includePosts: true })

//   // reformat feed into JSON Feed format
//   blog['version'] = 'https://jsonfeed.org/version/1.1'

//   // filter entries to only include DOIs
//   // blog['items'] = blog.entries.filter((blog) => {
//   //   return isDoi(blog.id)
//   // })
//   // .map((post) => {
//   //   const postId = idAsSlug(post.id)
//   //   const postPath = path.resolve(
//   //     process.cwd(),
//   //     `public/${blog.id}/${postId}.json`
//   //   )

//   //   fs.writeFileSync(postPath, JSON.stringify(post))
//   // })

//   blog = pick(blog, [
//     'version',
//     'id',
//     'title',
//     'description',
//     'language',
//     'license',
//     'category',
//     'homePageUrl',
//     'feedUrl',
//     'feedFormat',
//     'published',
//     'favicon',
//     'generator',
//     'items',
//   ])
//   blog = mapKeys(blog, function (_, key) {
//     return snakeCase(key)
//   })

//   const blogPath = path.resolve(process.cwd(), `public/${blog.id}.json`)

//   fs.writeFileSync(blogPath, JSON.stringify(blog))
// }

export async function getSingleBlog(blogSlug, { includePosts = false } = {}) {
  const configs = await getAllConfigs()
  const config = configs.find((config) => config.id === blogSlug)
  let blog: BlogType = config

  try {
    blog = await extract(config.feedUrl, {
      useISODateFormat: true,
      getExtraFeedFields: (feedData) => {
        // console.log(feedData)
        const id = config.id
        const feedUrl = config.feedUrl
        let homePageUrl = []
          .concat(get(feedData, 'link', null))
          .find((link) => get(link, '@_rel', null) === 'alternate')

        homePageUrl =
          config.homePageUrl ||
          get(homePageUrl, '@_href', null) ||
          get(feedData, 'link', null)
        let feedFormat = []
          .concat(get(feedData, 'link', null))
          .find((link) => get(link, '@_rel', null) === 'self')

        feedFormat =
          get(feedFormat, '@_type', null) ||
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
          get(feedData, 'rights.#text', null) || config.license === false
            ? null
            : 'https://creativecommons.org/licenses/by/4.0/legalcode'
        const category = config.category
        const preview = config.preview
        const published =
          get(feedData, 'pubDate', null) ||
          get(feedData, 'lastBuildDate', null) ||
          get(feedData, 'updated', null) ||
          get(feedData, 'modified', null) ||
          get(feedData, 'published', null) ||
          get(feedData, 'issued', null)

        return {
          id,
          feedUrl,
          homePageUrl,
          feedFormat,
          generator,
          description,
          favicon,
          language,
          published,
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
    blog.items = blog['entries'].map((entry) => {
      return mapKeys(entry, function (_, key) {
        return snakeCase(key)
      })
    })
  }

  blog = omit(blog, ['entries'])

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
  blog = omit(blog, ['preview', 'feed_format'])

  res.status(200).json(blog)
}
