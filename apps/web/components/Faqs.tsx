// import Image from 'next/image'
import Link from 'next/link'

import { Container } from '../components/Container'

const faqs = [
  [
    {
      question: 'When does the Rogue Scholar launch?',
      answer:
        'The Rogue Scholar is available with limited functionality since April 1, 2023.',
    },
    {
      question:
        'When will the full functionality of the Rogue Scholar become available?',
      answer:
        'The full functionality (DOI and metadata registration, archiving of full-text content, and full-text search) will become available during the second quarter of 2023.',
    },
    {
      question: 'How can I sign up for the Rogue Scholar?',
      answer:
        'Fill out the form linked from page. We will add your blog to the Rogue Scholar and notify you within two business days.',
    },
    {
      question: 'Why would the Rogue Scholar not accept my blog?',
      answer:
        'We only cover blogs that write about science, and where the full-text content is made available via RSS feed and distributed under the terms of the Creative Commons Attribution (CC-BY) license.',
    },
    {
      question: 'Does the Rogue Scholar accept blogs about scholarship?',
      answer:
        'Yes. We accept blogs about all forms of scholarship. The term “science” is used in the broadest sense.',
    },
  ],
  [
    {
      question: 'What languages does the Rogue Scholar support?',
      answer:
        'The initial release will support English and German. Additional languages will be added based on user requests.',
    },
    {
      question: 'How does the Rogue Scholar archive my blog?',
      answer: 'We will harvest your content and metadata using your RSS feed.',
    },
    {
      question: 'What feed formats does the Rogue Scholar support?',
      answer:
        'We support feeds using RSS, Atom or JSON Feed. Contact us for support of custom extensions.',
    },
    {
      question: 'My RSS feed only contains summaries of blog posts.',
      answer:
        'You need to provide all content via RSS feed, but this can also be a private feed.',
    },
    {
      question: 'Does the Rogue Scholar support podcasts and vlogs?',
      answer:
        'Podcasts and vlogs are supported, but at an additional cost. Reach out to us via email.',
    },
  ],
  [
    {
      question: 'What does archiving my blog with the Rogue Scholar cost?',
      answer:
        'The Rogue Scholar is free for the first 50 posts per year. After that, it costs $1 per post.',
    },
    {
      question: 'When do I pay for my posts?',
      answer:
        'We will send you annual invoices for the posts we have archived in the previous year if there are more than 50 posts.',
    },
    {
      question: 'What costs are there for users of the Rogue Scholar?',
      answer:
        'The Rogue Scholar is and will always be free to use and reuse, all content is distributed under the terms of the Creative Commons Attribution (CC-BY) license.',
    },
    {
      question: 'Can I sponsor or otherwise support the Rogue Scholar?',
      answer:
        'We appreciate donations and other forms of support. Reach out to us via email.',
    },
  ],
]

export function Faqs() {
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
            className="font-display text-3xl tracking-tight text-blue-600 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-2 text-lg tracking-tight text-slate-700">
            If you can’t find what you’re looking for, go to our{' '}
            <Link
              href="https://docs.rogue-scholar.org"
              className="whitespace-nowrap border-b-0 font-semibold text-gray-700 hover:text-gray-400"
            >
              Documentation
            </Link>{' '}
            or reach out to support via the{' '}
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
                    <h3 className="font-display text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-0 text-sm text-slate-700">{faq.answer}</p>
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
