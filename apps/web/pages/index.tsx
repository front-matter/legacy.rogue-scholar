import Head from 'next/head'
import React from 'react'

import { CallToAction } from '../components/CallToAction'
import { Faqs } from '../components/Faqs'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Pricing } from '../components/Pricing'
import { PrimaryFeatures } from '../components/PrimaryFeatures'
// import { SecondaryFeatures } from '../components/SecondaryFeatures'
// import { Testimonials } from '../components/Testimonials'

export default function Home() {
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
        <Hero />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
