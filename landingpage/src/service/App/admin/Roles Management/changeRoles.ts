"use server"

import prisma from "@/lib/prisma"
import { Response } from "@/types/response"
import { getSession } from "@/utils/auth/session"
import { Role } from "@prisma/client"

export default async function changeRoles(formData: FormData): Promise<Response> {
  try {
    const session = await getSession()

    if (!session || !session.role.includes("ADMIN"))
      return { status: "error", message: "Permission denied!" }

    const id = formData.get("input-id")
    const admin = formData.get("input-admin")
    const user = formData.get("input-user")
    const student = formData.get("input-student")

    if (!id) return { status: "danger", message: "ID is required!" }

    if (session.id === id.toString())
      return { status: "danger", message: "Cannot change your own role" }

    const changedUser = await prisma.user.findUnique({ where: { id: id.toString() } })

    if (!changedUser) return { status: "error", message: "User doesn't exist!" }

    let data: Role[] = []

    if (admin) data.push("ADMIN")
    if (user) data.push("USER")
    if (student) data.push("STUDENT")

    await prisma.user.update({ where: { id: changedUser.id }, data: { role: data } })

    return { status: "success", message: "User roles have been changed" }
  } catch (error) {
    console.error("Failed to change User Roles: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
