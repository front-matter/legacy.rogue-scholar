import { Icon } from "@iconify/react"
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import Layout from "@/components/layout/Layout"

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common"])),
    },
  }
}

export default function ErrorPage() {
  const { t } = useTranslation("common")

  return (
    <Layout>
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="grid items-center gap-4 py-12 text-center">
          <Icon
            icon="fa6-solid:magnifying-glass"
            className="mx-auto text-7xl text-primary-200"
          />
          <h1 className="text-5xl font-bold">{t("pageNotFound.title")}</h1>
          <p className="opacity-50">{t("pageNotFound.description")}</p>
        </div>
      </div>
    </Layout>
  )
}
