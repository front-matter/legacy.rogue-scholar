import { uniq } from "lodash"
import Negotiator from "negotiator"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"

import { Posts } from "@/components/common/Posts"
import Layout from "@/components/layout/Layout"
import Pagination from "@/components/layout/Pagination"
import Search from "@/components/layout/Search"
import { typesense } from "@/lib/typesenseClient"
import { PaginationType, PostType } from "@/types/blog"
import { PostSearchParams, PostSearchResponse } from "@/types/typesense"

export async function getServerSideProps(ctx) {
  const negotiator = new Negotiator(ctx.req)
  const locales = ["en", "de", "es", "pt", "fr", "it"]
  let languages = negotiator.languages(locales)

  languages.push(ctx.locale)
  languages.push("en")
  languages = uniq(languages).toString()

  const page = parseInt(ctx.query.page || 1)
  const query = ctx.query.query || ""
  const tags = ctx.query.tags || ""
  let filterBy = `blog_id:!=[y3h0g22] && language:=[${languages}]`

  filterBy = tags ? filterBy + ` && tags:=[${tags}]` : filterBy
  const searchParameters: PostSearchParams = {
    q: query,
    query_by:
      "tags,title,authors.name,authors.url,summary,content_html,reference",
    filter_by: filterBy,
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
    base_url: "/posts",
    query: query,
    tags: tags,
    page: page,
    pages: pages,
    total: data.found,
    prev: page > 1 ? page - 1 : null,
    next: page < pages ? page + 1 : null,
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common", "home"])),
      posts,
      pagination,
    },
  }
}

type Props = {
  posts: PostType[]
  pagination: PaginationType
}

const PostsPage: React.FunctionComponent<Props> = ({ posts, pagination }) => {
  const { t } = useTranslation("common")

  return (
    <>
      <Layout>
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("posts.title")}
          </h2>
        </div>
        <Search />
        <Pagination pagination={pagination} />
        <Posts posts={posts} pagination={pagination} />
        {pagination.total > 0 && <Pagination pagination={pagination} />}
      </Layout>
    </>
  )
}

export default PostsPage
