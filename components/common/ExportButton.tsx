import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { useTranslation } from "next-i18next"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function ExportButton({ post }) {
  const { t } = useTranslation("common")
  const post_id = post.doi ? post.doi.substring(16) : post.id

  return (
    <Menu as="div" className="relative mt-1 inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-1.5 py-1 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        {t("posts.export")}
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
                    `/posts/${post_id}?format=md`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Markdown
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post_id}?format=pdf`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  PDF
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post_id}?format=bib`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  BibTex
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post_id}?format=csl`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  CSL
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post_id}?format=ris`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  RIS
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post_id}?format=epub`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  ePub
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post_id}?format=jsonld`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Schema.org
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post_id}?format=xml`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  JATS XML
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post_id}?format=crossref_xml`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Crossref XML
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_URL +
                    `/posts/${post_id}?format=datacite`
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  DataCite JSON
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
