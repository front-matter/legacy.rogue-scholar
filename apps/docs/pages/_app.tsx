import PlausibleProvider from 'next-plausible'

export default function MyApp({ Component, pageProps }) {
  return (
    <PlausibleProvider domain="docs.rogue-scholar.org">
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}
