import { Flex, useColorModeValue } from "@chakra-ui/react"
import Image from "next/image"
import Link from "next/link"

import Icon from "../../public/icon.png"

export default function Logo() {
  return (
    <Flex
      as={Link}
      href="/"
      fontSize="3xl"
      color={useColorModeValue("gray.800", "white")}
      align="center"
      lineHeight={1}
    >
      <div className="flex justify-center text-3xl font-bold text-blue-600">
        <Image src={Icon} alt="Icon" width={21} className="mr-3" /> The Rogue
        Scholar
      </div>
    </Flex>
  )
}
