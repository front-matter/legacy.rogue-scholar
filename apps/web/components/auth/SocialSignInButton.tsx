import { Box, Button } from "@chakra-ui/react"
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { Icon } from "@iconify/react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Provider } from "@supabase/supabase-js"
import { darken } from "color2k"
import { useTranslation } from "next-i18next"
import { useCallback, useMemo } from "react"

import { redirectPath } from "@/config/auth"
import { useAuthRedirectUrl } from "@/lib/blog/auth"

export default function SocialSignInButton({
  provider,
  redirectAfterSignin,
}: {
  provider: Provider
  redirectAfterSignin?: string
}) {
  const supabaseClient = useSupabaseClient()
  const { t } = useTranslation("auth")
  const redirectTo = useAuthRedirectUrl(
    `/auth/callback?redirectAfterSignin=${encodeURIComponent(
      redirectAfterSignin ?? redirectPath
    )}`
  )

  const providers = useMemo<
    Partial<
      Record<
        Provider,
        {
          name: string
          color: string
          icon?: ReactJSXElement
        }
      >
    >
  >(
    () => ({
      google: {
        name: t("providers.google"),
        icon: <Icon icon="fa6-brands:google" />,
        color: "#4285F4",
      },
      apple: {
        name: t("providers.apple"),
        icon: <Icon icon="fa6-brands:apple" />,
        color: "#000",
      },
      facebook: {
        name: t("providers.facebook"),
        icon: <Icon icon="fa6-brands:facebook" />,
        color: "#3b5998",
      },
      twitter: {
        name: t("providers.twitter"),
        icon: <Icon icon="fa6-brands:twitter" />,
        color: "#1DA1F2",
      },
      github: {
        name: t("providers.github"),
        icon: <Icon icon="fa6-brands:github" />,
        color: "#222",
      },
      azure: {
        name: t("providers.azure"),
        icon: <Icon icon="fa6-brands:microsoft" />,
        color: "#0078d4",
      },
      bitbucket: {
        name: t("providers.bitbucket"),
        icon: <Icon icon="fa6-brands:bitbucket" />,
        color: "#205081",
      },
      linkedin: {
        name: t("providers.linkedin"),
        icon: <Icon icon="fa6-brands:linkedin" />,
        color: "#0077b5",
      },
      discord: {
        name: t("providers.discord"),
        icon: <Icon icon="fa6-brands:discord" />,
        color: "#7289DA",
      },
      gitlab: {
        name: t("providers.gitlab"),
        icon: <Icon icon="fa6-brands:gitlab" />,
        color: "#f39c12",
      },
      notion: {
        name: t("providers.notion"),
        icon: <Icon icon="simple-icons:notion" />,
        color: "#000",
      },
      slack: {
        name: t("providers.slack"),
        icon: <Icon icon="fa6-brands:slack" />,
        color: "#2eb886",
      },
      spotify: {
        name: t("providers.spotify"),
        icon: <Icon icon="fa6-brands:spotify" />,
        color: "#1db954",
      },
      twitch: {
        name: t("providers.twitch"),
        icon: <Icon icon="fa6-brands:twitch" />,
        color: "#6441a5",
      },
      workos: {
        name: t("providers.workos"),
        icon: <Icon icon="logos:workos-icon" />,
        color: "#6363f1",
      },
    }),
    [t]
  )

  const providerData = useMemo(() => providers[provider], [provider, providers])

  const signIn = useCallback(
    () =>
      supabaseClient.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      }),
    [provider, redirectTo, supabaseClient.auth]
  )

  if (!providerData) {
    return null
  }

  return (
    <Button
      width="full"
      colorScheme="gray"
      bg={providerData.color}
      color="white"
      _hover={{ bg: darken(providerData.color, 0.05) }}
      _focus={{ bg: darken(providerData.color, 0.1) }}
      onClick={signIn}
    >
      {providerData.icon && (
        <Box fontSize="125%" mr={2}>
          {providerData.icon}
        </Box>
      )}
      {providerData.name}
    </Button>
  )
}
