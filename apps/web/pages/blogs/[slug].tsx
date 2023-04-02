import { extract } from '@extractus/feed-extractor'
import { faOrcid } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HomeIcon, RssIcon } from '@heroicons/react/20/solid'
import { readFileSync } from 'fs'
import * as hcl from 'hcl2-parser'
import parse from 'html-react-parser'
import { get, omit } from 'lodash'
import { GetStaticPaths } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import path from 'path'
import React from 'react'

import { languages } from '../../components/Blogs'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'

export const getStaticPaths: GetStaticPaths = async () => {
  // read HCL file and parse the JSON to get the blog object.
  const hclString = readFileSync(
    path.resolve(process.cwd(), 'rogue-scholar.hcl'),
    { encoding: 'utf8', flag: 'r' }
  )
  const hclObject = hcl.parseToObject(hclString)[0].blog
  const blogs = Object.values(hclObject).map((blog) => {
    return blog[0]
  })
  const paths = blogs.map((blog) => ({
    params: { slug: blog.id },
  }))

  return { paths, fallback: true }
}

export async function getStaticProps(context) {
  const id = context.params.slug

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

  // read HCL file and parse the JSON to get the blog object.
  const hclString = readFileSync(
    path.resolve(process.cwd(), 'rogue-scholar.hcl'),
    { encoding: 'utf8', flag: 'r' }
  )
  const hclObject = hcl.parseToObject(hclString)[0].blog
  const blogs = Object.values(hclObject).map((blog) => {
    return blog[0]
  })
  const blog = blogs.find((blog) => blog.id === id)

  const feed = await extract(blog.feed_url, {
    descriptionMaxLen: 210,
    useISODateFormat: true,
    getExtraEntryFields: (feedEntry) => {
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
      const link =
        get(feedEntry, 'link.@_href', null) ||
        get(feedEntry, 'link', null) ||
        id
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
      const image = get(feedEntry, 'media:content.@_url', null)
      const datePublished =
        get(feedEntry, 'pubDate', null) ||
        get(feedEntry, 'published', null) ||
        get(feedEntry, 'date_published', null)
      const dateModified = get(feedEntry, 'updated', null)
      const contentHtml =
        get(feedEntry, 'content:encoded', null) ||
        get(feedEntry, 'content.#text', null)

      return {
        id: id,
        link: link,
        isPermalink: Boolean(isPermalink),
        tags: tags,
        authors: authors,
        image: image,
        datePublished: datePublished,
        dateModified: dateModified,
        contentHtml: contentHtml,
      }
    },
  })
  const feedEntries = feed.entries.map((item) => {
    return omit(item, ['published'])
  })

  if (!blog) {
    return {
      props: { notFound: true },
    }
  }

  return {
    props: { blog, posts: feedEntries },
  }
}

export default function Blog({ blog, posts }) {
  // const platforms = {
  //   word_press: 'https://wordpress.org/',
  //   hugo: 'https://gohugo.io/',
  //   ghost: 'https://ghost.org/',
  //   medium: 'https://medium.com/',
  //   blogger: 'https://blogger.com/',
  //   micro_blog: 'https://micro.blog/',
  // }

  type Props = {
    name: string
    url?: string
    isLast?: boolean
  }

  const Author: React.FunctionComponent<Props> = ({ name, url, isLast }) => {
    return (
      <>
        {url ? (
          <span>
            <Link href={url} className="text-gray-500">
              <FontAwesomeIcon icon={faOrcid} /> {name}
            </Link>
            {isLast ? '' : ', '}
          </span>
        ) : (
          <span className="text-gray-500">
            {name}
            {isLast ? '' : ', '}
          </span>
        )}
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{blog.name}</title>
      </Head>
      <Header />
      <div className="bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <span className="inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              {blog.category}
            </span>
            <span className="ml-1 inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              {languages[blog.language]}
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {blog.title}
            </h2>

            {blog.description && (
              <p className="mt-2 text-lg leading-8 text-gray-600">
                {parse(String(blog.description))}
              </p>
            )}
            <div className="-mt-px flex">
              <div className="flex w-0 flex-1">
                <Link
                  href={blog.home_page_url}
                  target="_blank"
                  className="relative -mr-px inline-flex w-0 basis-1/3 gap-x-3 py-4 text-sm font-medium text-gray-500"
                >
                  <HomeIcon
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  Home Page
                </Link>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <Link
                  href={blog.feed_url}
                  target="_blank"
                  className="relative inline-flex w-0 basis-1/3 gap-x-3 py-4 text-sm font-medium text-gray-500"
                >
                  <RssIcon
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  RSS Feed
                </Link>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <div className="space-t-10 lg:space-t-10 mt-10 lg:mt-12">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="relative mb-8 flex gap-8 lg:flex-row"
                >
                  {post.image && (
                    <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                      <img
                        src={post.image}
                        alt=""
                        className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                      />
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  )}
                  <div>
                    {post.tags && (
                      <div className="flex items-center gap-x-1 text-xs">
                        {[].concat(post.tags).map((tag) => (
                          <span
                            key={tag}
                            className="relative z-10 ml-0 rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="group relative max-w-3xl">
                      <h3 className="mt-2 text-xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <Link href={post.isPermalink ? post.id : post.link}>
                          {post.title}
                        </Link>
                      </h3>
                      <div className="text-small mt-1 flex items-center gap-x-1 text-gray-500">
                        <time dateTime={post.datePublished}>
                          {new Date(post.datePublished).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </time>
                        {post.id && post.isPermalink && (
                          <span>
                            •{' '}
                            <Link href={post.id} target="_blank">
                              {post.id}
                            </Link>
                          </span>
                        )}
                      </div>
                      <span>
                        {post.authors.map((author, index) => (
                          <Author
                            key={author.name}
                            name={author.name}
                            url={author.url}
                            isLast={index === post.authors.length - 1}
                          />
                        ))}
                      </span>
                      {post.description && (
                        <p className="text-medium mt-2 leading-6 text-gray-900">
                          {parse(String(post.description))}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
              <Link
                href={blog.home_page_url}
                target="_blank"
                className="mb-3 text-xl font-semibold text-gray-700 hover:text-gray-400 sm:text-xl"
              >
                More posts via the {blog.title} Home Page …
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
