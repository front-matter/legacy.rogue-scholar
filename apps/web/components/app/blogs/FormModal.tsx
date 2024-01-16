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
  // Switch,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "next-i18next"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { CheckIcon } from "@/components/home/Pricing"
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
  const { t } = useTranslation(["app", "common"])
  const toast = useToast()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<{
    id: string
    slug: string
    title: string
    feed_url: string
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
    setValue("slug", blog.slug)
    setValue("title", blog.title)
    setValue("feed_url", blog.feed_url)
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
        .upsert(blog, { onConflict: "slug", ignoreDuplicates: false })

      console.log(error)
      if (error) throw new Error("Could not upsert blog")
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
      <ModalContent minWidth="800px">
        <ModalHeader bg={headerBg} roundedTop="lg" px={8}>
          {blog && blog.feed_url
            ? t("blogs.form.edit.title")
            : t("blogs.form.add.title")}
        </ModalHeader>
        <ModalCloseButton top={4} right={6} />
        <ModalBody>
          <div>
            <p className="mb-2 text-base font-semibold">
              {t("terms.description")}
            </p>
            <ul
              role="list"
              className="order-last my-2 flex flex-col gap-y-1 text-base"
            >
              <li className="flex">
                <CheckIcon className="text-green-600" />
                <span className="ml-1">{t("terms.1")}</span>
              </li>
              <li className="flex">
                <CheckIcon className="text-green-600" />
                <span className="ml-1">{t("terms.2")}</span>
              </li>
              <li className="flex">
                <CheckIcon className="text-green-600" />
                <span className="ml-1">{t("terms.3")}</span>
              </li>
              <li className="flex">
                <CheckIcon className="text-green-600" />
                <span className="ml-1">{t("terms.4")}</span>
              </li>
            </ul>
          </div>
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

              {/* Category field */}
              <FormControl isRequired>
                <FormLabel>{t("blogs.form.controls.category")}</FormLabel>
                <Select {...register("category", { required: true })}>
                  <option value="naturalSciences">
                    {t("categories.naturalSciences", { ns: "common" })}
                  </option>
                  <option value="mathematics">
                    {t("categories.mathematics", { ns: "common" })}
                  </option>
                  <option value="computerAndInformationSciences">
                    {t("categories.computerAndInformationSciences", {
                      ns: "common",
                    })}
                  </option>
                  <option value="physicalSciences">
                    {t("categories.physicalSciences", { ns: "common" })}
                  </option>
                  <option value="chemicalSciences">
                    {t("categories.chemicalSciences", { ns: "common" })}
                  </option>
                  <option value="earthAndRelatedEnvironmentalSciences">
                    {t("categories.earthAndRelatedEnvironmentalSciences", {
                      ns: "common",
                    })}
                  </option>
                  <option value="biologicalSciences">
                    {t("categories.biologicalSciences", { ns: "common" })}
                  </option>
                  <option value="otherNaturalSciences">
                    {t("categories.otherNaturalSciences", { ns: "common" })}
                  </option>
                  <option value="engineeringAndTechnology">
                    {t("categories.engineeringAndTechnology", { ns: "common" })}
                  </option>
                  <option value="civilEngineering">
                    {t("categories.civilEngineering", { ns: "common" })}
                  </option>
                  <option value="eletricalEngineering">
                    {t("categories.eletricalEngineering", { ns: "common" })}
                  </option>
                  <option value="mechanicalEngineering">
                    {t("categories.mechanicalEngineering", { ns: "common" })}
                  </option>
                  <option value="chemicalEngineering">
                    {t("categories.chemicalEngineering", { ns: "common" })}
                  </option>
                  <option value="materialsEngineering">
                    {t("categories.materialsEngineering", { ns: "common" })}
                  </option>
                  <option value="medicalEngineering">
                    {t("categories.medicalEngineering", { ns: "common" })}
                  </option>
                  <option value="environmentalEngineering">
                    {t("categories.environmentalEngineering", { ns: "common" })}
                  </option>
                  <option value="industrialBiotechnology">
                    {t("categories.industrialBiotechnology", { ns: "common" })}
                  </option>
                  <option value="nanotechnology">
                    {t("categories.nanotechnology", { ns: "common" })}
                  </option>
                  <option value="otherEngineeringAndTechnologies">
                    {t("categories.otherEngineeringAndTechnologies", {
                      ns: "common",
                    })}
                  </option>
                  <option value="medicalAndHealthSciences">
                    {t("categories.medicalAndHealthSciences", { ns: "common" })}
                  </option>
                  <option value="basicMedicine">
                    {t("categories.basicMedicine", { ns: "common" })}
                  </option>
                  <option value="clinicalMedicine">
                    {t("categories.clinicalMedicine", { ns: "common" })}
                  </option>
                  <option value="healthSciences">
                    {t("categories.healthSciences", { ns: "common" })}
                  </option>
                  <option value="medicalBiotechnology">
                    {t("categories.medicalBiotechnology", { ns: "common" })}
                  </option>
                  <option value="otherMedicalSciences">
                    {t("categories.otherMedicalSciences", { ns: "common" })}
                  </option>
                  <option value="agriculturalSciences">
                    {t("categories.agriculturalSciences", { ns: "common" })}
                  </option>
                  <option value="agricultureForestryFisheries">
                    {t("categories.agricultureForestryFisheries", {
                      ns: "common",
                    })}
                  </option>
                  <option value="animalDairyScience">
                    {t("categories.animalDairyScience", { ns: "common" })}
                  </option>
                  <option value="veterinaryScience">
                    {t("categories.veterinaryScience", { ns: "common" })}
                  </option>
                  <option value="agriculturalBiotechnology">
                    {t("categories.agriculturalBiotechnology", {
                      ns: "common",
                    })}
                  </option>
                  <option value="otherAgriculturalSciences">
                    {t("categories.otherAgriculturalSciences", {
                      ns: "common",
                    })}
                  </option>
                  <option value="socialSciences">
                    {t("categories.socialSciences", { ns: "common" })}
                  </option>
                  <option value="psychology">
                    {t("categories.psychology", { ns: "common" })}
                  </option>
                  <option value="economicsAndBusiness">
                    {t("categories.economicsAndBusiness", { ns: "common" })}
                  </option>
                  <option value="educationalSciences">
                    {t("categories.educationalSciences", { ns: "common" })}
                  </option>
                  <option value="sociology">
                    {t("categories.sociology", { ns: "common" })}
                  </option>
                  <option value="law">
                    {t("categories.law", { ns: "common" })}
                  </option>
                  <option value="politicalScience">
                    {t("categories.politicalScience", { ns: "common" })}
                  </option>
                  <option value="socialAndEconomicGeography">
                    {t("categories.socialAndEconomicGeography", {
                      ns: "common",
                    })}
                  </option>
                  <option value="mediaAndCommunications">
                    {t("categories.mediaAndCommunications", { ns: "common" })}
                  </option>
                  <option value="otherSocialSciences">
                    {t("categories.otherSocialSciences", { ns: "common" })}
                  </option>
                  <option value="humanities">
                    {t("categories.humanities", { ns: "common" })}
                  </option>
                  <option value="philosophyEthicsAndReligion">
                    {t("categories.philosophyEthicsAndReligion", {
                      ns: "common",
                    })}
                  </option>
                  <option value="historyAndArchaeology">
                    {t("categories.historyAndArchaeology", { ns: "common" })}
                  </option>
                  <option value="languagesAndLiterature">
                    {t("categories.languagesAndLiterature", { ns: "common" })}
                  </option>
                  <option value="arts">
                    {t("categories.arts", { ns: "common" })}
                  </option>
                  <option value="otherHumanities">
                    {t("categories.otherHumanities", { ns: "common" })}
                  </option>
                </Select>
              </FormControl>

              {/* Mastodon enabled field
              <FormControl>
                <FormLabel htmlFor="use_mastodon">
                  {t("blogs.form.controls.mastodon")}
                </FormLabel>
                <Switch id="use_mastodon" isDisabled={true} isChecked={false} />
              </FormControl> */}

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
