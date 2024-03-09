import { cookies } from "next/headers"
import { decrypt, encrypt } from "../../service/auth/auth"
import { NextRequest, NextResponse } from "next/server"
import { UserSession } from "@/types/session"

export async function getSession(): Promise<null | UserSession> {
  const session = cookies().get("session")?.value
  if (!session) return null
  return await decrypt(session)
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value
  if (!session) return NextResponse.next()

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + 60 * 60 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  })
  return res
}

export async function changeSession<UserSession, K extends keyof UserSession>(
  obj: UserSession,
  key: K,
  value: UserSession[K]
) {
  obj[key] = value

  const updated = await encrypt(obj)

  cookies().set("session", updated, {
    sameSite: "strict",
    expires: new Date(Date.now() + 60 * 60 * 1000),
    secure: true,
    httpOnly: true,
  })
}
