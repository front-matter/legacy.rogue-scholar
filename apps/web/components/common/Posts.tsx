import { Icon } from "@iconify/react"
import parse from "html-react-parser"
import Link from "next/link"

import { Byline } from "@/components/common/Byline"
import { PostType } from "@/types/blog"

type Props = {
  posts: PostType[]
  parent?: boolean
}

export const Posts: React.FunctionComponent<Props> = ({
  posts,
  parent = false,
}) => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="space-t-10 lg:space-t-10 mt-4 lg:mt-6">
            {posts.map((post) => (
              <article
                key={post.doi}
                className="relative mb-5 flex gap-6 lg:flex-row"
              >
                {post.image && (
                  <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                    <img
                      src={post.image}
                      alt=""
                      className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                )}
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
                    <h3 className="mt-1 text-xl font-semibold text-gray-900 group-hover:text-gray-600">
                      {post.title}
                    </h3>
                    <Byline post={post} parent={parent} />
                    {post.doi && (
                      <div className="py-1 font-medium">
                        <Link
                          className="text-base text-gray-300 group-hover:text-gray-900"
                          href={post.doi}
                        >
                          <Icon
                            icon="academicons:doi"
                            className="mr-1 inline text-gray-300 hover:text-gray-900"
                          />
                          {post.doi}
                        </Link>
                      </div>
                    )}
                    {post.summary && (
                      <p className="text-medium mt-2 font-serif leading-6 text-gray-900">
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
