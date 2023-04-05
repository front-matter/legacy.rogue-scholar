import { extract } from '@extractus/feed-extractor'
import { get } from 'lodash'
import absoluteUrl from 'next-absolute-url'

export default async function handler(req, res) {
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

  const presence = (str: string) => {
    if (str == null || str.trim() === '') {
      return null
    } else {
      return str
    }
  }

  const { origin } = absoluteUrl(req)
  const apiURL = `${origin}/api/blogs`
  const blogs = await fetch(apiURL).then((res) => res.json())
  const blog = blogs.find((blog) => blog.id === req.query.slug)
  const feed = await extract(blog.feed_url, {
    useISODateFormat: true,
    getExtraFeedFields: (feedData) => {
      const feedUrl = blog.feed_url
      let homePageUrl = []
        .concat(get(feedData, 'link', null))
        .find((link) => get(link, '@_rel', null) === 'alternate')

      homePageUrl =
        get(homePageUrl, '@_href', null) || get(feedData, 'link', null)
      const generator =
        get(feedData, 'generator.#text', null) ||
        get(feedData, 'generator', null)
      const description = presence(
        get(feedData, 'description.#text', null) ||
          get(feedData, 'description', null) ||
          get(feedData, 'subtitle.#text', null) ||
          get(feedData, 'subtitle', null) ||
          blog.description
      )
      const language = presence(
        get(feedData, 'language', null) || blog.language
      )
      const favicon = get(feedData, 'image.url', null) || blog.favicon
      const license = get(feedData, 'rights.#text', null) || blog.license
      const category = blog.category

      return {
        feedUrl,
        homePageUrl,
        generator,
        description,
        favicon,
        language,
        license,
        category,
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
        get(feedEntry, 'content.#text', null)

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

  res.status(200).json(feed)
}
