import parse from 'html-react-parser'
import Link from 'next/link'

import { Author } from '../components/Author'

type Author = {
  name: string
  url?: string
}

type Post = {
  id: string
  link: string
  isPermalink: boolean
  title: string
  description: string
  published: string
  authors: Author[]
  image: string
  tags?: string[]
}

type Props = {
  posts: Post[]
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
                className="relative mb-8 flex gap-8 lg:flex-row"
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
                      {[].concat(post.tags).map((tag) => (
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
                    <h3 className="mt-2 text-xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link href={post.isPermalink ? post.id : post.link}>
                        {post.title}
                      </Link>
                    </h3>
                    <div className="text-small mt-1 flex items-center gap-x-1 text-gray-500">
                      <time dateTime={post.published}>
                        {new Date(post.published).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      {post.id && post.isPermalink && (
                        <span>
                          •{' '}
                          <Link href={post.id} target="_blank">
                            {post.id}
                          </Link>
                        </span>
                      )}
                    </div>
                    <span>
                      {post.authors.map((author, index) => (
                        <Author
                          key={author.name}
                          name={author.name}
                          url={author.url}
                          isLast={index === post.authors.length - 1}
                        />
                      ))}
                    </span>
                    {post.description && (
                      <p className="text-medium mt-2 leading-6 text-gray-900">
                        {parse(String(post.description))}
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
