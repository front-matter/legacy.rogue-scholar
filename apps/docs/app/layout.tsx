import PlausibleProvider from 'next-plausible'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <PlausibleProvider domain="docs.rogue-scholar.org" />
      </head>
      <body>{children}</body>
    </html>
  )
}
