import Link from "next/link"
import { useTranslation } from "next-i18next"

import { PaginationType } from "@/types/blog"

type Props = {
  pagination: PaginationType
}

export default function Pagination({ pagination }: Props) {
  const { t } = useTranslation("common")
  const from = pagination.page * 15 - 15 + 1
  const to =
    pagination.page * 15 > pagination.total
      ? pagination.total
      : pagination.page * 15

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl">
      <nav
        className="flex items-center justify-between bg-white pb-3 pt-1"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          {pagination.total > 0 && (
            <p className="text-sm text-gray-700">
              Showing <span className="font-semibold">{from}</span> to{" "}
              <span className="font-semibold">{to}</span> of{" "}
              <span className="font-semibold">{pagination.total}</span> results
            </p>
          )}
          {pagination.total === 0 && (
            <p className="text-sm text-gray-700">
              {t("pagination.no_results", "No results found")}
            </p>
          )}
        </div>
        <div className="flex flex-1 justify-between font-medium sm:justify-end">
          {pagination.prev && (
            <Link
              className="relative inline-flex items-center px-1 py-1 text-sm focus-visible:outline-offset-0"
              href={`${pagination.base_url}?page=${pagination.prev}&query=${pagination.query}`}
            >
              {t("pagination.previous", "Previous")}
            </Link>
          )}
          {pagination.prev && pagination.next && (
            <span className="ml-1">|</span>
          )}
          {pagination.next && (
            <Link
              className="relative ml-1 inline-flex items-center px-1 py-1 text-sm focus-visible:outline-offset-0"
              href={`${pagination.base_url}?page=${pagination.next}&query=${pagination.query}`}
            >
              {t("pagination.next", "Next")}
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}
