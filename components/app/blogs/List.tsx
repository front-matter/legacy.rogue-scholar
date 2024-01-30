import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { useCallback, useState } from "react"

import BlogFormModal from "@/components/app/blogs/FormModal"
import { generateBlogSlug } from "@/lib/helpers"
import { Database } from "@/types/supabase"

type Blog = Database["public"]["Tables"]["blogs"]["Row"]

export default function BlogsList() {
  const supabaseClient = useSupabaseClient<Database>()
  const user = useUser() || { id: "" }
  const { t } = useTranslation("app")
  const formModal = useDisclosure()
  const [selectedBlog, setSelectedBlog] = useState<Blog>()
  const { data: blogs } = useQuery(
    ["blogs"],
    async () => {
      if (user?.id === process.env.NEXT_PUBLIC_SUPABASE_ADMIN_USER_ID) {
        const { data: blogs, error } = await supabaseClient
          .from("blogs")
          .select("*")
          .order("status", { ascending: true })
          .order("title", { ascending: true })

        if (error) throw new Error("Failed to fetch blogs")
        return blogs
      } else {
        const { data: blogs, error } = await supabaseClient
          .from("blogs")
          .select("*")
          .eq("user_id", user.id)
          .order("status", { ascending: true })
          .order("title", { ascending: true })

        if (error) throw new Error("Failed to fetch blogs")
        return blogs
      }
    }
  )
  const slug = generateBlogSlug()
  const newBlog = {
    slug: slug,
    title: "",
    home_page_url: "",
    feed_url: "",
    user_id: user?.id,
  }
  const tableBg = useColorModeValue("white", "gray.700")
  const tableBorderColor = useColorModeValue("gray.100", "gray.600")

  const openBlogForm = useCallback(
    (blog: Blog) => {
      setSelectedBlog(blog)
      formModal.onOpen()
    },
    [formModal, setSelectedBlog]
  )

  return (
    <>
      <HStack mb={4} justify="space-between">
        <Heading fontSize="2xl">{t("blogs.title")}</Heading>

        <Button
          size="sm"
          colorScheme="primary"
          leftIcon={<Icon icon="fa6-regular:square-plus" />}
          onClick={() => openBlogForm(newBlog)}
        >
          {t("blogs.createButton")}
        </Button>
      </HStack>
      <Box
        bg={tableBg}
        rounded="xl"
        border="1px solid "
        borderColor={tableBorderColor}
        w="full"
        maxW="full"
        overflow="auto"
      >
        <Table className="table-fixed">
          <Thead borderBottom="1px solid" borderColor={tableBorderColor}>
            <Tr>
              <Th className="w-4/12">{t("blogs.list.columns.title")}</Th>
              <Th className="w-6/12">
                {t("blogs.list.columns.home_page_url")}
              </Th>
              <Th className="w-2/12">{t("blogs.list.columns.mastodon")}</Th>
              <Th className="w-2/12">{t("blogs.list.columns.status")}</Th>
              <Th className="w-1/12"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {blogs && blogs.length > 0 ? (
              blogs?.map((blog) => (
                <Tr key={`blog-${blog.id}`}>
                  <Td>
                    {blog.title && blog.status !== "submitted" && (
                      <Link
                        className="hover:font-semibold"
                        href={`/blogs/${blog.slug}`}
                      >
                        {blog.title}
                      </Link>
                    )}
                    {blog.status == "submitted" && (
                      <span className="text-orange-600 dark:text-gray-200">
                        {blog.title}
                      </span>
                    )}
                    {!blog.title && (
                      <span className="text-orange-600 dark:text-gray-200">
                        {t("blogs.missing")}
                      </span>
                    )}
                  </Td>
                  <Td>
                    {blog.home_page_url && (
                      <Link
                        className="hover:font-semibold"
                        href={blog.home_page_url}
                        target="_blank"
                      >
                        {blog.home_page_url}
                      </Link>
                    )}
                    {!blog.home_page_url && (
                      <span className="text-orange-600 dark:text-gray-200">
                        {t("blogs.missing")}
                      </span>
                    )}
                    {!blog.slug && (
                      <span className="text-orange-600 dark:text-gray-200">
                        {t("blogs.untitled")}
                      </span>
                    )}
                  </Td>
                  <Td>
                    {blog.mastodon && (
                      <Link
                        className="hover:font-semibold"
                        href={blog.mastodon}
                        target="_blank"
                      >
                        <Icon icon="fa6-brands:mastodon" className="inline" />
                      </Link>
                    )}
                    {!blog.home_page_url && (
                      <span className="text-orange-600 dark:text-gray-200">
                        {t("blogs.missing")}
                      </span>
                    )}
                  </Td>
                  <Td>
                    {blog.status == "submitted" && (
                      <span className="text-orange-600 dark:text-gray-200">
                        {t("status." + blog.status)}
                      </span>
                    )}
                    {blog.status != "submitted" && (
                      <span className="text-gray-700 dark:text-gray-200">
                        {t("status." + blog.status)}
                      </span>
                    )}
                  </Td>
                  <Td>
                    <HStack justify="end" spacing={1}>
                      <IconButton
                        size="sm"
                        colorScheme="primary"
                        variant="ghost"
                        icon={<Icon icon="fa6-solid:pen-to-square" />}
                        aria-label={t("blogs.list.edit")}
                        onClick={() => openBlogForm(blog)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={99}>
                  <VStack textAlign="center" p={6}>
                    <Heading fontSize="lg">
                      {t("blogs.list.noResults")}
                    </Heading>
                    <Text opacity={0.5}>{t("blogs.list.empty")}</Text>
                  </VStack>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      <BlogFormModal
        blog={selectedBlog}
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
      />
    </>
  )
}
