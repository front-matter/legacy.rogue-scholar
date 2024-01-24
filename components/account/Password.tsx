import { Button } from "@chakra-ui/react"
import Link from "next/link"
import { useTranslation } from "next-i18next"

import AccountSection from "@/components/account/AccountSection"

function Password() {
  const { t } = useTranslation("account")

  return (
    <AccountSection title={t("password")}>
      <Button
        as={Link}
        href="/auth/reset-password"
        variant="outline"
        colorScheme="primary"
      >
        {t("changeMyPassword")} &rarr;
      </Button>
    </AccountSection>
  )
}
export default Password
