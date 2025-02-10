import { isEmpty } from "lodash"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"

import { Comments } from "@/components/common/Comments"
import { Posts } from "@/components/common/Posts"
import Layout from "@/components/layout/Layout"
import Pagination from "@/components/layout/Pagination"
import Search from "@/components/layout/Search"
import { PaginationType, PostType } from "@/types/blog"
import { postsWithBlogSelect, supabase } from "@/lib/supabaseClient"

export async function getServerSideProps(ctx) {
  const page = parseInt(ctx.query.page || 1)
  const query = ctx.query.query || ""
  const category = ctx.query.category || ""
  const language = ctx.query.language || ""

  let status = ["approved", "active", "archived", "expired"]
  if (process.env.VERCEL_ENV !== "production") {
    status = ["pending", "approved", "active", "archived", "expired"]
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
    base_url: "/posts",
    query: query,
    language: language,
    category: category,
    tags: "",
    page: page,
    pages: pages,
    total: count || 0,
    prev: page > 1 ? page - 1 : null,
    next: page < pages ? page + 1 : null,
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common", "app"])),
      posts,
      pagination,
      locale: ctx.locale,
    },
  }
}

type Props = {
  posts: PostType[]
  pagination: PaginationType
  locale: string
}

const PostsPage: React.FunctionComponent<Props> = ({
  posts,
  pagination,
  locale,
}) => {
  const { t } = useTranslation("common")

  return (
    <>
      <Layout>
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("posts.title")}
          </h2>
        </div>
        <Search pagination={pagination} locale={locale} />
        <Pagination pagination={pagination} />
        <Posts posts={posts} pagination={pagination} />
        {pagination.total > 0 && <Pagination pagination={pagination} />}
        <div className="mx-auto max-w-2xl pb-5 lg:max-w-4xl">
          <Comments locale={locale} />
        </div>
      </Layout>
    </>
  )
}

export default PostsPage
