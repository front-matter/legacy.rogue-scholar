import Link from 'next/link'
import { Fragment } from 'react'

import { Container } from '../components/Container'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Blogs({ blogs }) {
  console.log(blogs.outline)
  return (
    <Container className="relative">
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-2 px-4 text-center sm:px-6 md:py-12 lg:px-8 lg:py-8">
          <div className="space-y-8 sm:space-y-12">
            <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
              <h2 className="font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-4xl">
                The Rogue Scholar blogs
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
                and imported into your RSS reader. Or fetch the information via
                the{' '}
                <Link
                  target="_blank"
                  href="/api/opml"
                  className="whitespace-nowrap border-b-0 font-semibold text-gray-700 hover:text-gray-400"
                >
                  JSON API
                </Link>{' '}
                . Sign up for the waitlist if you want your blog included in the
                Rogue Scholar.
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="my-8 flow-root">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full">
                  <thead className="bg-white">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-medium uppercase text-gray-500 sm:pl-3"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-medium uppercase text-gray-500"
                      >
                        Home Page URL
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-medium uppercase text-gray-500"
                      >
                        Feed URL
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {blogs.map((category) => (
                      <Fragment key={category.text}>
                        <tr className="border-t border-gray-200">
                          <th
                            colSpan={4}
                            scope="colgroup"
                            className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                          >
                            {category.text}
                          </th>
                        </tr>
                        {[].concat(category.outline).map((blog, blogIdx) => (
                          <tr
                            key={blog.text}
                            className={classNames(
                              blogIdx === 0
                                ? 'border-gray-300'
                                : 'border-gray-200',
                              'border-t'
                            )}
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                              {blog.text}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <Link
                                target="_blank"
                                href={blog.htmlUrl}
                                className="whitespace-nowrap border-b-0 text-gray-700 hover:text-gray-400"
                              >
                                {blog.htmlUrl}
                              </Link>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <Link
                                target="_blank"
                                href={blog.xmlUrl}
                                className="whitespace-nowrap border-b-0 text-gray-700 hover:text-gray-400"
                              >
                                {blog.xmlUrl}
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
