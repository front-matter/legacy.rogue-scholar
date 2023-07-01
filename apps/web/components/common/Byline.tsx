import Link from "next/link"
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
  return (
    <div className="text-base text-gray-500">
      {post.date_published && (
        <div>
          Published{" "}
          <time dateTime={post.date_published.toString()}>
            {new Date(post.date_published).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
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
          Author{post.authors.length > 1 ? "s " : " "}
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
