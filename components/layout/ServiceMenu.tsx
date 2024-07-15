import {
  Menu,
  MenuButton,
  Divider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { useTranslation } from "next-i18next"

export default function ServiceMenu() {
  const { t } = useTranslation("common")

  return (
    <Menu>
      <MenuButton>{t("menu.service")}</MenuButton>
      <MenuList>
        <MenuItem
          as={Link}
          href="/about"
        >
          {t("menu.overview")}
        </MenuItem>
        <MenuItem
          as={Link}
          href="/about#faq"
        >
          {t("menu.faq")}
        </MenuItem>
        <MenuItem
          as={Link}
          href="/about#stats"
        >
          {t("menu.stats")}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
