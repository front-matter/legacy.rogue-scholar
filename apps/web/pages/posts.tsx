import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"

import { Posts } from "@/components/common/Posts"
import Layout from "@/components/layout/Layout"
import Pagination from "@/components/layout/Pagination"
import Search from "@/components/layout/Search"
import { typesense } from "@/lib/typesenseClient"
import { PaginationType, PostType } from "@/types/blog"
import { PostSearchResponse } from "@/types/typesense"

export async function getServerSideProps(ctx) {
  const page = parseInt(ctx.query.page || 1)
  const query = ctx.query.query || ""
  const searchParameters = {
    q: query,
    query_by:
      "tags,title,authors.name,authors.url,summary,content_html,reference",
    filter_by: "blog_id:!=[8epr274, gzqej46, y3h0g22, yzgx124]",
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
        <Posts posts={posts} />
        {pagination.total > 0 && <Pagination pagination={pagination} />}
      </Layout>
    </>
  )
}

export default PostsPage
