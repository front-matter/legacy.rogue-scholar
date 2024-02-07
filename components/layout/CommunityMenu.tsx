import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { useTranslation } from "next-i18next"

export default function CommunityMenu() {
  const { t } = useTranslation("common")

  return (
    <Menu>
      <MenuButton>{t("menu.community")}</MenuButton>
      <MenuList>
        <MenuItem
          as={Link}
          href="/board"
        >
          {t("menu.board")}
        </MenuItem>
        <MenuItem
          as={Link}
          href="https://blog.front-matter.io/tag/rogue-scholar/"
        >
          {t("menu.blog")}
        </MenuItem>
        <MenuItem
          as={Link}
          href="https://docs.rogue-scholar.org"
        >
          {t("menu.docs")}
        </MenuItem>
        <MenuItem
          as={Link}
          href="https://github.com/front-matter/rogue-scholar/discussions"
        >
          {t("menu.discussions")}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
