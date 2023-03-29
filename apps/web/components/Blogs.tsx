import Link from 'next/link'
import { Fragment } from 'react'
import { RssIcon, HomeIcon } from '@heroicons/react/20/solid'

import { Container } from '../components/Container'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Blogs({ blogs }) {
  return (
    <>
      <section className="bg-white">
        <Container className="relative">
          <div className="mx-auto max-w-7xl py-2 px-4 text-center sm:px-6 md:py-12 lg:px-8 lg:py-8">
            <div className="space-y-8 sm:space-y-12">
              <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
                <h2 className="font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-4xl">
                  The Rogue Scholar Blogs
                </h2>
                <p className="text-xl text-gray-500">
                  This list of blogs can be downloaded as{' '}
                  <Link
                    target="_blank"
                    href="/rogue-scholar.opml"
                    className="whitespace-nowrap border-b-0 font-semibold text-gray-700 hover:text-gray-400"
                  >
                    OPML file
                  </Link>{' '}
                  and imported into your RSS reader. Sign up for the waitlist if
                  you want your blog included in the Rogue Scholar.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section
        id="blogs"
        aria-label="blog listing"
        className="bg-slate-50 py-10 sm:py-16"
      >
        <Container className="relative">
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {blogs.map((blog) => (
              <li
                key={blog.title}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
              >
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-medium font-medium text-gray-900">
                        {blog.title}
                      </h3>
                    </div>
                    <span className="inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="-mt-px flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                      <a
                        href={blog.htmlUrl}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                      >
                        <HomeIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        Home Page URL
                      </a>
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                      <a
                        href={blog.xmlUrl}
                        className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                      >
                        <RssIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        Feed URL
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
