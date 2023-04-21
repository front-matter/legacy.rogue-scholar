import 'focus-visible'
import '../styles/tailwind.css'

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
