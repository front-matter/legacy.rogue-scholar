import { Icon } from "@iconify/react"
import parse from "html-react-parser"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import { capitalize } from "lodash"
import { doi } from "doi-utils"

import { Byline } from "@/components/common/Byline"
import { ExportButton } from "@/components/common/ExportButton"
import { CitationButton } from "@/components/common/CitationButton"
import { BlogType, PaginationType, PostType } from "@/types/blog"

type Props = {
  posts: PostType[]
  blog?: BlogType
  pagination: PaginationType
}

export const Posts: React.FunctionComponent<Props> = ({
  posts,
  blog,
  pagination,
}) => {
  const { t } = useTranslation("common")
  const router = useRouter()
  const { locale: activeLocale } = router

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="space-t-10 lg:space-t-10 mt-4 lg:mt-6">
            {posts.map((post) => (
              <article
                key={post.doi || post.url}
                className="relative mb-5 gap-6"
              >
                <div>
                  {post.tags && (
                    <div className="flex flex-wrap items-center gap-x-1 text-xs">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="relative z-10 mb-1 ml-0 rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                        >
                          <Link
                            href={`${pagination.base_url}?page=${pagination.page}&query=${pagination.query}&tags=${tag}`}
                            className="whitespace-no-wrap"
                          >
                            {tag}
                          </Link>
                        </span>
                      ))}
                      {post.category && (
                        <span className="relative z-10 mb-1 ml-0 rounded-full bg-teal-100 px-2 py-0.5 font-medium text-teal-800 dark:bg-teal-700 dark:text-teal-200">
                          <Link
                            href={`${pagination.base_url}?page=${pagination.page}&query=${pagination.query}&category=${post.category}`}
                            className="whitespace-no-wrap"
                          >
                            {t("categories." + post.category)}
                          </Link>
                        </span>
                      )}
                      {post.language !== activeLocale && (
                        <span className="relative z-10 mb-1 ml-0 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-800 dark:bg-green-700 dark:text-green-200">
                          {t("languages." + post.language)}
                        </span>
                      )}
                      {post.status === "pending" && (
                        <span className="relative z-10 mb-1 ml-0 rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-800 dark:bg-red-700 dark:text-red-200">
                          {capitalize(t("status." + post.status))}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="group relative max-w-4xl">
                    {post.doi && (
                      <>
                        <Link
                          className="text-base hover:dark:text-gray-200"
                          target="_blank"
                          href={
                            process.env.VERCEL_ENV === "Production"
                              ? post.doi
                              : `/posts/${doi.normalize(post.doi)}`
                          }
                        >
                          <h3
                            className="mt-1 text-xl font-semibold text-gray-900 hover:text-gray-500 dark:text-gray-100"
                            data-cy="title"
                          >
                            {parse(String(post.title))}
                          </h3>
                        </Link>
                        <div className="font-medium">
                          <Link
                            className="text-base text-gray-500 hover:text-gray-900 hover:dark:text-gray-200"
                            target="_blank"
                            href={post.doi}
                          >
                            <Icon
                              icon="academicons:doi"
                              className="mb-1 mr-1 inline text-gray-300 hover:text-gray-900 hover:dark:text-gray-200"
                            />
                            {post.doi}
                          </Link>
                        </div>
                      </>
                    )}
                    {!post.doi && post.url && (
                      <Link
                        className="text-base text-gray-300 hover:text-gray-900 hover:dark:text-gray-200"
                        target="_blank"
                        href={post.url}
                      >
                        <h3 className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {parse(String(post.title))}
                        </h3>
                      </Link>
                    )}
                  </div>
                  <Byline post={post} blog={blog} />
                  <ExportButton post={post} />
                  <CitationButton post={post} activeLocale={activeLocale} />
                  <div className="max-w-2xl py-2 md:flex lg:max-w-4xl">
                    {post.image && (
                      <div className="relative mr-4 h-48 w-64 shrink-0">
                        <Image
                          src={post.image}
                          alt=""
                          fill={true}
                          className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 md:object-cover"
                        />
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                      </div>
                    )}
                    {post.abstract && (
                      <p className="text-medium max-w-screen-sm font-serif leading-6 text-gray-900 dark:text-white">
                        {parse(String(post.abstract))}
                      </p>
                    )}
                    {!post.abstract && (
                      <p className="text-medium max-w-screen-sm font-serif leading-6 text-gray-900 dark:text-white">
                        {parse(String(post.summary))}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
