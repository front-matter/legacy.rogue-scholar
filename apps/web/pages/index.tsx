import Head from 'next/head'
import React from 'react'

// import { CallToAction } from '../components/CallToAction'
import { Faqs } from '../components/Faqs'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Pricing } from '../components/Pricing'
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

const Home: React.FunctionComponent<Props> = ({ blogs }) => {
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
        <Hero blogs={blogs} />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}

export default Home
