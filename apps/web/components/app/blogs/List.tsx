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
// import NoSubscriptionAlert from "@/components/app/blogs/NoSubscriptionAlert"
import ConfirmModal from "@/components/app/ConfirmModal"
import Loader from "@/components/common/Loader"
import { useUserPermissions } from "@/lib/blog/permissions"
import { generateBlogId } from "@/lib/helpers"
import { Database } from "@/types/supabase"

type Blog = Database["public"]["Tables"]["blogs"]["Row"]

export default function BlogsList() {
  const supabaseClient = useSupabaseClient<Database>()
  const user = useUser()
  const queryClient = useQueryClient()
  const { t } = useTranslation("app")
  const toast = useToast()
  const { loading: loadingPermissions } = useUserPermissions()
  const formModal = useDisclosure()
  const confirmModal = useDisclosure()
  const [selectedBlog, setSelectedBlog] = useState<null | Blog>(null)
  const { data: blogs, isLoading: loadingBlogs } = useQuery(
    ["blogs"],
    async () => {
      if (user?.id === process.env.NEXT_PUBLIC_SUPABASE_ADMIN_USER_ID) {
        const { data: blogs, error } = await supabaseClient
          .from("blogs")
          .select("*")
          .order("status", { ascending: true })

        if (error) throw new Error("Failed to fetch blogs")
        return blogs
      } else {
        const { data: blogs, error } = await supabaseClient
          .from("blogs")
          .select("*")
          .eq("user_id", user?.id)
          .order("status", { ascending: false })

        if (error) throw new Error("Failed to fetch blogs")
        return blogs
      }
    }
  )
  const newBlog = {
    id: generateBlogId(),
    title: "",
    feed_url: "",
    category: "naturalSciences",
    status: "submitted",
    use_mastodon: false,
    user_id: user?.id,
  }
  const tableBg = useColorModeValue("white", "gray.700")
  const tableBorderColor = useColorModeValue("gray.100", "gray.600")

  const openBlogForm = useCallback(
    (blog: Blog | null) => {
      setSelectedBlog(blog)
      formModal.onOpen()
    },
    [formModal, setSelectedBlog]
  )

  // const openDeleteConfirm = useCallback(
  //   (blog: Blog | null) => {
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
      onSettled: () => setSelectedBlog(null),
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

  return loadingPermissions ? (
    <Loader />
  ) : (
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
            <Skeleton rounded="lg" height="24px" />
            <Skeleton rounded="lg" height="32px" />
            <Skeleton rounded="lg" height="32px" />
          </Stack>
        ) : (
          <Table className="table-fixed">
            <Thead borderBottom="1px solid" borderColor={tableBorderColor}>
              <Tr>
                <Th className="w-6/12">{t("blogs.list.columns.title")}</Th>
                <Th className="w-3/12">{t("blogs.list.columns.mastodon")}</Th>
                <Th className="w-2/12">{t("blogs.list.columns.status")}</Th>
                <Th className="w-1/12"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {blogs && blogs.length > 0 ? (
                blogs?.map((blog) => (
                  <Tr key={`blog-${blog.id}`}>
                    <Td>
                      {blog.slug && (
                        <Link
                          className="hover:font-semibold"
                          href={`/blogs/${blog.slug}`}
                        >
                          <Icon
                            icon="fa6-regular:eye"
                            className="mr-1 inline"
                          />
                          {blog.title}
                        </Link>
                      )}
                      {!blog.slug && (
                        <span className="text-orange-600 dark:text-gray-200">
                          {t("blogs.untitled")}
                        </span>
                      )}
                    </Td>
                    <Td>
                      {blog.use_mastodon && (
                        <Link
                          className="hover:font-semibold"
                          href={`https://rogue-scholar.social/@${blog.slug}`}
                          target="_blank"
                        >
                          <Icon
                            icon="fa6-brands:mastodon"
                            className="mr-1 inline"
                          />
                          {blog.slug}
                        </Link>
                      )}
                    </Td>
                    <Td>{t("status." + blog.status)}</Td>
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
