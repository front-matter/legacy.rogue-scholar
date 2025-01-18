// import theme for prismjs to style code blocks
import "@/styles/globals.css"
import "prismjs/themes/prism-tomorrow.min.css"

import { ChakraBaseProvider, createLocalStorageManager } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AppProps } from "next/app"
import { Inter } from "next/font/google"
import { useRouter } from "next/router"
import { appWithTranslation, SSRConfig } from "next-i18next"
import PlausibleProvider from "next-plausible"

import { customTheme, defaultToastOptions } from "@/chakra-ui.config"
import ProgressBar from "@/components/layout/ProgressBar"

// import Inter font with next/font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

// Create a client
const queryClient = new QueryClient()

function App({
  Component,
  pageProps,
}: AppProps<{ initialSession?: Session | null } & SSRConfig>) {
  const router = useRouter()
  const colorModeManager = createLocalStorageManager("color-mode")

  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>
      <ProgressBar />

      <PlausibleProvider domain="rogue-scholar.org" trackFileDownloads={true}>
        <QueryClientProvider client={queryClient}>
          <ChakraBaseProvider
            theme={customTheme}
            colorModeManager={colorModeManager}
            toastOptions={{
              defaultOptions: defaultToastOptions,
            }}
          >
            <Component {...pageProps} />
          </ChakraBaseProvider>
        </QueryClientProvider>
      </PlausibleProvider>
    </>
  )
}

export default appWithTranslation(App)
