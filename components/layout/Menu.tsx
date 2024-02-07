import { Button, Stack, useColorModeValue } from "@chakra-ui/react"
import Link from "next/link"
import { useTranslation } from "next-i18next"

import { useMobileBreakpoint } from "@/lib/blog/layout"
import ServiceMenu from "@/components/layout/ServiceMenu"
import CommunityMenu from "@/components/layout/CommunityMenu"

export default function Menu({ mobileMode }: { mobileMode?: boolean }) {
  const { t } = useTranslation("common")
  const menuItemColor = useColorModeValue("gray.600", "gray.200")
  const isMobile = useMobileBreakpoint()
  const isHidden = isMobile !== !!mobileMode

  const menuItems = [
    {
      label: t("menu.posts"),
      link: "/",
    },
    {
      label: t("menu.blogs"),
      link: "/blogs",
    },
  ]

  return (
    <Stack
      hidden={isHidden}
      direction={mobileMode ? "column" : "row"}
      spacing={4}
      align={mobileMode ? "start" : "center"}
      data-cy="nav-menu"
    >
      {menuItems.map((item, i) => (
        <Button
          as={Link}
          key={i}
          href={item.link}
          fontSize={mobileMode ? "lg" : "base"}
          display="block"
          variant="link"
          fontWeight="normal"
          color={menuItemColor}
          data-cy="user-button"
        >
          {item.label}
        </Button>
      ))}
      <ServiceMenu />
      <CommunityMenu />
    </Stack>
  )
}
