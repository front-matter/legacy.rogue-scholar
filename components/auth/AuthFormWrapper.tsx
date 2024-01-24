import {
  Box,
  Divider,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useTranslation } from "next-i18next"
import { PropsWithChildren, ReactElement } from "react"

import SocialSignInButton from "@/components/auth/SocialSignInButton"

interface Props {
  title: string
  description?: string | ReactElement
  showSocialAuth?: boolean
  redirectAfterSignin?: string
}

export default function AuthFormWrapper({
  title,
  description,
  children,
  showSocialAuth,
  redirectAfterSignin,
}: PropsWithChildren<Props>) {
  const { t } = useTranslation("auth")

  return (
    <VStack spacing={6} align="stretch">
      <Stack spacing={2}>
        <Heading fontSize="4xl">{title}</Heading>
        {description && <Text color="gray.500">{description}</Text>}
      </Stack>
      <Box>{children}</Box>

      {showSocialAuth && (
        <>
          <Divider my={8} />
          <Heading as="h4" fontSize="lg" mb={3}>
            {t("signin.continueWith")}
          </Heading>

          <SimpleGrid columns={2} gap={2}>
            <SocialSignInButton
              provider="google"
              redirectAfterSignin={redirectAfterSignin}
            />
            <SocialSignInButton
              provider="github"
              redirectAfterSignin={redirectAfterSignin}
            />
          </SimpleGrid>
        </>
      )}
    </VStack>
  )
}
