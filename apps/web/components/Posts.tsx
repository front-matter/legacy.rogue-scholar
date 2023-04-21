import { Icon } from '@iconify/react'
import parse from 'html-react-parser'
import Link from 'next/link'
import { isDoi, PostType } from 'pages/api/blogs/[slug]'

import { Byline } from '../components/Byline'

type Props = {
  posts: PostType[]
}

export const Posts: React.FunctionComponent<Props> = ({ posts }) => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="space-t-10 lg:space-t-10 mt-10 lg:mt-12">
            {posts.map((post) => (
              <article
                key={post.id}
                className="relative mb-8 flex gap-6 lg:flex-row"
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
                {post.thumbnail && (
                  <div className="relative aspect-[16/9] h-16 w-16 sm:aspect-[2/1] lg:aspect-square lg:shrink-0">
                    <img
                      src={post.thumbnail}
                      alt=""
                      className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-contain"
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
                    {post.id && isDoi(post.id) && (
                      <h3 className="mt-2 text-xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <Link href={post.id}>
                          {post.title}
                          <Icon
                            icon="academicons:doi"
                            className="ml-0.5 inline text-base text-[#f0b941]"
                          />
                        </Link>
                      </h3>
                    )}
                    {post.url && post.id && !isDoi(post.id) && (
                      <h3 className="mt-2 text-xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <Link href={post.url}>{post.title}</Link>
                      </h3>
                    )}
                    <Byline
                      authors={post.authors}
                      datePublished={post.datePublished}
                    />
                    {post.summary && (
                      <p className="text-medium mt-2 leading-6 text-gray-900">
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
