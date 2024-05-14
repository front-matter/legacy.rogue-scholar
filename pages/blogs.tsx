import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"

import { Blogs } from "@/components/common/Blogs"
import { Comments } from "@/components/common/Comments"
import Layout from "@/components/layout/Layout"
import Pagination from "@/components/layout/Pagination"
import Search from "@/components/layout/Search"
import { BlogType, PaginationType } from "@/types/blog"
import { blogsSelect, supabase } from "@/lib/supabaseClient"

export async function getServerSideProps(ctx) {
  const page = parseInt(ctx.query.page || 1)
  const query = ctx.query.query || ""
  const category = ctx.query.category || ""
  const generator = ctx.query.generator || ""
  const language = ctx.query.language || ""

  let status = ["approved", "active", "archived"]
  if (process.env.VERCEL_ENV !== "production") {
    status = ["pending", "approved", "active", "archived"]
  }

  const filters: any = []
  if (query) {
    filters.push(['ilike', 'title', `%${query}%`])
  }
  if (category) {
    filters.push(['eq', 'category', category])
  }
  if (generator) {
    filters.push(['eq', 'generator', generator])
  }
  if (language) {
    filters.push((['eq', 'language', language]))
  }

  let begin = page && page > 0 ? page : 1
  begin = (begin -1) * 10
  const end = begin + 10
  const { data: blogs, error, count } = await filters
        .reduce(
            (acc, [filter, ...args]) => {
                return acc[filter](...args)
            },
            supabase
                .from('blogs')
                .select(blogsSelect, { count: "exact" })
                .in("status", status)
                .range(begin, end)
                .order('created_at', { ascending: false })
        )

  if (error) {
    console.error(error)
  }

  if (!blogs) {
    return {
      notFound: true,
    }
  }
  const pages = Math.ceil(count || 0 / 10)
  const pagination = {
    base_url: "/blogs",
    query: query,
    language: language,
    category: category,
    generator: generator,
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
      blogs,
      pagination,
      locale: ctx.locale,
    },
  }
}

type Props = {
  blogs: BlogType[]
  pagination: PaginationType
  locale: string
}

const BlogsPage: React.FunctionComponent<Props> = ({
  blogs,
  pagination,
  locale,
}) => {
  const { t } = useTranslation("common")

  return (
    <>
      <Layout>
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("posts.blogs")}
          </h2>
        </div>
        <Search pagination={pagination} locale={locale} />
        <Pagination pagination={pagination} />
        <Blogs blogs={blogs} pagination={pagination} />
        {pagination.total > 0 && <Pagination pagination={pagination} />}
        <div className="mx-auto max-w-2xl pb-5 lg:max-w-4xl">
          <Comments locale={locale} />
        </div>
      </Layout>
    </>
  )
}

export default BlogsPage
