import { isEmpty } from "lodash"
import Head from "next/head"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"
import { jsonLdScriptProps } from "react-schemaorg"
import { Blog as BlogSchema } from "schema-dts"

import { Blog } from "@/components/common/Blog"
import { Posts } from "@/components/common/Posts"
import Layout from "@/components/layout/Layout"
import Pagination from "@/components/layout/Pagination"
import Search from "@/components/layout/Search"
import { blogWithPostsSelect, postsWithBlogSelect, supabase } from "@/lib/supabaseClient"
import { BlogType, PaginationType, PostType } from "@/types/blog"

export async function getServerSideProps(ctx) {
  const page = parseInt(ctx.query.page || 1)
  const query = ctx.query.query || ""
  const tags = ctx.query.tags || ""
  const slug = ctx.params.slug
  const language = ctx.query.language || ""
  const category = ctx.query.category || ""

  let status = ["pending", "approved", "active", "archived"]
  let filterBy = `blog_slug:=${ctx.params.slug}`

  filterBy = !isEmpty(tags) ? filterBy + ` && tags:=[${tags}]` : filterBy
  filterBy = !isEmpty(language)
    ? filterBy + ` && language:[${language}]`
    : filterBy
  filterBy = !isEmpty(category)
    ? filterBy + ` && category:[${category}]`
    : filterBy

  const { data: blog } = await supabase
    .from("blogs")
    .select(blogWithPostsSelect)
    .in("status", status)
    .eq("slug", ctx.params.slug)
    .maybeSingle()

  if (!blog) {
    return {
      notFound: true,
    }
  }

  // from https://github.com/orgs/supabase/discussions/787
  const filters: any = []
  if (query) {
    filters.push(['ilike', 'title', `%${query}%`])
  }
  if (category) {
    filters.push(['eq', 'category', category])
  }
  if (language) {
    filters.push((['eq', 'language', language]))
  }

  let begin = page && page > 0 ? page : 1
  begin = (begin -1) * 10
  const end = begin + 10
  const { data: posts, error, count } = await filters
        .reduce(
            (acc, [filter, ...args]) => {
                return acc[filter](...args)
            },
            supabase
                .from('posts')
                .select(postsWithBlogSelect, { count: "exact" })
                .in("status", status)
                .eq("blog_slug", slug)
                .range(begin, end)
                .order('published_at', { ascending: false })
        )

  if (error) {
    console.error(error)
  }

  if (!posts) {
    return {
      notFound: true,
    }
  }
  const pages = Math.ceil(count || 0 / 10)
  const pagination = {
    base_url: "/blogs/" + slug,
    query: query,
    language: language,
    page: page,
    pages: pages,
    total: count || 0,
    prev: page > 1 ? page - 1 : null,
    next: page < pages ? page + 1 : null,
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common", "app"])),
      blog,
      posts,
      pagination,
      locale: ctx.locale,
    },
  }
}

type Props = {
  blog: BlogType
  posts: PostType[]
  pagination: PaginationType
  locale: string
}

const BlogPage: React.FunctionComponent<Props> = ({
  blog,
  posts,
  pagination,
  locale,
}) => {
  const { t } = useTranslation(["common"])

  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta property="og:site_name" content="Rogue Scholar" />
        <meta property="og:title" content={"Rogue Scholar: " + blog.title} />
        <meta
          property="og:description"
          content={"Rogue Scholar: " + blog.description}
        />
        <meta
          property="og:url"
          content={"https://legacy.rogue-scholar.org/" + blog.slug}
        />
        {blog.favicon && <meta property="og:image" content={blog.favicon} />}
        <link
          rel="alternate"
          title={blog.title}
          type="application/feed+json"
          href={"https://legacy.rogue-scholar.org/" + blog.slug + ".json"}
        />
        <script
          type="application/ld+json"
          {...jsonLdScriptProps<BlogSchema>({
            "@context": "https://schema.org",
            "@type": "Blog",
            url: `https://legacy.rogue-scholar.org/${blog.slug}`,
            name: `${blog.title}`,
            description: `${blog.description}`,
            inLanguage: `${blog.language}`,
            license: "https://creativecommons.org/licenses/by/4.0/legalcode",
          })}
        />
      </Head>
      <Layout>
        <div className="bg-white dark:bg-slate-800">
          <Blog blog={blog} />
          <Search pagination={pagination} locale={locale} />
          <Pagination pagination={pagination} />
          {posts && <Posts posts={posts} pagination={pagination} blog={blog} />}
          {pagination.total > 0 && <Pagination pagination={pagination} />}
        </div>
      </Layout>
    </>
  )
}

export default BlogPage
