import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"

import { Blogs } from "@/components/common/Blogs"
import Layout from "@/components/layout/Layout"
import { blogsSelect, supabase } from "@/lib/supabaseClient"

export async function getServerSideProps(ctx) {
  const { data, error } = await supabase
    .from("blogs")
    .select(blogsSelect)
    .in("status", ["approved", "active", "archived"])
    .order("title", { ascending: true })

  if (error) {
    console.log(error)
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common", "app", "home"])),
      blogs: data,
    },
  }
}

type Props = {
  blogs: any
}

const BlogsPage: React.FunctionComponent<Props> = ({ blogs }) => {
  const { t } = useTranslation("common")

  return (
    <>
      <Layout>
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("posts.blogs")}
          </h2>
        </div>
        <Blogs blogs={blogs} />
      </Layout>
    </>
  )
}

export default BlogsPage
