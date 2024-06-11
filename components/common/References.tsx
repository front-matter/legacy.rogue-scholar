import { Icon } from "@iconify/react"
import Link from "next/link"
import parse from "html-react-parser"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import { doi } from "doi-utils"

import { Byline } from "@/components/common/BylineReference"
import { isRogueScholarDoi } from "@/lib/helpers"

type Props = {
  references: any[]
}

export const References: React.FunctionComponent<Props> = ({ references }) => {
  const { t } = useTranslation("common")
  const router = useRouter()
  const { locale: activeLocale } = router
  console.log(references)

  // format references from commonmeta format
  const formattedReferences = references.map((reference) => {
    if (reference.titles && reference.titles.length > 0) {
      reference.title = reference.titles[0].title
    }
    if (reference.descriptions && reference.descriptions.length > 0) {
      reference.abstract = reference.descriptions[0].description
    }
    reference.subjects = reference.subjects?.slice(0, 5)
    return reference
  })

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="space-t-10 lg:space-t-10 mt-4">
            <h2 className="text-2xl mb-3 font-semibold text-gray-900 hover:text-gray-500 dark:text-gray-100">
              {t("References")}
            </h2>
          </div>
          <div className="space-t-10 lg:space-t-10 mb-4 lg:mb-6">
            {formattedReferences.map((reference) => (
              <article
                key={reference.id}
                className="relative mb-5 gap-6"
              >
                <div>
                  {(reference.subjects || reference.language) && (
                    <div className="flex flex-wrap items-center gap-x-1 text-xs">
                      {reference.subjects && reference.subjects.map((sub) => (
                        <span
                          key={sub.subject}
                          className="relative z-10 mb-1 ml-0 rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                        >
                          {sub.subject}
                        </span>
                      ))}
                      {reference.language && reference.language !== activeLocale && (
                        <div className="flex flex-wrap items-center gap-x-1 text-xs">
                          <span className="relative z-10 mb-1 ml-0 rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-800 dark:bg-green-700 dark:text-green-200">
                            {t("languages." + reference.language)}
                          </span>
                        </div>
                      )}
                    </div>
                  )} 
                </div>
                <div className="group relative max-w-4xl">
                  {reference.id && (
                    <>
                      <Link
                        className="text-base hover:dark:text-gray-200"
                        href={isRogueScholarDoi(reference.id) ? `/posts/${doi.normalize(reference.id)}` : reference.id}
                      >
                        <h3
                          className="text-xl font-semibold text-gray-900 hover:text-gray-500 dark:text-gray-100"
                          data-cy="title"
                        >
                          {parse(String(reference.title || reference.id))}
                        </h3>
                      </Link>
                      <div className="font-medium">
                        <Link
                          className="text-base text-gray-500 hover:text-gray-900 hover:dark:text-gray-200"
                          target="_blank"
                          href={reference.id}
                        >
                          <Icon
                            icon="academicons:doi"
                            className="mb-1 mr-1 inline text-gray-300 hover:text-gray-900 hover:dark:text-gray-200"
                          />
                          {reference.id}
                        </Link>
                      </div>
                    </>
                  )}
                  <Byline reference={reference} />
                  <div className="max-w-2xl py-2 md:flex lg:max-w-4xl">
                    {reference.abstract && (
                      <p className="text-medium max-w-screen-sm font-serif leading-6 text-gray-900 dark:text-white">
                        {parse(String(reference.abstract))}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
