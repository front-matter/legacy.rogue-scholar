import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  // Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { useCallback, useState } from "react"

import BlogFormModal from "@/components/app/blogs/FormModal"
import ConfirmModal from "@/components/app/ConfirmModal"
import { generateBlogSlug } from "@/lib/helpers"
import { Database } from "@/types/supabase"

type Blog = Database["public"]["Tables"]["blogs"]["Row"]

export default function BlogsList() {
  const supabaseClient = useSupabaseClient<Database>()
  const user = useUser() || { id: "" }
  const queryClient = useQueryClient()
  const { t } = useTranslation("app")
  const toast = useToast()
  const formModal = useDisclosure()
  const confirmModal = useDisclosure()
  const [selectedBlog, setSelectedBlog] = useState<Blog>()
  const { data: blogs, isLoading: loadingBlogs } = useQuery(
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

  // const openDeleteConfirm = useCallback(
  //   (blog: Blog |  ) => {
  //     setSelectedBlog(blog)
  //     confirmModal.onOpen()
  //   },
  //   [confirmModal, setSelectedBlog]
  // )

  const deleteBlogMutation = useMutation(
    async (id: string) => {
      if (!id) return
      const { error } = await supabaseClient.from("blogs").delete().eq("id", id)

      if (error) throw new Error("Could not delete blog")
    },
    {
      // reset blog after request
      onSettled: () => setSelectedBlog(blogs?.[0]),
      // show toast on error
      onError: () =>
        toast({
          status: "error",
          title: t("deleteBlog.errorMessage"),
        }),
      // show toast on success and refetch blogs
      onSuccess: () => {
        toast({
          status: "success",
          title: t("deleteBlog.successMessage"),
        })
        queryClient.invalidateQueries(["blogs"])
      },
    }
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
        {loadingBlogs && !blogs ? (
          <Stack w="full" p={4}>
            <Skeleton rounded="lg" height="24px" />
            <Skeleton rounded="lg" height="32px" />
            <Skeleton rounded="lg" height="32px" />
            <Skeleton rounded="lg" height="32px" />
          </Stack>
        ) : (
          <Table className="table-fixed">
            <Thead borderBottom="1px solid" borderColor={tableBorderColor}>
              <Tr>
                <Th className="w-4/12">{t("blogs.list.columns.title")}</Th>
                <Th className="w-8/12">
                  {t("blogs.list.columns.home_page_url")}
                </Th>
                <Th className="w-2/12">{t("blogs.list.columns.status")}</Th>
                <Th className="w-1/12"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {blogs && blogs.length > 0 ? (
                blogs?.map((blog) => (
                  <Tr key={`blog-${blog.id}`}>
                    <Td>
                      {blog.title && (
                        <Link
                          className="hover:font-semibold"
                          href={`/blogs/${blog.slug}`}
                        >
                          {blog.title}
                        </Link>
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
        )}
      </Box>
      <BlogFormModal
        blog={selectedBlog}
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
      />
      <ConfirmModal
        title={t("deleteBlogModal.title")}
        description={t("deleteBlogModal.description")}
        isDelete
        isOpen={confirmModal.isOpen}
        onClose={(confirmed) => {
          if (confirmed && selectedBlog?.id)
            deleteBlogMutation.mutate(selectedBlog.id)
          confirmModal.onClose()
        }}
      />
    </>
  )
}
