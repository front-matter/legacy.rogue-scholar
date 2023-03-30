import { readFileSync } from 'fs'
import * as hcl from 'hcl2-parser'
// import * as jsonify from 'jsonify-that-feed'
import Head from 'next/head'
import path from 'path'
import React from 'react'

import { Blogs } from '../components/Blogs'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

export async function getStaticProps() {
  // read HCL file and reformat the JSON. Sort blogs by name.
  const hclString = readFileSync(
    path.resolve(process.cwd(), 'rogue-scholar.hcl'),
    { encoding: 'utf8', flag: 'r' }
  )
  const hclObject = hcl.parseToObject(hclString)[0].blog
  const blogs = Object.values(hclObject)
    .map((blog) => {
      return blog[0]
    })
    .sort((a, b) => {
      return a.name - b.name
    })

  // generate OPML file
  // const opml = jsonify.jsonToOpml(blogs)

  // writeFile('rogue-scholar.opml', opml, (err) => {
  //   if (err) throw err
  // })

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
