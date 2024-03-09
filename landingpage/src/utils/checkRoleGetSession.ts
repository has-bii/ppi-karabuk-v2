import { Role } from "@prisma/client"
import { getSession } from "./auth/session"
import { logout } from "@/service/auth/auth"
import { redirect } from "next/navigation"

export default async function checkRoleGetSession(role: Role) {
  const session = await getSession()

  if (session === null) {
    await logout()
    redirect("/auth")
  }

  if (!session.role.includes(role)) redirect("/app")

  return session
}
