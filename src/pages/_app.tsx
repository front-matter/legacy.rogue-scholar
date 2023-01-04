import PlausibleProvider from 'next-plausible'
import 'focus-visible'
import '@/styles/tailwind.css'
import { Inter } from '@next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return(
    <PlausibleProvider domain='rogue-scholar.org'>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </PlausibleProvider>
  )
}
