import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
            <FontAwesomeIcon icon={['fab', 'orcid']} /> {name}
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
