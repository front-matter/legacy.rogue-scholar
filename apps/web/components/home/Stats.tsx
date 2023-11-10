import { useTranslation } from "next-i18next"

import DonutChart from "@/components/common/DonutChart"
import { Container } from "@/components/layout/Container"

// tailwindcss colors
export const blue = {
  "blue-100": "#dbeafe",
  "blue-200": "#bfdbfe",
  "blue-300": "#93c5fd",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "blue-700": "#1d4ed8",
  "blue-800": "#1e40af",
  "blue-900": "#1e3a8a",
}

export const range = Object.values(blue)

export const languageRange = Object.values(blue).filter(function (_v, i) {
  return i % 5 == 0
})

export const languageDomain = ["en", "de", "es", "pt", "fr", "it"]

export const categoryDomain = [
  "naturalSciences",
  "engineeringAndTechnology",
  "medicalAndHealthSciences",
  "agriculturalSciences",
  "socialSciences",
  "humanities",
]

export const platformDomain = [
  "WordPress",
  "Ghost",
  "Blogger",
  "Medium",
  "Substack",
  "Hugo",
  "Jekyll",
  "Quarto",
  "Other",
]

type Data = {
  title: string
  count: number
}

type Props = {
  count: number
  categories: Data[]
  languages: Data[]
  platforms: Data[]
}

export const Stats: React.FunctionComponent<Props> = ({
  count,
  categories,
  languages,
  platforms,
}) => {
  const { t } = useTranslation(["home", "common"])
  const translatedCategoryDomain = categoryDomain.map((category) => {
    return t("categories." + category, { ns: "common" })
  })
  const translatedLanguageDomain = languageDomain.map((category) => {
    return t("languages." + category)
  })

  return (
    <section
      id="stats"
      aria-labelledby="stats-title"
      className="relative overflow-hidden py-12 sm:py-10"
    >
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="py-6 font-sans text-3xl font-semibold tracking-tight text-blue-600 sm:text-4xl"
          >
            {t("statistics.title")}
          </h2>
          <p className="mt-2 text-lg tracking-tight text-slate-700 dark:text-slate-200">
            {t("statistics.description")}
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-5 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          <li key="category">
            <ul role="list" className="flex flex-col gap-y-8">
              <DonutChart
                data={categories}
                legend={false}
                count={count}
                title={t("statistics.category")}
                range={range}
                domain={translatedCategoryDomain}
              ></DonutChart>
            </ul>
          </li>
          <li key="language">
            <ul role="list" className="flex flex-col gap-y-8">
              <DonutChart
                data={languages}
                legend={false}
                count={count}
                title={t("statistics.language")}
                range={languageRange}
                domain={translatedLanguageDomain}
              ></DonutChart>
            </ul>
          </li>
          <li key="platform">
            <ul role="list" className="flex flex-col gap-y-8">
              <DonutChart
                data={platforms}
                legend={false}
                count={count}
                title={t("statistics.platform")}
                range={range}
                domain={platformDomain}
              ></DonutChart>
            </ul>
          </li>
        </ul>
      </Container>
    </section>
  )
}
