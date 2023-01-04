import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'When does The Rogue Scholar launch?',
      answer:
        'The Rogue Scholar launches in Q2 2003. The exact date will be announced at a later time.',
    },
    {
      question: 'How can I sign up for the Rogue Scholar?',
      answer:
        'Fill out the form on this page to be added to the waitlist. We will notify you when your blog is accepted to be archived on the Rogue Scholar.',
    },
    {
      question: 'Why would the Rogue Scholar not accept my blog?',
      answer: 'We only cover blogs that write about science, and where the full-text content is made available via RSS feed with a Creative Commons Attribution (CC-BY) license.',
    },
  ],
  [
    {
      question: 'How does the Rogue Scholar archive my blog?',
      answer:
        'We will harvest your content and metadata using your RSS feed.',
    },
    {
      question:
        'My RSS feed only contains summaries of blog posts.',
      answer:
        'You need to provide all content via RSS feed, but this can also be a private feed.',
    },
    {
      question:
        'What costs are there for users of the Rogue Scholar?',
      answer:
        'The Rogue Scholar is and will always be free to use and reuse, all content is distributed under the terms of the Creative Commons Attribution (CC-BY) license.',
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
      answer: 'We will send you annual invoices for the posts we have archived in the previous year if there are more than 50 posts.',
    },
    {
      question: 'What languages does the Rogue Scholar support?',
      answer: 'The initial release will support English and German. Additional languages will be added based on user requests.',
    },
    {
      question: 'Can I sponsor or otherwise support the Rogue Scholar?',
      answer: 'We appreciate donations and other forms of support. Reach out to us via email.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you can’t find what you’re looking for, reach out to support via the{' '}
            <Link href="https://discord.gg/HvbD4dNPFh" className="font-semibold border-b-0 text-gray-700 hover:text-gray-400 whitespace-nowrap">Front Matter Discord Forum</Link>.
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
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
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
