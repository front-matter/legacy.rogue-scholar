import 'focus-visible'
import '../styles/tailwind.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  fab,
  faDiscord,
  faGithub,
  faMastodon,
  faOrcid,
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
library.add(fab, faOrcid, faGithub, faMastodon, faDiscord, faEnvelope)
config.autoAddCss = false

import { Inter } from 'next/font/google'
import PlausibleProvider from 'next-plausible'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
    <PlausibleProvider domain="rogue-scholar.org">
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </PlausibleProvider>
  )
}
