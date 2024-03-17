import { Icon } from "@iconify/react"
import Link from "next/link"
import parse from "html-react-parser"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"

type Props = {
  references: any[]
}

export const References: React.FunctionComponent<Props> = ({ references }) => {
  const { t } = useTranslation("common")
  const router = useRouter()
  const { locale: activeLocale } = router

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="space-t-10 lg:space-t-10 mt-4">
            <h4 className="text-lg font-semibold text-gray-900 hover:text-gray-500 dark:text-gray-100">
              {t("References")}
            </h4>
          </div>
          <div className="space-t-10 lg:space-t-10 mb-4 lg:mb-6">
            <ol className="relative mb-1 ml-6 list-outside list-decimal gap-6 font-serif">
              {references.map((reference) => (
                <li
                  key={reference.doi || reference.url}
                  className="mb-1 gap-x-1 text-base font-medium text-gray-500 dark:text-gray-200"
                >
                  {reference.title && parse(String(reference.title + " "))}
                  {reference.publicationYear &&
                    "(" + reference.publicationYear + "). "}
                  {reference.doi && (
                    <Link
                      href={reference.doi}
                      target="_blank"
                      className="text-gray-500 hover:text-gray-900 hover:dark:text-gray-200"
                    >
                      {reference.doi}
                    </Link>
                  )}
                  {reference.url && (
                    <Link
                      href={reference.url}
                      target="_blank"
                      className="text-gray-500 hover:text-gray-900 hover:dark:text-gray-200"
                    >
                      {reference.url}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  )
}
