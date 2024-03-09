"use server"

import { getSession } from "@/utils/auth/session"
import { logout } from "@/service/auth/auth"
import { Response } from "@/types/response"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { existsSync, unlinkSync } from "fs"

export default async function deleteAccount(formData: FormData): Promise<Response> {
  try {
    const password = formData.get("password")

    if (!password) return { status: "error", message: "Password is required!" }

    const session = await getSession()

    if (!session) return { status: "error", message: "You must login first!" }

    const user = await prisma.user.findUnique({ where: { id: session.id } })

    if (!user) return { status: "error", message: "Account doesn't exist!" }

    if (!bcrypt.compareSync(password.toString(), user.password))
      return { status: "error", message: "Password invalid!" }

    const activationRequest = await prisma.activationRequest.findMany({
      where: { userId: user.id },
    })

    activationRequest.forEach((item) => {
      if (existsSync("public" + item.file)) unlinkSync("public" + item.file)
    })

    await prisma.user.delete({ where: { id: session.id } })

    await logout()

    if (existsSync("public" + user.image)) unlinkSync("public" + user.image)

    return { status: "success", message: "Account has been deleted" }
  } catch (error) {
    console.error("Failed to delete account: ", error)
    return { status: "error", message: "Internal server error" }
  }
}
