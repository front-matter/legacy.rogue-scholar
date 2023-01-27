import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import Image from 'next/image'
import Link from 'next/link'
import Icon from './public/icon.png'

const config: DocsThemeConfig = {
  logo: (
    <div className="nx-flex nx-justify-center nx-text-2xl nx-font-bold">
      <Image src={Icon} alt="Icon" width={18} className="mr-3" />
      <span style={{ marginLeft: '.4em', marginRight: '.2em', fontWeight: 700, color: 'rgb(37, 99, 235)' }}>The Rogue Scholar</span>Documentation
    </div>
  ),
  chat: {
    link: 'https://discord.gg/wJAxWjWU',
  },
  docsRepositoryBase: 'https://github.com/front-matter/docs/tree/main',
  footer: {
    text: 'The Rogue Scholar Documentation',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="The Rogue Scholar Documentation" />
      <meta
        property="og:description"
        content="Documentation for the Rogue Scholar website."
      />
    </>
  ),
}

export default config
