import { IconButton, useColorMode } from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { useTranslation } from "next-i18next"

export default function ColorModeSwitch() {
  const { t } = useTranslation("common")
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      size="sm"
      aria-label={
        colorMode === "light" ? t("colorMode.dark") : t("colorMode.light")
      }
      icon={
        colorMode === "light" ? (
          <Icon icon="fa6-solid:moon" />
        ) : (
          <Icon icon="fa6-solid:sun" />
        )
      }
      onClick={toggleColorMode}
      variant="ghost"
    ></IconButton>
  )
}
