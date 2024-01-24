import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  VStack,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect } from "react"

import Menu from "@/components/layout/Menu"

export default function MobileDrawerMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()

  useEffect(() => onClose(), [router.asPath]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
      <DrawerContent>
        <DrawerCloseButton rounded="xl" opacity={0.5} />

        <DrawerBody px={8} py={12}>
          <VStack align="start" spacing={6}>
            <Menu mobileMode />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
