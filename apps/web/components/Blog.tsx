import { HomeIcon, RssIcon } from '@heroicons/react/20/solid'
import parse from 'html-react-parser'
import Link from 'next/link'

import { languages } from '../components/Blogs'

interface BlogType {
  id: string
  title: string
  category: string[]
  description?: string
  language: string
  homePageUrl: string
  feedUrl: string
  icon?: string
  favicon?: string
  generator?: string
  license: string
}

type Props = {
  blog: BlogType
}

export const Blog: React.FunctionComponent<Props> = ({ blog }) => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <span className="inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
            {blog.category}
          </span>
          <span className="ml-1 inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
            {languages[blog.language]}
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {blog.title}
          </h2>

          {blog.description && (
            <p className="mt-2 text-lg leading-8 text-gray-600">
              {parse(String(blog.description))}
            </p>
          )}
          <div className="-mt-px flex">
            <div className="flex w-0 flex-1">
              <Link
                href={blog.homePageUrl}
                target="_blank"
                className="relative -mr-px inline-flex w-0 basis-1/3 gap-x-3 py-4 text-sm font-medium text-gray-500"
              >
                <HomeIcon
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
                Home Page
              </Link>
            </div>
            <div className="-ml-px flex w-0 flex-1">
              <Link
                href={blog.feedUrl}
                target="_blank"
                className="relative inline-flex w-0 basis-1/3 gap-x-3 py-4 text-sm font-medium text-gray-500"
              >
                <RssIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                RSS Feed
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
