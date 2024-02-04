import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { Icon } from "@iconify/react"
import Link from "next/link"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function CitationButton({ post, activeLocale }) {
  return (
    <Menu as="div" className="relative ml-1 inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-1.5 py-1 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Citation
          <Icon
            icon="heroicons:chevron-down-20-solid"
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post.doi.substring(
                      16,
                    )}?format=citation&style=apa&locale=${activeLocale}`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  APA
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post.doi.substring(
                      16,
                    )}?format=citation&style=harvard1&locale=${activeLocale}`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Harvard
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post.doi.substring(
                      16,
                    )}?format=citation&style=ieee&locale=${activeLocale}`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  IEEE
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post.doi.substring(
                      16,
                    )}?format=citation&style=modern-language-association&locale=${activeLocale}`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  MLA
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post.doi.substring(
                      16,
                    )}?format=citation&style=vancouver&locale=${activeLocale}`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Vancouver
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post.doi.substring(
                      16,
                    )}?format=citation&style=chicago-author-date&locale=${activeLocale}`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Chicago
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
