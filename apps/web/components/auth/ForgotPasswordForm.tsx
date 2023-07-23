import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
} from "@chakra-ui/react"
import { Icon } from "@iconify/react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import NextLink from "next/link"
import { useTranslation } from "next-i18next"
import { FormEvent } from "react"
import { useForm } from "react-hook-form"

import AuthFormWrapper from "@/components/auth/AuthFormWrapper"
import { useAuthRedirectUrl } from "@/lib/blog/auth"

function ForgotPasswordForm() {
  const supabaseClient = useSupabaseClient()
  const { t } = useTranslation("auth")
  const redirectTo = useAuthRedirectUrl(
    `/auth/callback?redirectAfterSignin=${encodeURIComponent(
      "/auth/reset-password"
    )}`
  )
  const { register, handleSubmit, formState, setError, clearErrors } = useForm<{
    email: string
    serverError?: void
  }>()
  const { isSubmitting, isSubmitted, isSubmitSuccessful } = formState

  const onSubmit = (e: FormEvent) => {
    clearErrors("serverError")
    handleSubmit(async ({ email }) => {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) {
        setError("serverError", { type: "manual", message: error.message })
      }
    })(e)
  }

  return (
    <AuthFormWrapper title={t("forgotPassword.pageTitle")}>
      <form onSubmit={onSubmit}>
        <Stack spacing={5}>
          {isSubmitted &&
            (isSubmitSuccessful ? (
              <Alert status="success" rounded="lg">
                <AlertIcon />
                <AlertTitle>{t("forgotPassword.linkSent")}</AlertTitle>
              </Alert>
            ) : (
              <Alert status="error" rounded="lg">
                <AlertIcon />
                <AlertTitle>{t("forgotPassword.errorMessage")}</AlertTitle>
              </Alert>
            ))}

          {(!isSubmitted || !isSubmitSuccessful) && (
            <>
              {/* Email field */}
              <FormControl>
                <FormLabel>{t("fields.email")}</FormLabel>
                <InputGroup>
                  <InputLeftElement color="gray.300">
                    <Icon icon="fa6-solid:at" />
                  </InputLeftElement>

                  <Input
                    type="email"
                    autoComplete="email"
                    {...register("email", {
                      required: true,
                    })}
                  />
                </InputGroup>
              </FormControl>

              {/* Submit button */}
              <Button
                colorScheme="primary"
                type="submit"
                isLoading={isSubmitting}
              >
                {t("forgotPassword.sendLink")}
              </Button>
            </>
          )}

          <Link as={NextLink} href="/auth/signin" color="primary.500">
            &larr; {t("backToSignIn")}
          </Link>
        </Stack>
      </form>
    </AuthFormWrapper>
  )
}

export default ForgotPasswordForm
