import { Icon } from "@iconify/react"
import { formatISO, fromUnixTime } from "date-fns"
import parse from "html-react-parser"
import { capitalize } from "lodash"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"

import { feedFormats } from "@/components/common/Blog"
// import { getFunding } from "@/lib/helpers"
import { BlogType, PaginationType } from "@/types/blog"

type Props = {
  blogs: BlogType[]
  pagination: PaginationType
}

export const Blogs: React.FunctionComponent<Props> = ({
  blogs,
  pagination,
}) => {
  const { t } = useTranslation(["common", "app"])
  const router = useRouter()
  const { locale: activeLocale } = router

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="space-t-10 lg:space-t-10 mt-4 lg:mt-6">
            {blogs.map((blog) => (
              <>
                <div key={blog.slug}>
                  {blog.category && (
                    <span className="inline-block flex-shrink-0 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800 dark:bg-teal-700 dark:text-teal-200">
                      <Link
                        href={`${pagination.base_url}?page=1&query=${pagination.query}&category=${blog.category}&generator=${pagination.generator}`}
                        className="whitespace-no-wrap"
                      >
                        {t("categories." + blog.category)}
                      </Link>
                    </span>
                  )}
                  {blog.language !== activeLocale && (
                    <span className="ml-1 inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-700 dark:text-green-200">
                      {t("languages." + blog.language)}
                    </span>
                  )}
                  {blog.generator && (
                    <span className="ml-1 inline-block flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800">
                      <Link
                        href={`${pagination.base_url}?page=1&query=${pagination.query}&category=${pagination.category}&generator=${blog.generator}`}
                        className="whitespace-no-wrap"
                      >
                        {blog.generator}
                      </Link>
                    </span>
                  )}
                  {blog.status === "archived" && (
                    <span className="ml-1 inline-block flex-shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-700 dark:text-red-200">
                      {capitalize(t("status." + blog.status, { ns: "app" }))}
                    </span>
                  )}
                </div>
                <div className="relative mt-1 flex items-center gap-x-8">
                  <Link
                    href={"/blogs/" + blog.slug}
                    className="whitespace-nowrap border-b-0 font-semibold text-gray-700 hover:text-gray-400 dark:text-gray-200"
                  >
                    <h2
                      className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl"
                      data-cy="title"
                    >
                      {parse(String(blog.title))}
                    </h2>
                  </Link>
                  {blog.favicon && (
                    <Image
                      className="h-10 w-10 rounded-full bg-transparent"
                      src={blog.favicon || "/favicon.ico"}
                      alt={blog.title || "Favicon"}
                      width={64}
                      height={64}
                    />
                  )}
                </div>
                {blog.description && (
                  <div className="font-serif text-base text-gray-600 dark:text-gray-200">
                    {parse(String(blog.description))}

                    {/* {blog.funding ? getFunding(blog.funding) : null && (
                        <span>
                          {" "}
                          {parse(String(funding_info.str))}
                          {funding_info.url && (
                            <Link
                              className="hover:font-semibold"
                              href={funding_info.url}
                              target="_blank"
                            >
                              {"grant agreement No " + funding_info.link_str}
                            </Link>
                          )}
                          .
                        </span>
                      )} */}
                  </div>
                )}
                <div className="mb-10 mt-1">
                  <span className="text-gray-500 dark:text-gray-200">
                    <Link
                      href={
                        blog.status === "archived"
                          ? (((blog.archive_prefix as string) +
                              blog.home_page_url) as string)
                          : (blog.home_page_url as string)
                      }
                      target="_blank"
                      className="relative mr-6 w-0 py-2 text-base font-medium"
                    >
                      <Icon icon="fa6-solid:house" className="inline" />
                      <span className="ml-2">{t("posts.homepage")}</span>
                    </Link>
                  </span>
                  {blog.status === "active" &&
                    (blog.current_feed_url || blog.feed_url) &&
                    blog.feed_format && (
                      <span className="-ml-px text-gray-500 dark:text-gray-200">
                        <Link
                          href={blog.current_feed_url || blog.feed_url || ""}
                          target="_blank"
                          className="relative mr-6 w-0 py-2 text-base font-medium"
                        >
                          <Icon icon="fa6-solid:rss" className="inline" />
                          <span className="ml-2">
                            {t("posts.feed", {
                              format: feedFormats[blog.feed_format],
                            })}
                          </span>
                        </Link>
                      </span>
                    )}
                  {blog.use_mastodon && (
                    <span className="-ml-px text-gray-500 dark:text-gray-200">
                      <Link
                        href={"https://rogue-scholar.social/@" + blog.slug}
                        target="_blank"
                        className="relative mr-6 w-0 py-2 text-base font-medium"
                      >
                        <Icon icon="fa6-brands:mastodon" className="inline" />
                        <span className="ml-2">Mastodon</span>
                      </Link>
                    </span>
                  )}
                  <span className="font-medium text-gray-500 dark:text-gray-200">
                    <Icon
                      icon="fa6-regular:calendar-check"
                      className="inline"
                    />
                    <time
                      className="ml-2 mr-6"
                      dateTime={formatISO(
                        fromUnixTime(blog.updated_at as number)
                      )}
                    >
                      {t("posts.date_published", {
                        val: new Date((blog.updated_at as number) * 1000),
                        formatParams: {
                          val: {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        },
                      })}
                    </time>
                  </span>
                  {blog.issn && (
                    <span
                      className="-ml-px text-base font-medium text-gray-500 dark:text-gray-200"
                      data-cy="issn"
                    >
                      {"ISSN " + blog.issn}
                    </span>
                  )}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
