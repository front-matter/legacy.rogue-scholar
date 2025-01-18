import {
  Box,
  Button,
  Container,
  HStack,
  IconButton,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { useTranslation } from "next-i18next"
import { useEffect } from "react"

import ColorModeSwitch from "@/components/common/ColorModeSwitch"
import { KofiButton } from "@/components/common/KofiButton"
import LanguageSwitch from "@/components/common/LanguageSwitch"
import Logo from "@/components/layout/Logo"
import Menu from "@/components/layout/Menu"
import MobileDrawerMenu from "@/components/layout/MobileDrawerMenu"

import { useMobileBreakpoint, useScrollTop } from "../../lib/blog/layout"

export default function NavBar({ hideMenu }: { hideMenu?: boolean }) {
  const { t } = useTranslation("common")
  const mobileDrawerDisclosure = useDisclosure()
  const isMobile = useMobileBreakpoint()
  const isTop = useScrollTop()
  const bgColor = useColorModeValue("white", "gray.900")

  useEffect(() => {
    if (!isMobile && mobileDrawerDisclosure.isOpen)
      mobileDrawerDisclosure.onClose()
  }, [isMobile, mobileDrawerDisclosure])

  return (
    <>
      <Box
        position="fixed"
        inset={0}
        bottom="auto"
        h={20}
        as="nav"
        bg={isTop ? "transparent" : bgColor}
        px={4}
        py={6}
        shadow={isTop ? "none" : "sm"}
        zIndex={99}
      >
        <Container maxW="7xl">
          <HStack spacing={8} justify="space-between">
            <HStack spacing={6}>
              <Logo />
              {!hideMenu && <Menu />}
            </HStack>

            <HStack spacing={4}>
              <HStack>
                <KofiButton
                  username="rogue_scholar"
                  title="Buy me a coffee"
                  label="Buy me a coffee"
                />
                <LanguageSwitch />
                <ColorModeSwitch />
              </HStack>
              {!hideMenu && isMobile && (
                <IconButton
                  aria-label={t("menu.title")}
                  variant="outline"
                  onClick={mobileDrawerDisclosure.onToggle}
                >
                  <Icon icon="fa6-solid:bars" />
                </IconButton>
              )}
            </HStack>
          </HStack>
        </Container>
      </Box>
      <MobileDrawerMenu {...mobileDrawerDisclosure} />
    </>
  )
}
