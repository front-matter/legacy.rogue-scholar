import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rogue Scholar",
  description:
    "The Rogue Scholar improves your science blog in important ways, including full-text search, long-term archiving, DOIs and metadata.",
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
