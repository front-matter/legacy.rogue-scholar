import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { useToast } from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { useTranslation } from "next-i18next"
import parse from "html-react-parser"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function CitationButton({ post, activeLocale }) {
  const { t } = useTranslation("common")
  const toast = useToast()

  const onFetchCitation = (doi: string, style: string, locale: string) => {
    const styles = {
      apa: "APA",
      harvard1: "Harvard",
      ieee: "IEEE",
      "modern-language-association": "MLA",
      vancouver: "Vancouver",
      "chicago-author-date": "Chicago",
      "american-chemical-society": "ACS",
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL}/posts/${doi.substring(
      16,
    )}?format=citation&style=${style}&locale=${locale}`
    fetch(url)
      .then((res) => {
        if (res.status >= 400) {
          return "Error fetching citation. Please try again later."
        }
        return res.text()
      })
      .then((data) => {

        toast({
          title: styles[style],
          description: parse(data),
          status: data.startsWith("Error") ? "error" : "info",
          duration: 9000,
          isClosable: true,
          position: "top-right",
          variant: "subtle",
        })
      })
  }

  return (
    <Menu as="div" className="relative ml-1 inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-1.5 py-1 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {t("posts.citation")}
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
                <a
                  onClick={() => onFetchCitation(post.doi, "apa", activeLocale)}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  APA
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() =>
                    onFetchCitation(post.doi, "harvard1", activeLocale)
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Harvard
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() =>
                    onFetchCitation(post.doi, "ieee", activeLocale)
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  IEEE
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() =>
                    onFetchCitation(
                      post.doi,
                      "modern-language-association",
                      activeLocale,
                    )
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  MLA
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() =>
                    onFetchCitation(post.doi, "vancouver", activeLocale)
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Vancouver
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() =>
                    onFetchCitation(
                      post.doi,
                      "chicago-author-date",
                      activeLocale,
                    )
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  Chicago
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() =>
                    onFetchCitation(
                      post.doi,
                      "american-chemical-society",
                      activeLocale,
                    )
                  }
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                  )}
                >
                  ACS
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
