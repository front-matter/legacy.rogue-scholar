import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {blog.title}
            </h2>
            <span className="inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              {blog.category}
            </span>
            <span className="ml-1 inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              {languages[blog.language]}
            </span>
            {blog.description && (
              <p className="mt-2 text-lg leading-8 text-gray-600">
                {parse(String(blog.description))}
              </p>
            )}
          </div>
          {blog.favicon && (
            <img
              className="h-10 w-10 flex-shrink-0 rounded-full bg-transparent"
              src={blog.favicon}
              alt={blog.title}
            />
          )}
          <div className="">
            <span className="">
              <Link
                href={blog.homePageUrl}
                target="_blank"
                className="relative mr-10 w-0 py-2 text-base font-medium text-gray-500"
              >
                <FontAwesomeIcon icon="house" className="text-gray-500" />
                <span className="ml-2">Home Page</span>
              </Link>
            </span>
            <span className="-ml-px">
              <Link
                href={blog.feedUrl}
                target="_blank"
                className="relative mr-10 w-0 py-2 text-base font-medium text-gray-500"
              >
                <FontAwesomeIcon icon="rss" className="text-gray-500" />
                <span className="ml-2">RSS Feed</span>
              </Link>
            </span>
            {blog.license && (
              <span className="">
                <Link
                  href={blog.license}
                  target="_blank"
                  className="relative py-2 text-base font-medium text-gray-500"
                >
                  <FontAwesomeIcon
                    icon={['fab', 'creative-commons']}
                    className="font-bold"
                  />
                  <FontAwesomeIcon
                    icon={['fab', 'creative-commons-by']}
                    className="ml-0.5 font-bold"
                  />
                  <span className="ml-2">License</span>
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}