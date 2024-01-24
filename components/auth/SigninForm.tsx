import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormHelperText,
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
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import { FormEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import AuthFormWrapper from "@/components/auth/AuthFormWrapper"
import SigninModeSwitch, {
  SigninMode,
} from "@/components/auth/SigninModeSwitch"
import Loader from "@/components/common/Loader"
import { redirectPath } from "@/config/auth"
import { useAuthRedirectUrl } from "@/lib/blog/auth"
import { invalidateNextRouterCache } from "@/lib/helpers"
import { Database } from "@/types/supabase"

function SigninForm() {
  const { t } = useTranslation("auth")
  const [mode, setMode] = useState<SigninMode>(SigninMode.MagicLink)
  const router = useRouter()
  const { query } = router

  const supabaseClient = useSupabaseClient<Database>()

  const redirectAfterSignin = query.redirectAfterSignin
    ? decodeURIComponent(query.redirectAfterSignin as string)
    : redirectPath

  const redirectTo = useAuthRedirectUrl(
    mode === SigninMode.MagicLink
      ? `/auth/callback?redirectAfterSignin=${encodeURIComponent(
          redirectAfterSignin
        )}`
      : redirectAfterSignin
  )

  const { register, handleSubmit, setError, clearErrors, formState, reset } =
    useForm<{
      email: string
      password?: string
      serverError?: void
    }>()
  const { isSubmitting, isSubmitted, isSubmitSuccessful } = formState

  const onSubmit = (e: FormEvent) => {
    clearErrors("serverError")
    handleSubmit(async ({ email, password }) => {
      const { error } =
        mode === SigninMode.Password && password
          ? await supabaseClient.auth.signInWithPassword({ email, password })
          : await supabaseClient.auth.signInWithOtp({
              email,
              options: {
                emailRedirectTo: redirectTo,
              },
            })

      if (error) {
        setError("serverError", {
          type: "invalidCredentials",
        })
        return
      }

      if (mode === SigninMode.Password) {
        invalidateNextRouterCache()
        await router.replace(redirectAfterSignin)
      }
    })(e)
  }

  useEffect(() => reset(), [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthFormWrapper
      title={t("signin.pageTitle")}
      description={
        <>
          {`${t("signin.description")} ${t("signin.noAccount")} `}
          <Link
            as={NextLink}
            href="/auth/signup"
            display="inline-block"
            color="primary.500"
          >
            {t("signin.signupButton")} &rarr;
          </Link>
        </>
      }
      showSocialAuth
      redirectAfterSignin={redirectAfterSignin}
    >
      <form onSubmit={onSubmit}>
        <Stack spacing={5} align="start">
          <SigninModeSwitch activeMode={mode} onChange={setMode} />

          {isSubmitted &&
            (isSubmitSuccessful ? (
              mode === SigninMode.Password ? (
                <div className="w-full">
                  <Loader />
                </div>
              ) : (
                <Alert status="success" rounded="lg">
                  <AlertIcon />
                  <AlertTitle>{t("signin.linkSent")}</AlertTitle>
                </Alert>
              )
            ) : (
              <Alert status="error" rounded="lg">
                <AlertIcon />
                <AlertTitle>{t("signin.errorMessage")}</AlertTitle>
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

              {/* Password field */}
              {mode === "password" && (
                <FormControl>
                  <FormLabel>{t("fields.password")}</FormLabel>
                  <InputGroup>
                    <InputLeftElement color="gray.300">
                      <Icon icon="fa6-solid:lock" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      autoComplete="password"
                      {...register("password", { required: true })}
                    />
                  </InputGroup>
                  <FormHelperText>
                    <Link
                      as={NextLink}
                      href="/auth/forgot-password"
                      color="primary.500"
                    >
                      {t("signin.forgotPassword")}
                    </Link>
                  </FormHelperText>
                </FormControl>
              )}

              {/* Submit button */}
              <Button
                w="full"
                colorScheme="primary"
                type="submit"
                isLoading={isSubmitting}
              >
                {mode === "password"
                  ? t("signin.submitButton")
                  : t("signin.sendLinkButton")}
              </Button>
            </>
          )}
        </Stack>
      </form>
    </AuthFormWrapper>
  )
}

export default SigninForm
