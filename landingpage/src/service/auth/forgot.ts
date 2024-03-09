"use server"

import { AuthForgotErrorResponse, AuthResponse } from "@/types/auth"
import prisma from "@/lib/prisma"
import sendEmail from "@/lib/sendEmail"
import resetPasswordTemplate from "@/template/resetPasswordTemplate"
import { encrypt } from "./auth"

export default async function forgot({
  email,
}: {
  email: string
}): Promise<AuthResponse<AuthForgotErrorResponse>> {
  try {
    // Check Exists record
    const checkEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    if (!checkEmail)
      return {
        message: "Email does not exist!",
        status: "error",
        error: { email: "Email does not exist!" },
      }

    // Check available Token
    const checkToken = await prisma.token.findFirst({
      where: {
        type: "FORGOT",
        userId: checkEmail.id,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
    })

    if (checkToken !== null)
      return {
        message: "Reset code has been already sent. Please try after 5 minutes.",
        status: "error",
        error: {},
      }

    // Generate Token
    const token = await encrypt({ id: checkEmail.id, name: checkEmail.name })

    // Create Token to DB
    await prisma.token.create({
      data: {
        userId: checkEmail.id,
        type: "FORGOT",
        value: token,
        expireDate: new Date(Date.now() + 5 * 60 * 1000),
      },
    })

    sendEmail(email, "Recover Account", resetPasswordTemplate(token), "FORGOT")

    return { message: "Reset code has been sent to your email.", status: "success" }
  } catch (error) {
    console.log("Internal server error. Failed to Forgot password: ", error)
    return { message: "Internal server error", status: "error", error: {} }
  }
}
