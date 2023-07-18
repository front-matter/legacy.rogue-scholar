import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "next-i18next"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Database } from "@/types/supabase"

export default function BlogFormModal({
  blog,
  isOpen,
  onClose,
}: {
  blog: null | any
  isOpen: boolean
  onClose: () => void
}) {
  const supabaseClient = useSupabaseClient<Database>()
  const queryClient = useQueryClient()
  const headerBg = useColorModeValue("gray.50", "gray.600")
  const { t } = useTranslation("app")
  const toast = useToast()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<{
    id: string
    title: string
    feed_url: string
    favicon: string
    category: string
    status: string
    user_id: string
  }>()

  // when the modal is closed, reset the form
  useEffect(() => {
    if (!blog) {
      reset()
      return
    }

    setValue("id", blog.id)
    setValue("title", blog.title)
    setValue("feed_url", blog.feed_url)
    setValue("favicon", blog.favicon)
    setValue("category", blog.category)
    setValue("status", blog.status)
    setValue("user_id", blog.user_id)
  }, [blog]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  const upsertMutation = useMutation(
    async (blog: Database["public"]["Tables"]["blogs"]["Insert"]) => {
      const { error } = await supabaseClient
        .from("blogs")
        .upsert(blog, { onConflict: "id", ignoreDuplicates: false })

      console.log(error)
      if (error) throw new Error("Could not upsert blog")

      // update blog entry based on feed metadata
      await fetch(`/api/blogs/${blog.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`,
        },
      })
    },
    {
      onError: () => {
        toast({
          status: "error",
          position: "top",
          description: t("blogs.form.errorMessage"),
        })

        throw new Error("Could not upsert blog")
      },
      onSuccess: () => {
        toast({
          status: "success",
          position: "top",
          description: t("blogs.form.successMessage"),
        })

        // refetch blogs
        queryClient.invalidateQueries(["blogs"])

        onClose()
      },
    }
  )

  const onSubmit = handleSubmit(async (values) => {
    await upsertMutation.mutateAsync({
      ...values,
      id: (blog as any)?.id || undefined,
    })
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      scrollBehavior="inside"
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg={headerBg} roundedTop="lg" px={8}>
          {blog ? t("blogs.form.edit.title") : t("blogs.form.add.title")}
        </ModalHeader>
        <ModalCloseButton top={4} right={6} />
        <ModalBody>
          <p>{t("agreementModal.1")}</p>
          <p>{t("agreementModal.2")}</p>
          {/*eslint-disable-next-line no-empty-function */}
          <form onSubmit={(e) => onSubmit(e).catch(() => {})}>
            <VStack align="stretch" spacing={6} mt={2}>
              {/* Feed URL field */}
              <FormControl isRequired>
                <FormLabel>{t("blogs.form.controls.feed_url")}</FormLabel>
                <Input
                  type="text"
                  {...register("feed_url", { required: true })}
                />
              </FormControl>

              {/* favicon field */}
              <FormControl>
                <FormLabel>{t("blogs.form.controls.favicon")}</FormLabel>
                <Input
                  type="text"
                  {...register("favicon", { required: false })}
                />
              </FormControl>

              {/* Category field */}
              <FormControl isRequired>
                <FormLabel>{t("blogs.form.controls.category")}</FormLabel>
                <Select {...register("category", { required: true })}>
                  <option value="naturalSciences">
                    {t("categories.naturalSciences")}
                  </option>
                  <option value="engineeringAndTechnology">
                    {t("categories.engineeringAndTechnology")}
                  </option>
                  <option value="medicalAndHealthSciences">
                    {t("categories.medicalAndHealthSciences")}
                  </option>
                  <option value="agriculturalSciences">
                    {t("categories.agriculturalSciences")}
                  </option>
                  <option value="socialSciences">
                    {t("categories.socialSciences")}
                  </option>
                  <option value="humanities">
                    {t("categories.humanities")}
                  </option>
                </Select>
              </FormControl>

              <Button
                type="submit"
                colorScheme="primary"
                isLoading={isSubmitting}
              >
                {t("blogs.form.submitButton")}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
