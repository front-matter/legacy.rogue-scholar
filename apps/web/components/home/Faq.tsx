import Link from "next/link"
import { useTranslation } from "next-i18next"

import { Container } from "@/components/layout/Container"

export default function Faqs() {
  const { t } = useTranslation("home")

  const faqs = [
    [
      {
        question: t("faq.questions.1"),
        answer: t("faq.answers.1"),
      },
      {
        question: t("faq.questions.2"),
        answer: t("faq.answers.2"),
      },
      {
        question: t("faq.questions.3"),
        answer: t("faq.answers.3"),
      },
      {
        question: t("faq.questions.4"),
        answer: t("faq.answers.4"),
      },
    ],
    [
      {
        question: t("faq.questions.5"),
        answer: t("faq.answers.5"),
      },
      {
        question: t("faq.questions.6"),
        answer: t("faq.answers.6"),
      },
      {
        question: t("faq.questions.7"),
        answer: t("faq.answers.7"),
      },
      {
        question: t("faq.questions.8"),
        answer: t("faq.answers.8"),
      },
    ],
    [
      {
        question: t("faq.questions.9"),
        answer: t("faq.answers.9"),
      },
      {
        question: t("faq.questions.10"),
        answer: t("faq.answers.10"),
      },
      {
        question: t("faq.questions.11"),
        answer: t("faq.answers.11"),
      },
      {
        question: t("faq.questions.12"),
        answer: t("faq.answers.12"),
      },
    ],
  ]

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden py-10 sm:py-16"
    >
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="py-6 font-sans text-3xl font-semibold tracking-tight text-blue-600 sm:text-4xl"
          >
            {t("faq.title")}
          </h2>
          <p className="mt-2 text-lg tracking-tight text-slate-700">
            {t("faq.more")}{" "}
            <Link
              href="https://docs.rogue-scholar.org"
              className="whitespace-nowrap border-b-0 font-semibold text-gray-700 hover:text-gray-400"
            >
              Documentation
            </Link>{" "}
            {t("faq.support")}{" "}
            <Link
              href="https://discord.gg/HvbD4dNPFh"
              className="whitespace-nowrap border-b-0 font-semibold text-gray-700 hover:text-gray-400"
            >
              Rogue Scholar Discord Forum
            </Link>
            .
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-sans text-lg font-semibold leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-0 font-serif text-base text-slate-700">
                      {faq.answer}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
