"use server"

import prisma from "@/lib/prisma"
import sendEmail from "@/lib/sendEmail"
import verificationEmailTemplate from "@/template/verificationEmailTemplate"
import { randomUUID } from "crypto"

type Response = {
  status: "success" | "error"
  message: string
}

export default async function sendEmailVerification(id: string, email: string): Promise<Response> {
  try {
    // Check Exists record
    const checkEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    if (!checkEmail)
      return {
        message: "Email does not exist!",
        status: "error",
      }

    // Check available Token
    const checkToken = await prisma.token.findFirst({
      where: {
        type: "EMAIL",
        userId: checkEmail.id,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
    })

    if (checkToken !== null)
      return {
        message: "Verification request has been already sent. Please try after 5 minutes.",
        status: "error",
      }

    const code = randomUUID()

    const token = await prisma.token.create({
      data: {
        type: "EMAIL",
        value: code,
        expireDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
        userId: id,
      },
    })

    sendEmail(email, "Verification Email", verificationEmailTemplate(token.value), "EMAIL")

    return { status: "success", message: "Verification request has been sent" }
  } catch (error) {
    console.log("Failed to send verification email request: ", error)
    return { status: "error", message: "Internal server error!" }
  }
}
