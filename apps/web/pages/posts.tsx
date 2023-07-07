import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"

import { Posts } from "@/components/common/Posts"
import Layout from "@/components/layout/Layout"
import Pagination from "@/components/layout/Pagination"
import Search from "@/components/layout/Search"
import { getPagination } from "@/lib/helpers"
import { postsWithBlogSelect, supabase } from "@/lib/supabaseClient"
import { PaginationType, PostType } from "@/types/blog"

export async function getServerSideProps(ctx) {
  const page = parseInt(ctx.query.page || 1)
  const query = ctx.query.query || "doi.org"
  const language = ctx.locale
  const { from, to } = getPagination(page, 15)
  let { data: posts, count } = await supabase
    .from("posts")
    .select(postsWithBlogSelect, { count: "exact" })
    .textSearch("fts", query, {
      type: "plain",
      config: "english",
    })
    .in("language", [language, "en"])
    .order("date_published", { ascending: false })
    .range(from, to)

  count ??= 1000 // estimating total number of posts if error fetching count
  const pages = Math.ceil(count / 15)
  const pagination = {
    base_url: "/posts",
    query: ctx.query.query || "",
    page: page,
    pages: pages,
    total: count,
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
