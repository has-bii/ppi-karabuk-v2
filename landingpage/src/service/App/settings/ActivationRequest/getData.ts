"use server"

import prisma from "@/lib/prisma"
import { getSession } from "@/utils/auth/session"

export default async function getData() {
  try {
    const session = await getSession()

    if (!session) return []

    const data = await prisma.activationRequest.findMany({
      where: { userId: session.id },
      select: { id: true, file: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    })

    return data
  } catch (error) {
    console.error("Error while fetching Activation Requests: ", error)
    return []
  }
}
