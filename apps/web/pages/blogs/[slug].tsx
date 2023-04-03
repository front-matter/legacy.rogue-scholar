import fs from 'fs'
import * as hcl from 'hcl2-parser'
import { omit } from 'lodash'
import { GetStaticPaths } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import path from 'path'
import React from 'react'
import useSWR from 'swr'

import { Blog } from '../../components/Blog'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { Loader } from '../../components/Loader'
import { Posts } from '../../components/Posts'

export const getStaticPaths: GetStaticPaths = async () => {
  const filePath = path.resolve('rogue-scholar.hcl')
  const hclString = fs.readFileSync(filePath)
  const json = hcl.parseToObject(hclString)[0].blog
  const paths = json.map((blog) => ({
    params: { slug: blog.id },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const id = params.slug

  return {
    props: { id },
  }
}

type Props = {
  id: string
}

const BlogPage: React.FunctionComponent<Props> = ({ id }) => {
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data } = useSWR(`/api/blogs/${id}`, fetcher)

  if (!data)
    return (
      <>
        <Header />
        <Loader />
        <Footer />
      </>
    )

  const blog = omit(data, ['entries'])
  const posts = data.entries

  return (
    <>
      <Head>
        <title>{data.title}</title>
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
