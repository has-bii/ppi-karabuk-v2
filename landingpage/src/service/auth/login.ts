"use server"

import { AuthLoginErrorResponse, AuthResponse } from "@/types/auth"
import bcrypt from "bcrypt"
import { encrypt } from "./auth"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

type Props = {
  email: string
  password: string
}

type Response = AuthResponse<AuthLoginErrorResponse>

export default async function login({ email, password }: Props): Promise<Response> {
  try {
    // Find User Record
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    if (!user)
      return {
        message: "Email is not registered!",
        status: "error",
        error: { email: "Email is not registered!" },
      }

    // Check Password
    const checkPW = bcrypt.compareSync(password, user.password)

    if (!checkPW)
      return {
        message: "Invalid password!",
        status: "error",
        error: { password: "Invalid password!" },
      }

    const session = await encrypt({
      id: user.id,
      name: user.name,
      role: user.role,
      image: user.image,
      isActive: user.isActive,
    })

    cookies().set("session", session, {
      sameSite: "strict",
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: true,
      httpOnly: true,
    })

    return { status: "success", message: "Logged in successfully" }
  } catch (error) {
    console.log("Internal server error. Failed to Login: ", error)
    return { message: "Internal server error", status: "error", error: {} }
  }
}
