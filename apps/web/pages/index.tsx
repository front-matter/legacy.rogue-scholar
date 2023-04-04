import Head from 'next/head'
import React from 'react'
import useSWR from 'swr'

// import { CallToAction } from '../components/CallToAction'
import { Faqs } from '../components/Faqs'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Loader } from '../components/Loader'
import { Pricing } from '../components/Pricing'

export default function Home() {
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
        <title>Rogue Scholar - Science blogging on steroids.</title>
        <meta
          name="description"
          content="The Rogue Scholar improves your science blog in important ways, including full-text search, DOIs and metadata, and long-term archiving."
        />
      </Head>
      <Header />
      <main>
        <Hero blogs={data} />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
