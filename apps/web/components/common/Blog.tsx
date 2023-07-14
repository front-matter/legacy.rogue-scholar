import { Icon } from "@iconify/react"
import parse from "html-react-parser"
import Link from "next/link"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"

import { BlogType } from "@/types/blog"

type Props = {
  blog: BlogType
}

export const generators: { [key: string]: string } = {
  WordPress: "https://wordpress.org/",
  Ghost: "https://ghost.org/",
  Jekyll: "https://jekyllrb.com/",
  Hugo: "https://gohugo.io/",
  Blogger: "https://www.blogger.com/",
  Medium: "https://medium.com/",
  Quarto: "https://quarto.org/",
  Distill: "https://rstudio.github.io/distill/",
}

export const feedFormats: { [key: string]: string } = {
  "application/rss+xml": "RSS",
  "application/atom+xml": "Atom",
  "application/feed+json": "JSON",
}

export const Blog: React.FunctionComponent<Props> = ({ blog }) => {
  const generator = blog.generator ? blog.generator.split(" ")[0] : null
  const feed_url = blog.current_feed_url || blog.feed_url
  const { t } = useTranslation("common")
  const router = useRouter()
  const { locale: activeLocale } = router

  return (
    <div className="bg-inherit py-4">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="relative mb-2 flex items-center gap-x-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {parse(String(blog.title))}
              </h2>
            </div>
            {blog.favicon && (
              <img
                className="h-10 w-10 rounded-full bg-transparent"
                src={blog.favicon}
                alt={blog.title}
              />
            )}
          </div>
          <div className="-mt-px">
            {blog.category && (
              <span className="inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {t("categories." + blog.category)}
              </span>
            )}
            {blog.language !== activeLocale && (
              <span className="ml-1 inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                {t("languages." + blog.language)}
              </span>
            )}
            {generator && (
              <span className="ml-1 inline-block flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800">
                {generator}
              </span>
            )}
            {blog.description && (
              <div className="mt-1 font-serif text-base text-gray-600">
                {parse(String(blog.description))}
              </div>
            )}
          </div>
          <div className="mt-1">
            <span className="text-gray-500">
              <Link
                href={blog.home_page_url ?? ""}
                target="_blank"
                className="relative mr-6 w-0 py-2 text-base font-medium"
              >
                <Icon icon="fa6-solid:house" className="inline" />
                <span className="ml-2">Home Page</span>
              </Link>
            </span>
            {feed_url && blog.feed_format && (
              <span className="-ml-px text-gray-500">
                <Link
                  href={feed_url}
                  target="_blank"
                  className="relative mr-6 w-0 py-2 text-base font-medium"
                >
                  <Icon icon="fa6-solid:rss" className="inline" />
                  <span className="ml-2">
                    {feedFormats[blog.feed_format] + " Feed"}
                  </span>
                </Link>
              </span>
            )}
            {blog.modified_at && blog.modified_at > "1970-01-02" && (
              <span className="font-medium text-gray-500">
                <Icon icon="fa6-regular:calendar-check" className="inline" />
                <time
                  className="ml-2 mr-6"
                  dateTime={blog.modified_at.toString()}
                >
                  {new Date(blog.modified_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
