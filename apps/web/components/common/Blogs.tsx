import { Icon } from "@iconify/react"
import parse from "html-react-parser"
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
      <section className="bg-white">
        <Container className="relative">
          <div className="mx-auto max-w-7xl px-4 py-2 text-center sm:px-6 md:py-12 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Rogue Scholar Blogs
              </h2>
            </div>
          </div>
        </Container>
      </section>
      <section
        id="blogs"
        aria-label="blog listing"
        className="bg-slate-50 py-4 sm:py-6"
      >
        <Container className="relative">
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {blogs.map((blog) => (
              <li
                key={blog.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
              >
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-semibold truncate font-medium text-gray-900">
                        <Link
                          href={"/blogs/" + blog.id}
                          className="whitespace-nowrap border-b-0 font-semibold text-gray-700 hover:text-gray-400"
                        >
                          {parse(String(blog.title))}
                        </Link>
                      </h3>
                    </div>
                    <span className="inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      {t("categories." + blog.category)}
                    </span>
                    {blog.language !== activeLocale && (
                      <span className="ml-1 inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        {t("languages." + blog.language)}
                      </span>
                    )}
                  </div>
                  {blog.favicon && (
                    <img
                      className="h-10 w-10 flex-shrink-0 rounded-full bg-transparent"
                      src={blog.favicon}
                      alt={blog.title}
                    />
                  )}
                </div>
                <div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                      <Link
                        href={blog.home_page_url ? blog.home_page_url : "#"}
                        target="_blank"
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-500"
                      >
                        <Icon icon="fa6-solid:house" className="inline" />
                        Home Page
                      </Link>
                    </div>
                    {(blog.current_feed_url || blog.feed_url || "") &&
                      blog.feed_format && (
                        <div className="-ml-px flex w-0 flex-1">
                          <Link
                            href={blog.current_feed_url || blog.feed_url || ""}
                            target="_blank"
                            className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-500"
                          >
                            <Icon icon="fa6-solid:rss" className="inline" />
                            {feedFormats[blog.feed_format] + " Feed"}
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
