import Image from 'next/image'
import Link from 'next/link'

import { Container } from '../components/Container'

export function Hero() {
  return (
    <Container className="pt-10 pb-16 text-center lg:pt-16">
      <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
        Science blogging{' '}
        <span className="relative whitespace-nowrap text-blue-600">
          <svg
            aria-hidden="true"
            viewBox="0 0 418 42"
            className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
            preserveAspectRatio="none"
          >
            <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
          </svg>
          <span className="relative">on steroids.</span>
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
        The Rogue Scholar improves your science blog in important ways,
        <br />
        including full-text search, DOIs and metadata, and long-term archiving.
      </p>
      <div className="mx-auto mt-10 max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Trusted by some of the most interesting science blogs
        </h2>
        <div className="mx-auto mt-6 grid max-w-lg grid-cols-6 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-6">
          <Link href="/blogs/n6x4a73">
            <Image
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="/logos/chris-hartgerink.png"
              alt="Chris Hartgerink"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/hjkgw43">
            <Image
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="/logos/flavours-openscience.png"
              alt="Flavours of Open Science"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/f0m0e38">
            <Image
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="/logos/front-matter.png"
              alt="Front Matter"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/3cxcm20">
            <Image
              className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
              src="/logos/ideas.png"
              alt="I.D.E.A.S."
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/2bzkh64">
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/irish-plants.png"
              alt="Irish Plants"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/h56tk29">
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/jabberwocky-ecology.png"
              alt="Jabberwocky Ecology"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/h49ct36">
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/liberate-science.png"
              alt="Liberate Science"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/h7bpg11">
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/oa-works.png"
              alt="OA Works"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/ez7c883">
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/publisherad.png"
              alt="Publisherad.medium.com"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/s1e9w75">
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/quantixed.png"
              alt="quantixed"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/gr1by89">
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/samuel-moore.png"
              alt="Samuel Moore"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/f4wdg32">
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/syldavia-gazette.png"
              alt="Syldavia Gazette"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/y55kq35">
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/syntaxus-baccata.png"
              alt="Syntaxus baccata"
              width={64}
              height={64}
            />
          </Link>
          <Link href="/blogs/pm0p222">
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="/logos/upstream.png"
              alt="Upstream"
              width={64}
              height={64}
            />
          </Link>
        </div>
      </div>
    </Container>
  )
}
