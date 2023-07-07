import Link from "next/link"
import { useTranslation } from "next-i18next"
import React from "react"

import { Author } from "@/components/common/Author"
import { PostType } from "@/types/blog"

type Author = {
  name: string
  url?: string
}

type Props = {
  post: PostType
  parent: boolean
}

export const Byline: React.FunctionComponent<Props> = ({ post, parent }) => {
  const { t } = useTranslation("common")

  return (
    <div className="text-base font-medium text-gray-500">
      {post.date_published && (
        <div>
          {t("posts.published")}{" "}
          <time dateTime={post.date_published.toString()}>
            {t("posts.date_published", {
              val: new Date(post.date_published),
              formatParams: {
                val: { year: "numeric", month: "long", day: "numeric" },
              },
            })}
          </time>
          {!parent && (
            <span>
              {" "}
              in{" "}
              <Link
                className="font-semibold text-blue-600 group-hover:text-blue-800"
                href={"/blogs/" + post.blog?.id}
              >
                {post.blog?.title}
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
              url={author.url}
              isLast={index === (post.authors && post.authors.length - 1)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
