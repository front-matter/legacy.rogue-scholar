import Image from 'next/image'
import Link from 'next/link'

import Icon from '../images/icon.png'
// import { supabase } from '../utils/SupabaseClient'

export default async function SignUp() {
  // const { data, error } = await supabase.auth.signInWithOtp({
  //   email: email,
  //   options: {
  //     emailRedirectTo: 'http://localhost:3000',
  //   },
  // })

  return (
    <section
      aria-labelledby="signup"
      className="flex min-h-screen items-center justify-center bg-slate-100"
    >
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" aria-label="Home">
            <div className="flex justify-center text-3xl font-bold text-blue-600">
              <Image src={Icon} alt="Icon" width={24} className="mr-3" />
            </div>
          </Link>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-4" action="#" method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required={false}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a
                    href="/signin"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Already have an account?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
