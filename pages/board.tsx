import Link from "next/link"
import { GetStaticProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import { Container } from "@/components/layout/Container"
import Layout from "@/components/layout/Layout"
import { Comments } from "@/components/common/Comments"

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common", "home"])),
    },
  }
}

export default function Board({ locale }) {
  const { t } = useTranslation("common")
  const members = [
    {
      name: "Juan Pablo Alperin",
      location: "Canada",
      blog: "Scholarly Communications Lab",
      url: "https://www.scholcommlab.ca/",
    },
    {
      name: "Chiara Di Giambattista",
      location: "Italy",
      blog: "OpenCitations Blog",
      url: "https://opencitations.hypotheses.org/",
    },
    {
      name: "Mareike König",
      location: "France",
      blog: "Digital Humanities am DHIP",
      url: "https://dhdhi.hypotheses.org/",
    },
    {
      name: "Heinz Pampel",
      location: "Germany",
      blog: "wisspub.net",
      url: "https://wisspub.net/",
    },
    {
      name: "Henry Rzepa",
      location: "United Kingdom",
      blog: "Henry Rzepa's Blog",
      url: "https://www.ch.imperial.ac.uk/rzepa/blog",
    },
    {
      name: "Maëlle Salmon",
      location: "France",
      blog: "rOpenSci Blog",
      url: "https://masalmon.eu/post/",
    },
  ]
  return (
    <Layout>
      <div className="bg-white py-4">
        <div className="mx-auto grid max-w-7xl gap-x-8 xl:gap-y-8 px-8 xl:px-8 xl:grid-cols-3">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("menu.board")}
            </h2>
            <p className="mt-3 text-base text-gray-600">
              {t("board.goal")}
            </p>
            <p className="mt-3 text-base text-gray-600">
              {t("board.schedule")}
            </p>
          </div>
          <ul
            role="list"
            className="grid mt-4 xl:mt-12 gap-x-8 gap-y-4 sm:grid-cols-2 sm:gap-y-6 xl:col-span-2"
          >
            {members.map((member) => (
              <li key={member.name}>
                <div className="flex items-center gap-x-6">
                  <div>
                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                      {member.name}
                    </h3>
                    <Link
                      href={member.url}
                      target="_blank"
                      className="font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {member.blog}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Container className="pb-5 pt-2 text-center xl:pt-5">
        <Comments locale={locale} />
      </Container>
    </Layout>
  )
}
