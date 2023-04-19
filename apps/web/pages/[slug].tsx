import { omit } from 'lodash'
import { GetStaticPaths } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getAllConfigs } from 'pages/api/blogs'
import { BlogType, getSingleBlog, PostType } from 'pages/api/blogs/[slug]'
import React from 'react'
import { jsonLdScriptProps } from 'react-schemaorg'
import { Blog as BlogSchema } from 'schema-dts'

import { Blog } from '../components/Blog'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Posts } from '../components/Posts'

export const getStaticPaths: GetStaticPaths = async () => {
  const configs = await getAllConfigs()
  const paths = configs.map((config) => ({
    params: { slug: config.id },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const blog = await getSingleBlog(params.slug, { includePosts: true })

  return {
    props: { blog: omit(blog, ['posts']), posts: blog.items },
  }
}

type Props = {
  blog: BlogType
  posts: PostType[]
}

const BlogPage: React.FunctionComponent<Props> = ({ blog, posts }) => {
  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta property="og:site_name" content="Rogue Scholar" />
        <meta property="og:title" content={'Rogue Scholar: ' + blog.title} />
        <meta
          property="og:description"
          content={'Rogue Scholar: ' + blog.description}
        />
        <meta
          property="og:url"
          content={'https://rogue-scholar.org/' + blog.id}
        />
        {blog.favicon && <meta property="og:image" content={blog.favicon} />}
        <link
          rel="alternate"
          title={blog.title}
          type="application/feed+json"
          href={'https://rogue-scholar.org/' + blog.id + '.json'}
        />
        <script
          type="application/ld+json"
          {...jsonLdScriptProps<BlogSchema>({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            url: `https://rogue-scholar.org/${blog.id}`,
            name: `${blog.title}`,
            description: `${blog.description}`,
            inLanguage: `${blog.language}`,
            license: 'https://creativecommons.org/licenses/by/4.0/legalcode',
          })}
        />
      </Head>
      <Header />
      <div className={blog.dateIndexed ? 'bg-white' : 'bg-blue-50'}>
        <Blog blog={blog} />
        <Posts posts={posts} />
        {blog.homePageUrl && (
          <div className="mx-auto max-w-2xl bg-inherit pb-2 lg:max-w-4xl">
            <div className="my-5 lg:my-8">
              <Link
                href={blog.homePageUrl}
                target="_blank"
                className="text-xl font-semibold text-gray-700 hover:text-gray-400 sm:text-xl"
              >
                More posts via the {blog.title} Home Page …
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default BlogPage
