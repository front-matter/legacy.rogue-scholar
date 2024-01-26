import { Icon } from "@iconify/react"
import Link from "next/link"
import React from "react"

import { isOrcid, isROR } from "@/lib/helpers"

type Props = {
  name: string
  url?: string
  isLast?: boolean
}

export const Author: React.FunctionComponent<Props> = ({
  name,
  url,
  isLast,
}) => {
  return (
    <>
      {url && isOrcid(url) && (
        <span>
          <Link
            href={url}
            target="_blank"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
          >
            {name}
            <Icon
              icon="fa-brands:orcid"
              className="ml-0.5 inline text-[#a6ce39]"
            />
          </Link>
          {isLast ? "" : ", "}
        </span>
      )}
      {url && isROR(url) && (
        <span>
          <Link
            href={url}
            target="_blank"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
          >
            {name}
            <Icon
              icon="academicons:ror"
              className="ml-0.5 inline text-[#2c2c2c]"
            />
          </Link>
          {isLast ? "" : ", "}
        </span>
      )}
      {!url && (
        <span className="text-gray-500 dark:text-gray-200">
          {name}
          {isLast ? "" : ", "}
        </span>
      )}
    </>
  )
}
