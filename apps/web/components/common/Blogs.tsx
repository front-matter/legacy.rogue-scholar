import { Icon } from "@iconify/react"
import parse from "html-react-parser"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"

import { feedFormats } from "@/components/common/Blog"
import { Container } from "@/components/layout/Container"
import { BlogType } from "@/types/blog"

type Props = {
  blogs: BlogType[]
}

export const Blogs: React.FunctionComponent<Props> = ({ blogs }) => {
  const { t } = useTranslation("common")
  const router = useRouter()
  const { locale: activeLocale } = router

  return (
    <>
      <section className="bg-white dark:bg-slate-800">
        <Container className="relative">
          <div className="mx-auto max-w-7xl px-4 py-2 text-center sm:px-6 md:py-12 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                {t("posts.blogs")}
              </h2>
            </div>
          </div>
        </Container>
      </section>
      <section
        id="blogs"
        aria-label="blog listing"
        className="bg-slate-50 py-4 dark:bg-slate-800 sm:py-6"
      >
        <Container className="relative">
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {blogs.map((blog) => (
              <li
                key={blog.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow dark:bg-slate-800"
              >
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-semibold truncate font-medium text-gray-900 dark:text-slate-100">
                        <Link
                          href={"/blogs/" + blog.slug}
                          className="whitespace-nowrap border-b-0 font-semibold text-gray-700 hover:text-gray-400 dark:text-gray-200"
                        >
                          {parse(String(blog.title))}
                        </Link>
                      </h3>
                    </div>
                    <span className="inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-700 dark:text-blue-200">
                      {t("categories." + blog.category)}
                    </span>
                    {blog.language !== activeLocale && (
                      <span className="ml-1 inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-700 dark:text-green-200">
                        {t("languages." + blog.language)}
                      </span>
                    )}
                  </div>
                  {blog.favicon && (
                    <Image
                      className="h-10 w-10 flex-shrink-0 rounded-full bg-transparent"
                      src={blog.favicon}
                      alt={blog.title || "Favicon"}
                      width={64}
                      height={64}
                    />
                  )}
                </div>
                <div>
                  <div className="-mt-px flex divide-x divide-gray-200 dark:divide-gray-700">
                    <div className="flex w-0 flex-1">
                      <Link
                        href={blog.home_page_url ? blog.home_page_url : "#"}
                        target="_blank"
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-500 dark:text-gray-200"
                      >
                        <Icon icon="fa6-solid:house" className="inline" />
                        {t("posts.homepage")}
                      </Link>
                    </div>
                    {(blog.current_feed_url || blog.feed_url || "") &&
                      blog.feed_format && (
                        <div className="-ml-px flex w-0 flex-1">
                          <Link
                            href={blog.current_feed_url || blog.feed_url || ""}
                            target="_blank"
                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-500 dark:text-gray-200"
                          >
                            <Icon icon="fa6-solid:rss" className="inline" />
                            {t("posts.feed", {
                              format: feedFormats[blog.feed_format],
                            })}
                          </Link>
                        </div>
                      )}
                    {blog.use_mastodon && (
                      <div className="-ml-px flex w-0 flex-1">
                        <Link
                          href={"https://rogue-scholar.social/@" + blog.slug}
                          target="_blank"
                          className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-500 dark:text-gray-200"
                        >
                          <Icon icon="fa6-brands:mastodon" className="inline" />
                          Mastodon
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
