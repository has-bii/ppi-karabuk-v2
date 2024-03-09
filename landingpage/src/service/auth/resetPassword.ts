"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

type Response = {
  status: "error" | "success"
  message: string
}

export default async function resetPassword(formData: FormData): Promise<Response> {
  try {
    const password = formData.get("password")
    const token = formData.get("token")

    console.log("Password", password)
    console.log("token", token)

    if (!password) return { status: "error", message: "New password is required!" }
    if (!token) return { status: "error", message: "Token is required!" }

    const checkToken = await prisma.token.findUnique({ where: { value: token as string } })

    if (!checkToken) return { status: "error", message: "Token is invalid!" }

    await prisma.user.update({
      where: { id: checkToken.userId },
      data: { password: bcrypt.hashSync(password as string, 12) },
    })

    await prisma.token.delete({ where: { id: checkToken.id } })

    return { status: "success", message: "Password has been reset" }
  } catch (error) {
    console.error("Failed to reset password: ", error)
    return { message: "Internal server error", status: "error" }
  }
}
