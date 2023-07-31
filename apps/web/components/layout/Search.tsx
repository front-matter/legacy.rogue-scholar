import { Icon } from "@iconify/react"
import { useTranslation } from "next-i18next"
import { queryTypes, useQueryState } from "next-usequerystate"
import { useRef, useState } from "react"

import { PaginationType } from "@/types/blog"

type Props = {
  pagination: PaginationType
}

export default function Search({ pagination }: Props) {
  const { t } = useTranslation("common")
  const [query, setQuery] = useQueryState("query")
  const [tags, setTags] = useQueryState("tags")
  const [page, setPage] = useQueryState("page", queryTypes.integer)

  console.log(query, page)
  console.log(pagination)
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

  const onSearchClear = () => {
    setQuery("")
    setSearchInput("")
    setTags("")
    inputRef.current?.focus()
  }

  return (
    <div className="relative mx-auto max-w-2xl lg:max-w-4xl">
      <Icon
        icon="fa6-solid:magnifying-glass"
        className="absolute left-3 top-3 h-5 w-5 text-gray-500"
      />
      {(searchInput !== "" || tags !== "") && (
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
    </div>
  )
}
