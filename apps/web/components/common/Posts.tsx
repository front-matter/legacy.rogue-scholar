// import { Fragment, useState } from "react"
// import { Dialog, Transition } from "@headlessui/react"
import { Icon } from "@iconify/react"
import parse from "html-react-parser"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"

import { Byline } from "@/components/common/Byline"
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
                    <div className="flex items-center gap-x-1 text-xs">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="relative z-10 ml-0 rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                        >
                          <Link
                            href={`${pagination.base_url}?page=${pagination.page}&query=${pagination.query}&tags=${tag}`}
                          >
                            {tag}
                          </Link>
                        </span>
                      ))}
                      {post.language !== activeLocale && (
                        <span className="relative z-10 ml-0 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-800 dark:bg-green-700 dark:text-green-200">
                          {t("languages." + post.language)}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="group relative max-w-4xl">
                    <h3 className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {post.title}
                    </h3>
                    <Byline post={post} blog={blog} />
                    {post.doi && (
                      <div className="py-1 font-medium">
                        <Link
                          className="text-base text-gray-300 hover:text-gray-900 hover:dark:text-gray-200"
                          target="_blank"
                          href={post.doi}
                        >
                          <Icon
                            icon="academicons:doi"
                            className="mb-1 mr-1 inline text-gray-300 hover:text-gray-900 hover:dark:text-gray-200"
                          />
                          {post.doi}
                        </Link>
                        {process.env.NODE_ENV !== "production" && (
                          <Link
                            className="text-base text-gray-300 hover:text-gray-900 hover:dark:text-gray-200"
                            href={`/api/posts/${post.doi.substring(
                              16
                            )}?format=epub`}
                          >
                            <Icon
                              icon="fa6-solid:file-zipper"
                              className="mb-1 ml-5 mr-1 inline text-sm"
                            />
                            ePub
                          </Link>
                        )}
                        <Link
                          className="text-base text-gray-300 hover:text-gray-900 hover:dark:text-gray-200"
                          href={`/api/posts/${post.doi.substring(
                            16
                          )}?format=bibtex`}
                        >
                          <Icon
                            icon="fa6-solid:file-code"
                            className="mb-1 ml-5 mr-1 inline text-sm"
                          />
                          BibTex
                        </Link>
                        <Link
                          className="text-base text-gray-300 hover:text-gray-900 hover:dark:text-gray-200"
                          href={`/api/posts/${post.doi.substring(
                            16
                          )}?format=citation&style=apa&locale=${activeLocale}`}
                        >
                          <Icon
                            icon="fa6-solid:file-lines"
                            className="mb-1 ml-5 mr-1 inline text-sm"
                          />
                          Citation (APA)
                        </Link>
                        {/* <button
                          className="ml-5 text-base text-gray-300 hover:text-gray-900 hover:dark:text-gray-200"
                          type="button"
                          data-modal-target="citationBox"
                          data-modal-show="citationBox"
                        >
                          <Icon
                            icon="fa6-solid:quote-left"
                            className="mb-0.5 mr-1 inline"
                          />
                          Cite
                        </button> */}
                      </div>
                    )}
                    {!post.doi && post.url && (
                      <div className="py-1 font-medium">
                        <Link
                          className="text-base text-gray-300 hover:text-gray-900 hover:dark:text-gray-200"
                          target="_blank"
                          href={post.url}
                        >
                          {post.url}
                        </Link>
                      </div>
                    )}
                    <div className="flex max-w-2xl py-2 lg:max-w-4xl">
                      {post.image && (
                        <div className="relative mr-4 h-48 w-64 shrink-0">
                          <Image
                            src={post.image}
                            alt=""
                            fill={true}
                            className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                          />
                          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                        </div>
                      )}
                      {post.summary && (
                        <p className="text-medium max-w-screen-sm font-serif leading-6 text-gray-900 dark:text-white">
                          {parse(String(post.summary))}
                        </p>
                      )}
                    </div>
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
