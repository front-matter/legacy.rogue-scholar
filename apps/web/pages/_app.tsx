import 'focus-visible'
import '../styles/tailwind.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { config, library } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false

import {
  faCreativeCommons,
  faCreativeCommonsBy,
  faDiscord,
  faGithub,
  faMastodon,
  faOrcid,
} from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(
  faOrcid,
  faGithub,
  faMastodon,
  faDiscord,
  faCreativeCommons,
  faCreativeCommonsBy,
  fas
)
config.autoAddCss = false

import { Analytics } from '@vercel/analytics/react'
import { Inter } from 'next/font/google'
import { appWithTranslation } from 'next-i18next'
import PlausibleProvider from 'next-plausible'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

function MyApp({ Component, pageProps }) {
  return (
    <PlausibleProvider domain="rogue-scholar.org">
      <main className={inter.className}>
        <Component {...pageProps} />
        <Analytics />
      </main>
    </PlausibleProvider>
  )
}
export default appWithTranslation(MyApp)
