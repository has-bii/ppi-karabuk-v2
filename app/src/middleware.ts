// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // const res = NextResponse.next()
  // const supabase = createMiddlewareClient({ req, res })

  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  if (req.nextUrl.pathname.startsWith("/api")) return res

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is signed in and the current path is / redirect the user to /account
  if (user && req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && !req.nextUrl.pathname.startsWith("/auth")) {
    const url = new URL("/auth", req.nextUrl.origin)

    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/", "/auth"],
}
