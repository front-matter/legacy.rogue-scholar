import { Icon } from "@iconify/react"
import { useTranslation } from "next-i18next"
import { parseAsInteger, useQueryState } from "next-usequerystate"
import { useRef, useState } from "react"

import { PaginationType } from "@/types/blog"

type Props = {
  pagination: PaginationType
  locale: string
}

export default function Search({ pagination, locale }: Props) {
  const { t } = useTranslation(["common", "home"])
  const [query, setQuery] = useQueryState("query", { shallow: false })
  const [tags, setTags] = useQueryState("tags", { shallow: false })
  const [category, setCategory] = useQueryState("category", { shallow: false })
  const [generator, setGenerator] = useQueryState("generator", {
    shallow: false,
  })
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({
      shallow: false,
    })
  )
  const [language, setLanguage] = useQueryState("language", { shallow: false })

  // if (pagination.language !== locale) {
  //   setLanguage("")
  // }
 
  const [searchInput, setSearchInput] = useState("")
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onSubmit = () => {
    setQuery(inputRef.current?.value ?? "")
  }

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit()
    }
  }

  const onSearchChange = () => {
    setPage(1)
    setSearchInput(inputRef.current?.value ?? "")
  }

  const onLanguageChange = (id) => {
    setPage(1)
    setLanguage(id)
  }

  const onSearchClear = () => {
    setQuery("")
    setSearchInput("")
    setTags("")
    setCategory("")
    setGenerator("")
    inputRef.current?.focus()
  }

  const languages = [
    { id: "", title: "languages.all" },
    { id: locale, title: "languages." + locale },
  ]

  return (
    <div className="relative mx-auto max-w-2xl lg:max-w-4xl">
      <Icon
        icon="fa6-solid:magnifying-glass"
        className="absolute left-3 top-3 h-5 w-5 text-gray-500"
      />
      {(searchInput !== "" ||
        tags !== "" ||
        category !== "" ||
        generator !== "") && (
        <span
          id="search-clear"
          title="Clear"
          aria-label="Clear"
          onClick={onSearchClear}
        >
          <Icon
            icon="fa6-solid:xmark"
            className="absolute right-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-300"
          />
        </span>
      )}
      <input
        id="search"
        placeholder={t("search.placeholder")}
        value={searchInput}
        onChange={onSearchChange}
        className="mt-3 block w-full rounded-md border border-gray-400 bg-white py-2 pl-10 text-base placeholder-gray-500 focus:border-blue-500 focus:text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:placeholder-gray-300 dark:focus:text-gray-100"
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        ref={inputRef}
      />
      <fieldset className="mb-2 mt-1">
        <legend className="sr-only">language</legend>
        <div className="space-y-2 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {languages.map((la) => (
            <div key={la.id} className="flex items-center">
              <input
                id={la.id}
                name="language"
                type="radio"
                onChange={() => onLanguageChange(la.id)}
                defaultChecked={la.id === ""}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor={la.id}
                className="ml-3 block text-sm font-medium leading-6 text-gray-900"
              >
                {t(la.title, { ns: "home" })}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
