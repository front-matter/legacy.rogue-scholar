import { Icon } from '@iconify/react'
import Link from 'next/link'
import React from 'react'

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
      {url ? (
        <span>
          <Link href={url} className="text-gray-500">
            {name}
            <Icon
              icon="fa-brands:orcid"
              className="ml-0.5 inline text-[#a6ce39]"
            />
          </Link>
          {isLast ? '' : ', '}
        </span>
      ) : (
        <span className="text-gray-500">
          {name}
          {isLast ? '' : ', '}
        </span>
      )}
    </>
  )
}
