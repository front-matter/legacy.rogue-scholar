import { isEmpty } from "lodash"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"

import { Blogs } from "@/components/common/Blogs"
import Layout from "@/components/layout/Layout"
import Pagination from "@/components/layout/Pagination"
import Search from "@/components/layout/Search"
import { typesense } from "@/lib/typesenseClient"
import { BlogType, PaginationType } from "@/types/blog"
import { BlogSearchParams, BlogSearchResponse } from "@/types/typesense"

export async function getServerSideProps(ctx) {
  const page = parseInt(ctx.query.page || 1)
  const query = ctx.query.query || ""
  const category = ctx.query.category || ""
  const generator = ctx.query.generator || ""
  const language = ctx.query.language || ""

  // if (language && language !== ctx.locale) {
  //   language = null
  // }
  let filterBy = `status:!=[submitted]`

  filterBy = !isEmpty(category)
    ? filterBy + ` && category:=[${category}]`
    : filterBy
  filterBy = !isEmpty(generator)
    ? filterBy + ` && generator:=[${generator}]`
    : filterBy
  filterBy = !isEmpty(language)
    ? filterBy + ` && language:[${language}]`
    : filterBy

  const searchParameters: BlogSearchParams = {
    q: query,
    query_by:
      "issn,slug,title,description,category,language,generator,prefix,funding",
    filter_by: filterBy,
    sort_by: ctx.query.query ? "_text_match:desc" : "created_at:desc",
    per_page: 10,
    page: page && page > 0 ? page : 1,
  }
  const data: BlogSearchResponse = await typesense
    .collections("blogs")
    .documents()
    .search(searchParameters)
  const blogs = data.hits?.map((hit) => hit.document)
  const pages = Math.ceil(data.found / 10)
  const pagination = {
    base_url: "/blogs",
    query: query,
    language: language,
    category: category,
    generator: generator,
    tags: "",
    page: page,
    pages: pages,
    total: data.found,
    prev: page > 1 ? page - 1 : null,
    next: page < pages ? page + 1 : null,
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common", "home", "app"])),
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
      </Layout>
    </>
  )
}

export default BlogsPage
