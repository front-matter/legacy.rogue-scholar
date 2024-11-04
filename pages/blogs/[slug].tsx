import { isEmpty } from "lodash"
import Head from "next/head"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"
import { jsonLdScriptProps } from "react-schemaorg"
import { Blog as BlogSchema } from "schema-dts"

import { Blog } from "@/components/common/Blog"
import { Comments } from "@/components/common/Comments"
import { Posts } from "@/components/common/Posts"
import Layout from "@/components/layout/Layout"
import Pagination from "@/components/layout/Pagination"
import Search from "@/components/layout/Search"
import { blogWithPostsSelect, supabase } from "@/lib/supabaseClient"
import { typesense } from "@/lib/typesenseClient"
import { BlogType, PaginationType, PostType } from "@/types/blog"
import { PostSearchParams, PostSearchResponse } from "@/types/typesense"

export async function getServerSideProps(ctx) {
  const page = parseInt(ctx.query.page || 1)
  const query = ctx.query.query || ""
  const tags = ctx.query.tags || ""
  const language = ctx.query.language || ""
  const category = ctx.query.category || ""

  let status = ["approved", "active", "archived"]
  if (process.env.VERCEL_ENV !== "production") {
    status = ["pending", "approved", "active", "archived"]
  }
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

  const searchParameters: PostSearchParams = {
    q: query,
    filter_by: filterBy,
    query_by:
      "tags,title,authors.name,authors.url,reference.url,summary,content_text",
    sort_by: ctx.query.query ? "_text_match:desc" : "published_at:desc",
    per_page: 10,
    page: page && page > 0 ? page : 1,
  }
  const data: PostSearchResponse = await typesense
    .collections("posts")
    .documents()
    .search(searchParameters)
  const posts = data.hits?.map((hit) => hit.document)
  const pages = Math.ceil(data.found / 10)
  const pagination = {
    base_url: "/blogs/" + ctx.params.slug,
    query: query,
    language: language,
    category: category,
    generator: "",
    tags: tags,
    page: page,
    pages: pages,
    total: data.found,
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
        <div className="mx-auto max-w-2xl pb-5 lg:max-w-4xl">
          <Comments locale={locale} />
        </div>
      </Layout>
    </>
  )
}

export default BlogPage
