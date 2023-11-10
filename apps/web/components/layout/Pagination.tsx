import Link from "next/link"
import { useTranslation } from "next-i18next"

import { PaginationType } from "@/types/blog"

type Props = {
  pagination: PaginationType
}

export default function Pagination({ pagination }: Props) {
  const { t } = useTranslation("common")

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl">
      <nav
        className="flex items-center justify-between bg-transparent pb-3 pt-1"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          {pagination.total > 0 && (
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {t("pagination.page")}{" "}
              <span className="font-semibold">{pagination.page}</span>{" "}
              {t("pagination.of")}{" "}
              <span className="font-semibold">
                {t("number", { val: pagination.total })}
              </span>{" "}
              {t("pagination.results")}
            </p>
          )}
          {pagination.total === 0 && (
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {t("pagination.no_results")}
            </p>
          )}
        </div>
        <div className="flex flex-1 justify-between font-medium sm:justify-end">
          {pagination.prev && (
            <Link
              className="relative inline-flex items-center px-1 py-1 text-sm focus-visible:outline-offset-0"
              href={`${pagination.base_url}?page=${pagination.prev}&query=${pagination.query}&tags=${pagination.tags}&category=${pagination.category}&generator=${pagination.generator}&language=${pagination.language}`}
            >
              {t("pagination.previous")}
            </Link>
          )}
          {pagination.prev && pagination.next && (
            <span className="ml-1">|</span>
          )}
          {pagination.next && (
            <Link
              className="relative ml-1 inline-flex items-center px-1 py-1 text-sm focus-visible:outline-offset-0"
              href={`${pagination.base_url}?page=${pagination.next}&query=${pagination.query}&category=${pagination.category}&generator=${pagination.generator}&tags=${pagination.tags}&language=${pagination.language}`}
            >
              {t("pagination.next")}
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}
