import { Icon } from "@iconify/react"
import parse from "html-react-parser"
import Link from "next/link"

import { Byline } from "@/components/common/Byline"
import { BlogType, PostType } from "@/types/blog"

type Props = {
  post: PostType
  blog?: BlogType
}

export const Post: React.FunctionComponent<Props> = ({ post, blog }) => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="space-t-10 lg:space-t-10 mt-10 lg:mt-12">
            <article
              key={post.doi}
              className="relative mb-5 flex gap-6 lg:flex-row"
            >
              <div>
                {post.tags && (
                  <div className="flex items-center gap-x-1 text-xs">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="relative z-10 ml-0 rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="group relative max-w-3xl">
                  <h3 className="mt-2 text-xl font-semibold leading-6 text-gray-900 hover:text-gray-600">
                    {post.title}
                  </h3>
                  <Byline post={post} blog={blog} />
                  {post.doi && (
                    <div className="py-1">
                      <Link
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-200"
                        href={post.doi}
                      >
                        <Icon
                          icon="academicons:doi"
                          className="mr-1 inline text-gray-500 dark:text-gray-200"
                        />
                        {post.doi}
                      </Link>
                    </div>
                  )}
                  {post.content_text && (
                    <p className="text-medium post-serif mt-2 leading-6 text-gray-900">
                      {parse(String(post.content_text))}
                    </p>
                  )}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  )
}
