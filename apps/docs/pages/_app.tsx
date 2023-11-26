import PlausibleProvider from 'next-plausible'
import { AppProps } from "next/app"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain="docs.rogue-scholar.org">
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}
