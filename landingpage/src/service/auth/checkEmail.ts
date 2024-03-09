"use server"

import prisma from "@/lib/prisma"
import { AuthResponse } from "@/types/auth"

export default async function checkEmail(email: string): Promise<AuthResponse> {
  try {
    const _email = await prisma.user.findUnique({ where: { email: email } })

    if (_email) return { status: "error", message: "Email is already in use.", error: {} }

    return { status: "success", message: "Email is available." }
  } catch (error) {
    console.error("Failed to check email!\n", error)
    return { status: "error", message: "Internal server error!", error: {} }
  }
}
