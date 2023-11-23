import React from 'react'
import Image from 'next/image'
import Icon from './public/icon.png'

const config = {
  logo: (
    <div className="nx-flex nx-justify-center nx-text-2xl">
      <Image src={Icon} alt="Icon" width={18} />
      <span
        style={{
          marginLeft: '.4em',
          marginRight: '.2em',
          fontWeight: 700,
          color: 'rgb(37, 99, 235)',
        }}
      >
        The Rogue Scholar
      </span>
      Documentation
    </div>
  ),
  logoLink: 'https://rogue-scholar.org',
  project: {
    link: 'https://github.com/front-matter/rogue-scholar',
  },
  docsRepositoryBase: 'https://github.com/front-matter/rogue-scholar/apps/docs',
  footer: {
    text: 'Rogue Scholar Documentation',
  },
}

export default config
