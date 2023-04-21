import React from 'react'

import { Author } from '../components/Author'

type Author = {
  name: string
  url?: string
}

type Props = {
  authors?: Author[]
  datePublished?: string
}

export const Byline: React.FunctionComponent<Props> = ({
  authors,
  datePublished,
}) => {
  return (
    <div className="text-small text-gray-500">
      {authors && authors.length > 0 && (
        <div>
          {authors.map((author, index) => (
            <Author
              key={author.name}
              name={author.name}
              url={author.url}
              isLast={index === (authors && authors.length - 1)}
            />
          ))}
        </div>
      )}
      {datePublished && (
        <div>
          <time dateTime={datePublished.toString()}>
            {new Date(datePublished).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      )}
    </div>
  )
}
