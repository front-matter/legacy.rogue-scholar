import fs from 'fs'
import * as hcl from 'hcl2-parser'
import { omit } from 'lodash'
import { GetStaticPaths } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import path from 'path'
import React from 'react'

import { Blog } from '../../components/Blog'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { Posts } from '../../components/Posts'

export const getStaticPaths: GetStaticPaths = async () => {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || 'development'
  const filePath = path.resolve('rogue-scholar.hcl')
  const hclString = fs.readFileSync(filePath)
  const json = hcl.parseToObject(hclString)[0].blog.filter((blog) => {
    return env != 'production' || blog.environment != 'preview'
  })
  const paths = json.map((blog) => ({
    params: { slug: blog.id },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const protocol = process.env.NEXT_PUBLIC_VERCEL_URL ? 'https' : 'http'
  const domain = process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000'
  const id = params.slug
  const res = await fetch(`${protocol}://${domain}/api/blogs/${id}`).then(
    (res) => res.json()
  )
  const blog = omit(res, ['entries'])
  const posts = res.entries

  return {
    props: { blog, posts },
  }
}

type Props = {
  blog: any
  posts: any
}

const BlogPage: React.FunctionComponent<Props> = ({ blog, posts }) => {
  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="og:title" content="Rogue Scholar - {data.title}" />
      </Head>
      <Header />
      <Blog blog={blog} />
      <Posts posts={posts} />
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <div className="my-5 lg:my-8">
          <Link
            href={blog.homePageUrl}
            target="_blank"
            className="mb-3 text-xl font-semibold text-gray-700 hover:text-gray-400 sm:text-xl"
          >
            More posts via the {blog.title} Home Page …
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default BlogPage
