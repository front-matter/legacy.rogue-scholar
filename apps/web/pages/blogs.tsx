import Head from 'next/head'
import React from 'react'

import { Blogs } from '../components/Blogs'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { getAllBlogs } from './api/blogs'

export async function getStaticProps() {
  const blogs = await getAllBlogs()

  return {
    props: { blogs },
  }
}

type Props = {
  blogs: any
}

const BlogsPage: React.FunctionComponent<Props> = ({ blogs }) => {
  return (
    <>
      <Head>
        <meta name="og:title" content="Rogue Scholar - Blogs" />
      </Head>
      <Header />
      <Blogs blogs={blogs} />
      <Footer />
    </>
  )
}

export default BlogsPage
