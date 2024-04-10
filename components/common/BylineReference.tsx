import Link from "next/link"
import { useTranslation } from "next-i18next"
import React, { Reference } from "react"

import { Author } from "@/components/common/Author"
import { ReferenceType } from "@/types/blog"

type Author = {
  name: string
  url?: string
}

type Props = {
  reference: ReferenceType
  
}

export const Byline: React.FunctionComponent<Props> = ({ reference }) => {
  const { t } = useTranslation("common")
  console.log(reference)

  return (
    <div className="text-base font-medium text-gray-500 dark:text-gray-200">
      {reference.date?.published && (
        <div data-cy="published">
          {t("posts.published")}{" "}
          <time dateTime={(reference.date?.published || "").toString()}>
            {t("posts.date_published", {
              val: new Date(reference.date?.published || ""),
              formatParams: {
                val: { year: "numeric", month: "long", day: "numeric" },
              },
            })}
          </time>
          {reference.container?.title && (
        <span data-cy="blog_name">
          {" "}
          in{" "}
          {reference.container?.identifierType === "URL" && (
            <Link
            className="font-semibold text-blue-600 hover:text-blue-800"
            href={reference.container?.identifier || "/"}
            >
              {reference.container?.title}
            </Link>
          )}
          {reference.container?.identifierType !== "URL" && (
            <span className="font-semibold">{reference.container?.title}</span>
          )}
        </span>
      )}
        </div>
      )}
      {!reference.date?.published && reference.date?.accessed && (
        <div data-cy="published">
          {t("posts.accessed")}{" "}
          <time dateTime={(reference.date?.accessed || "").toString()}>
            {t("posts.date_published", {
              val: new Date(reference.date?.accessed || ""),
              formatParams: {
                val: { year: "numeric", month: "long", day: "numeric" },
              },
            })}
          </time>
          {reference.container?.title && (
        <span data-cy="blog_name">
          {" "}
          in{" "}
          <Link
            className="font-semibold text-blue-600 hover:text-blue-800"
            href={reference.container?.identifier || "/"}
          >
            {reference.container?.title}
          </Link>
        </span>
      )}
        </div>
      )}
      {reference.contributors && reference.contributors.length > 0 && (
        <div>
          {t("posts.author", { count: reference.contributors.length })}{" "}
          {reference.contributors.map((contributor, index) => (
            <Author
              key={contributor.name}
              name={contributor.name || contributor.givenName + " " + contributor.familyName || ""}
              url={contributor.id}
              isLast={index === (reference.contributors && reference.contributors.length - 1)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
