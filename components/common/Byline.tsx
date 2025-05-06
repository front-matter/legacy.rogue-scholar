import Link from "next/link"
import { useTranslation } from "next-i18next"
import React from "react"

import { Author } from "@/components/common/Author"
import { toISODate } from "@/lib/helpers"
import { BlogType, PostType } from "@/types/blog"

type Author = {
  name?: string
  given?: string
  family?: string
  url?: string
}

type Props = {
  post: PostType
  blog?: BlogType
}

export const Byline: React.FunctionComponent<Props> = ({ post, blog }) => {
  const { t } = useTranslation("common")

  return (
    <div className="text-base font-medium text-gray-500 dark:text-gray-200">
      {post.published_at && (
        <div data-cy="published">
          {t("posts.published")}{" "}
          <time dateTime={toISODate(post.published_at).toString()}>
            {t("posts.date_published", {
              val: new Date(toISODate(post.published_at)),
              formatParams: {
                val: { year: "numeric", month: "long", day: "numeric" },
              },
            })}
          </time>
          {!blog && (
            <span data-cy="blog_name">
              {" "}
              in{" "}
              <Link
                className="font-semibold text-blue-600 hover:text-blue-800"
                href={"/blogs/" + post.blog_slug}
              >
                {post.blog_name}
              </Link>
            </span>
          )}
        </div>
      )}
      {post.authors && post.authors.length > 0 && (
        <div>
          {t("posts.author", { count: post.authors.length })}{" "}
          {post.authors.map((author, index) => (
            <Author
              key={author.name}
              name={author.name}
              given={author.given}
              family={author.family}
              url={author.url}
              isLast={index === (post.authors && post.authors.length - 1)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
