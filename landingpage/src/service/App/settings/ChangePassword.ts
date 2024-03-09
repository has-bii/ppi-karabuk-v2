"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { getSession } from "@/utils/auth/session"

type Response = {
  status: "success" | "error"
  message: string
}

export default async function ChangePassword(formData: FormData): Promise<Response> {
  try {
    const currentPass = formData.get("current-password") as string
    const newPass = formData.get("new-password") as string

    const session = await getSession()

    if (!session) return { status: "error", message: "You must login first!" }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    })

    if (!user) return { status: "error", message: "User doesn't exist!" }

    // Check password
    if (!bcrypt.compareSync(currentPass, user.password))
      return { message: "Invalid password!", status: "error" }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: bcrypt.hashSync(newPass, 12),
      },
    })

    return { status: "success", message: "Password has been changed" }
  } catch (error) {
    console.error("Error while changing password: ", error)

    return { status: "error", message: "Internal server error!" }
  }
}
