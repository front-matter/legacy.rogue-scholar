import Head from 'next/head'
import React from 'react'

// import { CallToAction } from '../components/CallToAction'
import { Faqs } from '../components/Faqs'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Pricing } from '../components/Pricing'
import { Stats } from '../components/Stats'
import { getAllBlogs } from './api/blogs'

const countBy = (arr, prop) =>
  arr.reduce(function (obj, v) {
    obj[v[prop]] = (obj[v[prop]] || 0) + 1
    return obj
  }, {})

const languages = {
  en: 'English',
  de: 'Deutsch',
}

export async function getStaticProps() {
  const blogs = await getAllBlogs()

  // await writeAllBlogs(blogs)

  return {
    props: { blogs },
  }
}

type Props = {
  blogs: any
}

const Home: React.FunctionComponent<Props> = ({ blogs }) => {
  // strip version from generator
  // add language labels
  blogs = blogs.map((blog) => {
    if (blog.generator) {
      blog.generator = blog.generator.split(' ')[0]
    } else {
      blog.generator = 'Unknown'
    }
    blog.language = languages[blog.language] || blog.language
    return blog
  })

  const categoriesObject = countBy(blogs, 'category')
  const categories = Object.keys(categoriesObject).map((key) => ({
    title: key,
    count: categoriesObject[key],
  }))
  const languagesObject = countBy(blogs, 'language')
  const languagesList = Object.keys(languagesObject).map((key) => ({
    title: key,
    count: languagesObject[key],
  }))
  const platformsObject = countBy(blogs, 'generator')
  const platforms = Object.keys(platformsObject).map((key) => ({
    title: key,
    count: platformsObject[key],
  }))

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
        <Stats
          categories={categories}
          languages={languagesList}
          platforms={platforms}
        />
      </main>
      <Footer />
    </>
  )
}

export default Home
