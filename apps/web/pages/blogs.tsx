import Head from 'next/head'
import React from 'react'
import useSWR from 'swr'

import { Blogs } from '../components/Blogs'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Loader } from '../components/Loader'

export default function BlogsPage() {
  const fetcher = (url) => fetch(url).then((res) => res.json())
  const { data } = useSWR('/api/blogs', fetcher)

  if (!data)
  return (
    <>
      <Header />
      <Loader />
      <Footer />
    </>
  )

  return (
    <>
      <Head>
        <meta name="og:title" content="Rogue Scholar - Blogs" />
      </Head>
      <Header />
      <Blogs blogs={data} />
      <Footer />
    </>
  )
}
