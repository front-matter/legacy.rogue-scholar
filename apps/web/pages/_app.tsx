import 'focus-visible'
import '../styles/tailwind.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  fab,
  faCreativeCommons,
  faCreativeCommonsBy,
  faDiscord,
  faGithub,
  faMastodon,
  faOrcid,
} from '@fortawesome/free-brands-svg-icons'
import {
  faCopyright,
  faDownload,
  faEnvelope,
  faEyeSlash,
  faHouse,
  faRss,
} from '@fortawesome/free-solid-svg-icons'
library.add(
  fab,
  faOrcid,
  faGithub,
  faMastodon,
  faDiscord,
  faCreativeCommons,
  faCreativeCommonsBy,
  faEnvelope,
  faRss,
  faHouse,
  faCopyright,
  faEyeSlash,
  faDownload
)
config.autoAddCss = false

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
      </main>
    </PlausibleProvider>
  )
}
export default appWithTranslation(MyApp)
