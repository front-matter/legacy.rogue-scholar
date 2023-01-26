import React from 'react'

// import { usePlausible } from 'next-plausible'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

export default function ErrorPage() {
  // const plausible = usePlausible()

  return (
    <>
      <Header />
      <div className="container mx-auto flex h-screen flex-wrap px-4 pt-16">
        <h1 className="text-red-500">404 Page Not Found</h1>
      </div>
      <main
        className="min-h-full bg-cover bg-top sm:bg-top"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75")',
        }}
      >
        <div className="mx-auto max-w-7xl py-16 px-6 text-center sm:py-24 lg:px-8 lg:py-48">
          <p className="text-base font-semibold text-black text-opacity-50">
            404
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Uh oh! I think you are lost.
          </h1>
          <p className="mt-2 text-lg font-medium text-black text-opacity-50">
            It looks like the page you are looking for doesn&apos;t exist.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="inline-flex items-center rounded-md border border-transparent bg-white bg-opacity-75 px-4 py-2 text-sm font-medium text-black text-opacity-75 sm:bg-opacity-25 sm:hover:bg-opacity-50"
            >
              Go back home
            </a>
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}
