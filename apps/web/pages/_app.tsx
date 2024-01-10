// import theme for prismjs to style code blocks
import "@/styles/globals.css"
import "prismjs/themes/prism-tomorrow.min.css"

import { ChakraBaseProvider, createLocalStorageManager } from "@chakra-ui/react"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AppProps } from "next/app"
import { Inter } from "next/font/google"
import { useRouter } from "next/router"
import { appWithTranslation, SSRConfig } from "next-i18next"
import PlausibleProvider from "next-plausible"
import { useEffect, useState } from "react"

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
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const colorModeManager = createLocalStorageManager("color-mode")

  // redirect to signin page if user is signed out while being on a protected page
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_OUT" &&
        (router.asPath.startsWith("/app") ||
          router.asPath.startsWith("/account"))
      )
        router.replace("/auth/signin")
    })

    return () => subscription.unsubscribe()
  }, [supabaseClient.auth, router.asPath]) // eslint-disable-line react-hooks/exhaustive-deps

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
            <SessionContextProvider
              supabaseClient={supabaseClient}
              initialSession={pageProps.initialSession}
            >
              <Component {...pageProps} />
            </SessionContextProvider>
          </ChakraBaseProvider>
        </QueryClientProvider>
      </PlausibleProvider>
    </>
  )
}

export default appWithTranslation(App)
