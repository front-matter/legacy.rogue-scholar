import Head from "next/head"
import Link from "next/link"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"
import { jsonLdScriptProps } from "react-schemaorg"
import { Blog as BlogSchema } from "schema-dts"

import { Blog } from "@/components/common/Blog"
import { Posts } from "@/components/common/Posts"
import Layout from "@/components/layout/Layout"
import Pagination from "@/components/layout/Pagination"
import Search from "@/components/layout/Search"
import { blogWithPostsSelect, supabase } from "@/lib/supabaseClient"
import { typesense } from "@/lib/typesenseClient"
import { BlogType, PaginationType, PostType } from "@/types/blog"
import { PostSearchResponse } from "@/types/typesense"

export async function getServerSideProps(ctx) {
  const query = ctx.query.query || ""
  const page = parseInt(ctx.query.page || 1)
  const { data: blog } = await supabase
    .from("blogs")
    .select(blogWithPostsSelect)
    .eq("id", ctx.params.slug)
    .single()
  const searchParameters = {
    q: query,
    filter_by: `blog_id:=${ctx.params.slug}`,
    query_by:
      "tags,title,authors.name,authors.url,summary,content_html,reference",
    sort_by: ctx.query.query ? "_text_match:desc" : "published_at:desc",
    per_page: 15,
    page: page && page > 0 ? page : 1,
  }
  const data: PostSearchResponse = await typesense
    .collections("posts")
    .documents()
    .search(searchParameters)
  const posts = data.hits?.map((hit) => hit.document)
  const pages = Math.ceil(data.found / 15)
  const pagination = {
    base_url: "/blogs/" + ctx.params.slug,
    query: query,
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
    },
  }
}

type Props = {
  blog: BlogType
  posts: PostType[]
  pagination: PaginationType
}

const BlogPage: React.FunctionComponent<Props> = ({
  blog,
  posts,
  pagination,
}) => {
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
          content={"https://rogue-scholar.org/" + blog.id}
        />
        {blog.favicon && <meta property="og:image" content={blog.favicon} />}
        <link
          rel="alternate"
          title={blog.title}
          type="application/feed+json"
          href={"https://rogue-scholar.org/" + blog.id + ".json"}
        />
        <script
          type="application/ld+json"
          {...jsonLdScriptProps<BlogSchema>({
            "@context": "https://schema.org",
            "@type": "Blog",
            url: `https://rogue-scholar.org/${blog.id}`,
            name: `${blog.title}`,
            description: `${blog.description}`,
            inLanguage: `${blog.language}`,
            license: "https://creativecommons.org/licenses/by/4.0/legalcode",
          })}
        />
      </Head>
      <Layout>
        <div className={blog.indexed_at ? "bg-white" : "bg-blue-50"}>
          <Blog blog={blog} />
          {!blog.expired && (
            <>
              <Search />
              <Pagination pagination={pagination} />
              {posts && <Posts posts={posts} blog={blog} />}
              {pagination.total > 0 && <Pagination pagination={pagination} />}
              {blog.home_page_url && blog.backlog && (
                <div className="mx-auto max-w-2xl bg-inherit pb-2 lg:max-w-4xl">
                  <div className="mb-2 lg:mb-5">
                    <Link
                      href={blog.home_page_url}
                      target="_blank"
                      className="text-base font-semibold text-gray-700 hover:text-gray-400 sm:text-xl"
                    >
                      More posts via the {blog.title} Home Page …
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
          {blog.expired && (
            <div className="mx-auto max-w-2xl bg-inherit pb-2 text-lg font-medium text-orange-600 lg:max-w-4xl">
              DOIs and metadata for posts from this blog could not be
              registered.
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}

export default BlogPage
