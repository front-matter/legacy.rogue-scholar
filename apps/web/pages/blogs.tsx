import { readFileSync } from 'fs'
import * as jsonify from 'jsonify-that-feed'
import Head from 'next/head'
import path from 'path'
import React from 'react'

import { Blogs } from '../components/Blogs'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

export async function getStaticProps() {
  const data = readFileSync(
    path.resolve(process.cwd(), 'public/rogue-scholar.opml'),
    { encoding: 'utf8', flag: 'r' }
  )
  const blogs = jsonify.opmlToJson(data).body.outline

  if (!blogs) {
    return {
      props: { notFound: true },
    }
  }

  return {
    props: { blogs },
  }
}

export default function BlogsPage({ blogs }) {
  return (
    <>
      <Head>
        <meta name="og:title" content="Upstream" />
        <meta
          name="og:description"
          content="Upstream is a new space for open enthusiasts to discuss open approaches to scholarly communication."
        />
        <meta
          name="og:image"
          content="https://upstream.force11.org/img/hero.jpg"
        />
      </Head>
      <Header />
      <Blogs blogs={blogs} />
      <Footer />
    </>
  )
}
