import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  // workaround as Typescript doesn't know about the getSession property yet
  const auth: any = supabase.auth

  const {
    data: { session },
  } = await auth.getSession()

  if (!session) {
    const redirectUrl = req.nextUrl.clone()

    redirectUrl.pathname = "/auth/signin"
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/app/:path*", "/account"],
}
